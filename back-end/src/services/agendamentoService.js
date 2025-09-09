// agendamentoService.js
import net from "net";
import tls from "tls";
import { Buffer } from "buffer";

const CRLF = "\r\n";

// Rate limiting para agendamentos
const rateLimitBuckets = new Map();

function getRateLimitKey(ip, route) {
  return `${ip}::${route}`;
}

function checkRateLimit(ip, route, windowMs = 60_000, max = 5) {
  const now = Date.now();
  const key = getRateLimitKey(ip, route);

  let bucket = rateLimitBuckets.get(key);
  if (!bucket) {
    bucket = { count: 0, start: now };
    rateLimitBuckets.set(key, bucket);
  }

  if (now - bucket.start > windowMs) {
    bucket.count = 0;
    bucket.start = now;
  }

  bucket.count += 1;
  return bucket.count <= max;
}

// Limites e utilidades de sanitização
const LIMITS = {
  subject: 200,
  headerValue: 1000,
  textBody: 10000,
  htmlBody: 20000,
  name: 120,
  address: 200,
  notes: 2000
};

function truncate(str, max) {
  if (typeof str !== "string") return str;
  return str.length > max ? str.slice(0, max) : str;
}

function sanitizeHeaderValue(value, max = LIMITS.headerValue) {
  if (value == null) return "";
  const s = String(value).replace(/[\r\n]+/g, " ").trim();
  return truncate(s, max);
}

function normalizeEmail(email) {
  if (!email) return "";
  return String(email).trim().toLowerCase();
}

function isValidEmail(email) {
  if (!email) return false;
  const s = String(email);
  if (/[\r\n]/.test(s)) return false;
  // Regex simples e segura
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s);
}

/**
 * Lê respostas do servidor SMTP (inclui multi-linha: "250-..." até "250 ...").
 */
function createLineReader(socket) {
  let buffer = "";
  const listeners = [];

  const onData = (chunk) => {
    buffer += chunk.toString("utf8");

    let idx;
    while ((idx = buffer.indexOf("\r\n")) >= 0) {
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      listeners.forEach((fn) => fn(line));
    }
  };

  socket.on("data", onData);

  return {
    onLine(fn) {
      listeners.push(fn);
    },
    remove() {
      socket.off("data", onData);
    },
  };
}

/**
 * Aguarda uma resposta SMTP completa (tratando multi-linha).
 * Retorna { code, lines }.
 */
async function readResponse(socket) {
  return new Promise((resolve, reject) => {
    const lines = [];
    let code = null;
    const reader = createLineReader(socket);

    const onLine = (line) => {
      lines.push(line);
      const m = line.match(/^(\d{3})([ -])(.*)$/);
      if (m) {
        const currentCode = parseInt(m[1], 10);
        const sep = m[2];
        code = currentCode;
        if (sep === " ") {
          reader.remove();
          resolve({ code, lines });
        }
      }
    };

    reader.onLine(onLine);

    socket.setTimeout(20000, () => {
      reader.remove();
      reject(new Error("Timeout aguardando resposta SMTP"));
    });

    socket.once("error", (err) => {
      reader.remove();
      reject(err);
    });
  });
}

function base64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function dotStuff(body) {
  return body.replace(/\r?\n\./g, "\r\n..");
}

