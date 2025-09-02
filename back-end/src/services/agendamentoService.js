// smtpClient.js
import net from "net";
import tls from "tls";
import { Buffer } from "buffer";

const CRLF = "\r\n";

/**
 * Lê respostas do servidor SMTP (inclui multi-linha: "250-..." até "250 ...").
 */
function createLineReader(socket) {
  let buffer = ""; // Buffer que acumula os dados recebidos do socket até encontrar uma quebra de linha
  const listeners = []; // Lista de funções que serão chamadas quando uma linha completa for recebida

  const onData = (chunk) => { // Função chamada sempre que chegam novos dados do socket
    buffer += chunk.toString("utf8"); // Converte o chunk de dados para string UTF-8 e adiciona ao buffer

    let idx;
    while ((idx = buffer.indexOf("\r\n")) >= 0) { // Procura continuamente por CRLF (\r\n) dentro do buffer
      const line = buffer.slice(0, idx); // Extrai a linha completa (do início até antes de \r\n)
      buffer = buffer.slice(idx + 2); // Remove a linha processada (incluindo o \r\n) do buffer
      listeners.forEach((fn) => fn(line)); // Notifica todos os listeners, passando a linha encontrada
    }
  };

  socket.on("data", onData); // Registra a função onData para ser chamada sempre que o socket receber dados

  return { // Retorna uma API para o usuário interagir
    onLine(fn) { // Permite registrar novas funções que serão chamadas ao receber uma linha
      listeners.push(fn);
    },
    remove() { // Remove o listener do socket (interrompe a leitura de linhas)
      socket.off("data", onData);
    },
  };
}

/**
 * Aguarda uma resposta SMTP completa (tratando multi-linha).
 * Retorna { code, lines }.
 */
async function readResponse(socket) { // Função assíncrona que lê a resposta completa via socket
  return new Promise((resolve, reject) => {
    const lines = [];   // Armazena todas as linhas recebidas do servidor
    let code = null;    // Código numérico final (220, 250, 354, 235, ...)
    const reader = createLineReader(socket); // Cria um leitor de linhas baseado no socket

    const onLine = (line) => { // Chamado sempre que recebemos uma nova linha
      lines.push(line);
      // Formato: 250-continua / 250 fim
      const m = line.match(/^(\d{3})([ -])(.*)$/);
      if (m) {
        const currentCode = parseInt(m[1], 10); // Extrai o código numérico (ex: 250)
        const sep = m[2]; // "-" = mais linhas virão; " " = última linha
        code = currentCode;
        if (sep === " ") { // Última linha da resposta
          reader.remove();
          resolve({ code, lines });
        }
      } else {
        // Linha fora do padrão (alguns servidores mandam banners estranhos).
        // Se já temos ao menos uma com código, ignoramos; caso contrário, continuamos lendo.
      }
    };

    reader.onLine(onLine); // Registra o callback para processar cada linha

    // Timeout de segurança (20s). Se exceder, rejeita a Promise.
    socket.setTimeout(20000, () => {
      reader.remove();
      reject(new Error("Timeout aguardando resposta SMTP"));
    });

    // Se ocorrer um erro no socket, também rejeitamos a Promise
    socket.once("error", (err) => {
      reader.remove();
      reject(err);
    });
  });
}

function base64(str) {
  return Buffer.from(str, "utf8").toString("base64"); // Converte string em base64 (AUTH)
}

function dotStuff(body) {
  // No bloco DATA do SMTP, qualquer linha que começa com "." deve virar ".."
  return body.replace(/\r?\n\./g, "\r\n..");
}

function joinHeaders(headersObj) {
  // Converte objeto {Chave: Valor} em linhas "Chave: Valor" separadas por CRLF
  return Object.entries(headersObj)
    .map(([k, v]) => `${k}: ${v}`)
    .join(CRLF);
}

/**
 * Monta MIME corretamente para 3 cenários:
 *  A) Só texto (html vazio) -> topo = text/plain
 *  B) Texto + HTML (sem anexos) -> topo = multipart/alternative
 *  C) Com anexos -> topo = multipart/mixed; primeiro part é:
 *     - multipart/alternative (se houver HTML), ou
 *     - text/plain (se NÃO houver HTML)
 *
 * IMPORTANTE:
 *  - O "Content-Type" de TOPO vai nos CABEÇALHOS
 *  - Precisa haver CRLF CRLF separando cabeçalhos do corpo
 */
