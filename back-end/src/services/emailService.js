// emailService.js
import net from "net";
import tls from "tls";
import { Buffer } from "buffer";

const CRLF = "\r\n";

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
function buildMime({ from, to, cc, bcc, subject, text, html, attachments = [] }) {
  const date = new Date().toUTCString();
  const toList  = Array.isArray(to)  ? to.join(", ")  : to;
  const ccList  = cc  ? (Array.isArray(cc)  ? cc.join(", ")  : cc)  : undefined;
  const bccList = bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined;
  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@local>`;

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

  const altBoundary   = `alt_${Math.random().toString(36).slice(2)}`;
  const mixedBoundary = `mix_${Math.random().toString(36).slice(2)}`;

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

  if (!attachments || attachments.length === 0) {
    if (!html) {
      const headersWithCT = {
        ...headers,
        "Content-Type": `text/plain; charset="utf-8"`
      };
      return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${text || ""}${CRLF}`;
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
      `${text || ""}${CRLF}`;
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

  async send({ from, to, cc, bcc, subject, text, html, attachments }) {
    const { host, port, secure, user, pass, helo } = this.cfg;

    const rcpts = []
      .concat(to || [])
      .concat(cc || [])
      .concat(bcc || []);
    const recipients = Array.isArray(rcpts) ? rcpts : [rcpts];

    if (!from) throw new Error("Campo 'from' é obrigatório");
    if (!recipients.length) throw new Error("Ao menos um destinatário é obrigatório");

    const socket = secure
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
      attachments: Array.isArray(attachments) ? attachments : []
    });
    const normalized = raw.replace(/\r?\n/g, CRLF);
    const stuffed = dotStuff(normalized);

    socket.write(stuffed + CRLF + `.${CRLF}`);
    resp = await readResponse(socket);
    if (resp.code !== 250) throw new Error("Envio do corpo falhou: " + resp.lines.join("\n"));

    socket.write(`QUIT${CRLF}`);
    await readResponse(socket);

    socket.end();
    return { ok: true, message: "Enviado" };
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

export const sendScheduleConfirmation = async (scheduleData) => {
  try {
    const { host, port, secure, user, pass, helo, from, imobiliariaEmail, appointment } = scheduleData;
    
    const { name, email, phone, date, time, propertyAddress, propertyId, notes } = appointment;
    
    const client = new SMTPClient({ host, port, secure, user, pass, helo });

    // Conteúdo para o usuário
    const subjectUser = "Confirmação de Agendamento - Imobiliária Bortone";
    const textUser = `Olá ${name},\n\nSeu agendamento foi confirmado pela Imobiliária Bortone.\n\nData: ${date}\nHorário: ${time}\nImóvel: ${propertyAddress || "-"}${propertyId ? ` (ID: ${propertyId})` : ""}\nTelefone informado: ${phone || "-"}\n\nObservações: ${notes || "-"}\n\nAgradecemos a preferência!\n\nImobiliária Bortone`;
    
    const htmlUser = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color:#222; max-width:600px; margin:0 auto;">
  <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Imobiliária Bortone</h1>
  </div>
  <div style="padding: 20px;">
    <h2>Confirmação de Agendamento</h2>
    <p>Olá <strong>${name}</strong>, seu agendamento foi confirmado.</p>
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 10px 0;"><strong>Data:</strong> ${date}</li>
      <li style="margin: 10px 0;"><strong>Horário:</strong> ${time}</li>
      <li style="margin: 10px 0;"><strong>Imóvel:</strong> ${propertyAddress || "-"}${propertyId ? ` (ID: ${propertyId})` : ""}</li>
      <li style="margin: 10px 0;"><strong>Telefone informado:</strong> ${phone || "-"}</li>
    </ul>
    <p><strong>Observações:</strong> ${notes || "-"}</p>
    <p>Agradecemos a preferência!</p>
  </div>
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Imobiliaria Bortone</p>
  </div>
</div>`;

    // Conteúdo para a imobiliária
    const subjectImob = "Novo agendamento recebido - Imobiliária Bortone";
    const textImob = `Novo agendamento recebido:\n\nNome: ${name}\nE-mail: ${email}\nTelefone: ${phone || "-"}\nData: ${date}\nHorário: ${time}\nImóvel: ${propertyAddress || "-"}${propertyId ? ` (ID: ${propertyId})` : ""}\nObservações: ${notes || "-"}`;
    
    const htmlImob = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color:#222; max-width:600px; margin:0 auto;">
  <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Imobiliária Bortone</h1>
    <h2 style="margin: 10px 0 0 0;">Novo Agendamento</h2>
  </div>
  <div style="padding: 20px;">
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 10px 0;"><strong>Nome:</strong> ${name}</li>
      <li style="margin: 10px 0;"><strong>E-mail:</strong> ${email}</li>
      <li style="margin: 10px 0;"><strong>Telefone:</strong> ${phone || "-"}</li>
      <li style="margin: 10px 0;"><strong>Data:</strong> ${date}</li>
      <li style="margin: 10px 0;"><strong>Horário:</strong> ${time}</li>
      <li style="margin: 10px 0;"><strong>Imóvel:</strong> ${propertyAddress || "-"}${propertyId ? ` (ID: ${propertyId})` : ""}</li>
    </ul>
    <p><strong>Observações:</strong> ${notes || "-"}</p>
  </div>
</div>`;

    // Envia em paralelo
    const [toUser, toImob] = [email, imobiliariaEmail];
    await Promise.all([
      client.send({ from, to: toUser, subject: subjectUser, text: textUser, html: htmlUser }),
      client.send({ from, to: toImob, subject: subjectImob, text: textImob, html: htmlImob })
    ]);

    return { success: true, message: "Agendamento confirmado e e-mails enviados" };
  } catch (error) {
    throw new Error('Erro ao enviar confirmação de agendamento: ' + error.message);
  }
};