function joinHeaders(headersObj) {
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
 */
function buildMime({ from, to, cc, bcc, subject, text, html, replyTo, attachments = [] }) {
  const date = new Date().toUTCString();
  const toList  = Array.isArray(to)  ? to.join(", ")  : to;
  const ccList  = cc  ? (Array.isArray(cc)  ? cc.join(", ")  : cc)  : undefined;
  const bccList = bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined;
  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@local>`;

  const headers = {
    "From": sanitizeHeaderValue(from),
    "To": sanitizeHeaderValue(toList),
    ...(ccList ? { "Cc": ccList } : {}),
    ...(bccList ? { "Bcc": bccList } : {}),
    "Subject": sanitizeHeaderValue(truncate(subject ?? "", LIMITS.subject)),
    "Date": date,
    "Message-ID": messageId,
    "MIME-Version": "1.0"
  };
  if (replyTo) {
    headers["Reply-To"] = sanitizeHeaderValue(replyTo);
  }

  const altBoundary   = `alt_${Math.random().toString(36).slice(2)}`;
  const mixedBoundary = `mix_${Math.random().toString(36).slice(2)}`;

  const textPart =
    `--${altBoundary}${CRLF}` +
    `Content-Type: text/plain; charset="utf-8"${CRLF}` +
    `Content-Transfer-Encoding: 7bit${CRLF}${CRLF}` +
    `${truncate(text || "", LIMITS.textBody)}${CRLF}`;

  const htmlPart =
    `--${altBoundary}${CRLF}` +
    `Content-Type: text/html; charset="utf-8"${CRLF}` +
    `Content-Transfer-Encoding: 7bit${CRLF}${CRLF}` +
    `${truncate(html || "", LIMITS.htmlBody)}${CRLF}`;

  if (!attachments || attachments.length === 0) {
    if (!html) {
      const headersWithCT = {
        ...headers,
        "Content-Type": `text/plain; charset="utf-8"`
      };
      return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${truncate(text || "", LIMITS.textBody)}${CRLF}`;
    }

    const headersWithCT = {
      ...headers,
      "Content-Type": `multipart/alternative; boundary="${altBoundary}"`
    };
    const altBody = textPart + htmlPart + `--${altBoundary}--${CRLF}`;
    return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${altBody}`;
  }

  const headersWithCT = {
    ...headers,
    "Content-Type": `multipart/mixed; boundary="${mixedBoundary}"`
  };

  let mixedBody = "";

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
      `${truncate(text || "", LIMITS.textBody)}${CRLF}`;
  }

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

  return `${joinHeaders({ ...headersWithCT })}${CRLF}${CRLF}${mixedBody}`;
}

class SMTPClient {
  constructor({
    host,
    port = 587,
    secure = false,
    user,
    pass,
    helo = "localhost"
  }) {
    this.cfg = { host, port, secure, user, pass, helo };
  }

  async send({ from, to, cc, bcc, subject, text, html, replyTo, attachments }) {
    const { host, port, secure, user, pass, helo } = this.cfg;

    const rcpts = []
      .concat(to || [])
      .concat(cc || [])
      .concat(bcc || []);
    const recipients = Array.isArray(rcpts) ? rcpts : [rcpts];

    if (!from) throw new Error("Campo 'from' é obrigatório");
    if (!recipients.length) throw new Error("Ao menos um destinatário é obrigatório");

    let socket = null;
    try {
      socket = secure
        ? tls.connect(port, host, { servername: host })
        : net.connect(port, host);

      let resp = await readResponse(socket);
      if (resp.code !== 220) throw new Error("Falha no banner SMTP: " + resp.lines.join("\n"));

      socket.write(`EHLO ${helo}${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250) {
        socket.write(`HELO ${helo}${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 250) throw new Error("HELO/EHLO falhou: " + resp.lines.join("\n"));
      }

      const supportsStartTLS = resp.lines.some(l => l.toUpperCase().includes("STARTTLS"));
      if (!secure && supportsStartTLS) {
        socket.write(`STARTTLS${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 220) throw new Error("STARTTLS falhou: " + resp.lines.join("\n"));

        await new Promise((resolve) => {
          socket.removeAllListeners("data");
          const secured = tls.connect({ socket, servername: host }, () => resolve());
          socket.write = secured.write.bind(secured);
          socket.on = secured.on.bind(secured);
          socket.once = secured.once.bind(secured);
          socket.setTimeout = secured.setTimeout.bind(secured);
          socket.removeAllListeners = secured.removeAllListeners.bind(secured);
        });

        socket.write(`EHLO ${helo}${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 250) throw new Error("EHLO pós-STARTTLS falhou: " + resp.lines.join("\n"));
      }

      if (user && pass) {
        const supportsAuthLogin = resp.lines.some(l => /AUTH\b/i.test(l) && /LOGIN/i.test(l));
        const supportsAuthPlain = resp.lines.some(l => /AUTH\b/i.test(l) && /PLAIN/i.test(l));

        if (supportsAuthPlain) {
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

      socket.write(`MAIL FROM:<${from}>${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250) throw new Error("MAIL FROM falhou: " + resp.lines.join("\n"));

      for (const rcpt of recipients) {
        socket.write(`RCPT TO:<${rcpt}>${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 250 && resp.code !== 251) {
          throw new Error(`RCPT TO ${rcpt} falhou: ` + resp.lines.join("\n"));
        }
      }

      socket.write(`DATA${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 354) throw new Error("DATA não aceito: " + resp.lines.join("\n"));

      const raw = buildMime({
        from,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        replyTo,
        attachments: Array.isArray(attachments) ? attachments : []
      });
      const normalized = raw.replace(/\r?\n/g, CRLF);
      const stuffed = dotStuff(normalized);

      socket.write(stuffed + CRLF + `.${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250) throw new Error("Envio do corpo falhou: " + resp.lines.join("\n"));

      socket.write(`QUIT${CRLF}`);
      await readResponse(socket);

      return { ok: true, message: "Enviado" };
    } finally {
      if (socket && !socket.destroyed) {
        try { socket.end(); } catch {}
      }
    }
  }
}

// Serviços de email
export const sendEmail = async (emailData) => {
  try {
    const { host, port, secure, user, pass, helo, from, to, cc, bcc, subject, text, html, attachments } = emailData;
    
    const client = new SMTPClient({ host, port, secure, user, pass, helo });
    
    const result = await client.send({
      from,
      to,
      cc,
      bcc,
      subject: subject || "Mensagem da Imobiliária Bortone",
      text: text || "Olá! Este é um email da Imobiliária Bortone.",
      html: html || "",
      attachments: Array.isArray(attachments) ? attachments : []
    });

    return result;
  } catch (error) {
    throw new Error('Erro ao enviar email: ' + error.message);
  }
};

// Exportar função de rate limiting
export { checkRateLimit };

export const sendScheduleConfirmation = async (scheduleData) => {
  try {
    const { appointment } = scheduleData;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const helo = process.env.SMTP_HELO || "localhost";
    const fromEmpresa = process.env.MAIL_FROM_EMPRESA;
    const destinatarioEmpresa = process.env.MAIL_TO_EMPRESA || "agendamentos@imobiliaria-bortone.com.br";

    if (!host || !fromEmpresa) {
      throw new Error("Configuração SMTP ausente (SMTP_HOST e MAIL_FROM_EMPRESA são obrigatórios)");
    }

    const { name, email, phone, date, time, propertyAddress, propertyId, notes } = appointment || {};

    const userEmail = normalizeEmail(email);
    if (!isValidEmail(userEmail)) {
      throw new Error("E-mail do usuário inválido");
    }

    const cleanName = truncate(String(name || "").trim(), LIMITS.name);
    const cleanAddress = truncate(String(propertyAddress || "").trim(), LIMITS.address);
    const cleanNotes = truncate(String(notes || "").trim(), LIMITS.notes);

    const client = new SMTPClient({ host, port, secure, user, pass, helo });

    // Para o usuário
    const subjectUser = "Recebemos seu agendamento";
    const textUser = `Olá ${cleanName || ""}, recebemos seu agendamento na Imobiliária Bortone. Em breve entraremos em contato para confirmar os detalhes. Data: ${date} - Horário: ${time}.`;
    const htmlUser = `<p>Olá <strong>${cleanName || ""}</strong>, recebemos seu agendamento na Imobiliária Bortone.</p><p>Em breve entraremos em contato para confirmar os detalhes.</p><p>Data: ${sanitizeHeaderValue(date || "")} - Horário: ${sanitizeHeaderValue(time || "")}.</p>`;

    // Para a empresa
    const imovelTag = cleanAddress || (propertyId ? `ID ${propertyId}` : "Imóvel");
    const subjectImob = `Novo agendamento: ${cleanName || ""}/${imovelTag}`;
    const textImob = `Novo agendamento:\nNome: ${cleanName}\nE-mail: ${userEmail}\nTelefone: ${phone || "-"}\nData: ${date}\nHorário: ${time}\nImóvel: ${imovelTag}\nObservações: ${cleanNotes || "-"}`;
    const htmlImob = `<div><h3>Novo agendamento</h3><ul><li><strong>Nome:</strong> ${cleanName}</li><li><strong>E-mail:</strong> ${userEmail}</li><li><strong>Telefone:</strong> ${phone || "-"}</li><li><strong>Data:</strong> ${sanitizeHeaderValue(date || "")}</li><li><strong>Horário:</strong> ${sanitizeHeaderValue(time || "")}</li><li><strong>Imóvel:</strong> ${sanitizeHeaderValue(imovelTag)}</li></ul><p><strong>Observações:</strong> ${cleanNotes || "-"}</p></div>`;

    await Promise.all([
      client.send({ from: fromEmpresa, to: userEmail, subject: subjectUser, text: textUser, html: htmlUser }),
      client.send({ from: fromEmpresa, to: destinatarioEmpresa, subject: subjectImob, text: textImob, html: htmlImob, replyTo: userEmail })
    ]);

    return { success: true, message: "Agendamento confirmado e e-mails enviados" };
  } catch (error) {
    throw new Error('Erro ao enviar confirmação de agendamento: ' + error.message);
  }
};