function buildMime({ from, to, cc, bcc, subject, text, html, attachments = [] }) {
  const date = new Date().toUTCString(); // Cabeçalho Date
  const toList  = Array.isArray(to)  ? to.join(", ")  : to;   // "To" pode ser array
  const ccList  = cc  ? (Array.isArray(cc)  ? cc.join(", ")  : cc)  : undefined;
  const bccList = bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined;
  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@local>`; // ID único

  // Cabeçalhos comuns
  const headers = {
    "From": from,
    "To": toList,
    ...(ccList ? { "Cc": ccList } : {}),
    ...(bccList ? { "Bcc": bccList } : {}),
    "Subject": subject ?? "",
    "Date": date,
    "Message-ID": messageId,
    "MIME-Version": "1.0"
  };

  // Boundaries (separadores de partes)
  const altBoundary   = `alt_${Math.random().toString(36).slice(2)}`;
  const mixedBoundary = `mix_${Math.random().toString(36).slice(2)}`;

  // Partes text/plain e text/html para o multipart/alternative (usadas apenas quando html existe)
  const textPart =
    `--${altBoundary}${CRLF}` +
    `Content-Type: text/plain; charset="utf-8"${CRLF}` +
    `Content-Transfer-Encoding: 7bit${CRLF}${CRLF}` +
    `${text || ""}${CRLF}`;

  const htmlPart =
    `--${altBoundary}${CRLF}` +
    `Content-Type: text/html; charset="utf-8"${CRLF}` +
    `Content-Transfer-Encoding: 7bit${CRLF}${CRLF}` +
    `${html || ""}${CRLF}`;

  // ===== Caso A: sem anexos =====
  if (!attachments || attachments.length === 0) {
    // A1) Só texto (html vazio) -> Content-Type de topo = text/plain
    if (!html) {
      const headersWithCT = {
        ...headers,
        "Content-Type": `text/plain; charset="utf-8"`
      };
      // CRLF CRLF separa cabeçalhos do corpo
      return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${text || ""}${CRLF}`;
    }

    // A2) Texto + HTML -> topo = multipart/alternative
    const headersWithCT = {
      ...headers,
      "Content-Type": `multipart/alternative; boundary="${altBoundary}"`
    };
    const altBody = textPart + htmlPart + `--${altBoundary}--${CRLF}`;
    return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${altBody}`;
  }

  // ===== Caso B: com anexos -> topo = multipart/mixed =====
  const headersWithCT = {
    ...headers,
    "Content-Type": `multipart/mixed; boundary="${mixedBoundary}"`
  };

  let mixedBody = "";

  // B1) Primeiro part do mixed: ou alternative (se tem HTML) ou só text/plain
  if (html) {
    const altBody = textPart + htmlPart + `--${altBoundary}--${CRLF}`;
    mixedBody +=
      `--${mixedBoundary}${CRLF}` +
      `Content-Type: multipart/alternative; boundary="${altBoundary}"${CRLF}${CRLF}` +
      altBody;
  } else {
    mixedBody +=
      `--${mixedBoundary}${CRLF}` +
      `Content-Type: text/plain; charset="utf-8"${CRLF}` +
      `Content-Transfer-Encoding: 7bit${CRLF}${CRLF}` +
      `${text || ""}${CRLF}`;
  }

  // B2) Anexos
  for (const att of attachments) {
    const { filename, contentBase64, contentType = "application/octet-stream" } = att;
    mixedBody +=
      `--${mixedBoundary}${CRLF}` +
      `Content-Type: ${contentType}; name="${filename}"${CRLF}` +
      `Content-Transfer-Encoding: base64${CRLF}` +
      `Content-Disposition: attachment; filename="${filename}"${CRLF}${CRLF}` +
      `${contentBase64}${CRLF}`;
  }

  mixedBody += `--${mixedBoundary}--${CRLF}`;

  // Cabeçalho de topo + linha em branco + corpo mixed
  return `${joinHeaders({ ...headersWithCT })}${CRLF}${CRLF}${mixedBody}`;
}

export class SMTPClient { // Cliente SMTP "puro"
  constructor({
    host,             // Ex.: smtp.gmail.com
    port = 587,       // 587 (STARTTLS) / 465 (TLS direto)
    secure = false,   // true = TLS implícito (465); false = começa simples e sobe STARTTLS
    user,             // Usuário para AUTH
    pass,             // Senha (ou App Password)
    helo = "localhost"// Identificação no EHLO/HELO (use seu domínio)
  }) {
    this.cfg = { host, port, secure, user, pass, helo };
  }

  async send({ from, to, cc, bcc, subject, text, html, attachments }) {
    const { host, port, secure, user, pass, helo } = this.cfg;

    // Junta todos os destinatários (to + cc + bcc)
    const rcpts = []
      .concat(to || [])
      .concat(cc || [])
      .concat(bcc || []);
    const recipients = Array.isArray(rcpts) ? rcpts : [rcpts];

    if (!from) throw new Error("Campo 'from' é obrigatório");
    if (!recipients.length) throw new Error("Ao menos um destinatário é obrigatório");

    // ATENÇÃO: aqui o 'from' é o do ENVELOPE SMTP. Use só o e-mail (sem "Nome <...>").
    const socket = secure
      ? tls.connect(port, host, { servername: host }) // TLS direto (465)
      : net.connect(port, host);                      // Conexão simples (para STARTTLS depois)

    // 1) Banner (220)
    let resp = await readResponse(socket);
    if (resp.code !== 220) throw new Error("Falha no banner SMTP: " + resp.lines.join("\n"));

    // 2) EHLO (ou HELO)
    socket.write(`EHLO ${helo}${CRLF}`);
    resp = await readResponse(socket);
    if (resp.code !== 250) {
      socket.write(`HELO ${helo}${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250) throw new Error("HELO/EHLO falhou: " + resp.lines.join("\n"));
    }

    // 3) STARTTLS (se 587 e suportado)
    const supportsStartTLS = resp.lines.some(l => l.toUpperCase().includes("STARTTLS"));
    if (!secure && supportsStartTLS) {
      socket.write(`STARTTLS${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 220) throw new Error("STARTTLS falhou: " + resp.lines.join("\n"));

      // Upgrade para TLS
      await new Promise((resolve) => {
        socket.removeAllListeners("data"); // evita leitores antigos
        const secured = tls.connect({ socket, servername: host }, () => resolve());
        // Redireciona métodos para usar a conexão TLS "por cima" do mesmo socket
        socket.write = secured.write.bind(secured);
        socket.on = secured.on.bind(secured);
        socket.once = secured.once.bind(secured);
        socket.setTimeout = secured.setTimeout.bind(secured);
        socket.removeAllListeners = secured.removeAllListeners.bind(secured);
      });

      // EHLO novamente após STARTTLS
      socket.write(`EHLO ${helo}${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250) throw new Error("EHLO pós-STARTTLS falhou: " + resp.lines.join("\n"));
    }

    // 4) AUTH (se user/pass informados)
    if (user && pass) {
      const supportsAuthLogin = resp.lines.some(l => /AUTH\b/i.test(l) && /LOGIN/i.test(l));
      const supportsAuthPlain = resp.lines.some(l => /AUTH\b/i.test(l) && /PLAIN/i.test(l));

      if (supportsAuthPlain) {
        // AUTH PLAIN base64(\0user\0pass)
        const payload = base64(`\u0000${user}\u0000${pass}`);
        socket.write(`AUTH PLAIN ${payload}${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 235) throw new Error("AUTH PLAIN falhou: " + resp.lines.join("\n"));
      } else if (supportsAuthLogin) {
        socket.write(`AUTH LOGIN${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 334) throw new Error("AUTH LOGIN não aceito: " + resp.lines.join("\n"));

        socket.write(base64(user) + CRLF);
        resp = await readResponse(socket);
        if (resp.code !== 334) throw new Error("Usuário não aceito: " + resp.lines.join("\n"));

        socket.write(base64(pass) + CRLF);
        resp = await readResponse(socket);
        if (resp.code !== 235) throw new Error("Senha não aceita: " + resp.lines.join("\n"));
      } else {
        throw new Error("Servidor não anuncia AUTH PLAIN/Login");
      }
    }

    // 5) MAIL FROM (envelope) — use apenas o endereço puro
    socket.write(`MAIL FROM:<${from}>${CRLF}`);
    resp = await readResponse(socket);
    if (resp.code !== 250) throw new Error("MAIL FROM falhou: " + resp.lines.join("\n"));

    // 6) RCPT TO (para cada destinatário)
    for (const rcpt of recipients) {
      socket.write(`RCPT TO:<${rcpt}>${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250 && resp.code !== 251) {
        throw new Error(`RCPT TO ${rcpt} falhou: ` + resp.lines.join("\n"));
      }
    }

    // 7) DATA
    socket.write(`DATA${CRLF}`);
    resp = await readResponse(socket);
    if (resp.code !== 354) throw new Error("DATA não aceito: " + resp.lines.join("\n"));

    // 8) Corpo MIME completo
    const raw = buildMime({
      from,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments: Array.isArray(attachments) ? attachments : []
    });
    const normalized = raw.replace(/\r?\n/g, CRLF); // Normaliza \n para \r\n
    const stuffed = dotStuff(normalized);           // Aplica dot-stuffing

    socket.write(stuffed + CRLF + `.${CRLF}`); // Encerra DATA com linha "."
    resp = await readResponse(socket);
    if (resp.code !== 250) throw new Error("Envio do corpo falhou: " + resp.lines.join("\n"));

    // 9) QUIT
    socket.write(`QUIT${CRLF}`);
    await readResponse(socket);

    socket.end();
    return { ok: true, message: "Enviado" };
  }
}
