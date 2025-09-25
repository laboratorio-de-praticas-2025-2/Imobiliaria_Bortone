// src/services/agendamentoService.js
import net from "net";
import tls from "tls";
import { Buffer } from "buffer";

const CRLF = "\r\n";

/* =========================
   Helpers de template/HTML
   ========================= */

export function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// “Shell” estilizado (email base). Injete seu bodyHTML aqui.
export function emailShell({
  title = "",
  bodyHTML = "",
  ctaHref = "",
  ctaLabel = "",
  footerNote = "",
} = {}) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;">
    <tr>
      <td style="padding:24px 16px 0;">
        <div style="background:#2c5aa0;color:#fff;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
          <div style="font-size:22px;font-weight:700;margin:0;">Imobiliária Bortone</div>
          ${
            title
              ? `<div style="opacity:.95;margin-top:6px;">${esc(title)}</div>`
              : ""
          }
        </div>
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:0;padding:24px;border-radius:0 0 12px 12px;">
          ${bodyHTML}
          ${
            ctaHref && ctaLabel
              ? `
          <div style="text-align:center;margin-top:24px;">
            <a href="${ctaHref}" style="display:inline-block;background:#2c5aa0;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
              ${esc(ctaLabel)}
            </a>
          </div>`
              : ""
          }
        </div>
        <div style="text-align:center;color:#6b7280;font-size:12px;margin:16px 0 32px;">
          ${footerNote ? esc(footerNote) : "Dúvidas? Responda este e-mail."}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* =========================
   Rate limiting e segurança
   ========================= */
const rateLimitBuckets = new Map();
const WHITELIST_IPS = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
const BLACKLIST_IPS = [];
const suspiciousAttempts = new Map();

function getRateLimitKey(ip, route) {
  return `${ip}::${route}`;
}
function isWhitelistedIP(ip) {
  return WHITELIST_IPS.includes(ip);
}
function isBlacklistedIP(ip) {
  return BLACKLIST_IPS.includes(ip);
}
function logSuspiciousActivity(ip, reason) {
  const now = Date.now();
  const key = `${ip}::${reason}`;
  if (!suspiciousAttempts.has(key)) {
    suspiciousAttempts.set(key, { count: 0, firstSeen: now, lastSeen: now });
  }
  const attempt = suspiciousAttempts.get(key);
  attempt.count += 1;
  attempt.lastSeen = now;

  console.warn(
    `[SECURITY] Suspicious activity from ${ip}: ${reason} (count: ${attempt.count})`
  );

  if (attempt.count > 10 && now - attempt.firstSeen < 300000) {
    BLACKLIST_IPS.push(ip);
    console.error(
      `[SECURITY] IP ${ip} temporarily blacklisted due to suspicious activity`
    );
  }
}

export function checkRateLimit(ip, route, windowMs = 60_000, max = 5) {
  if (isBlacklistedIP(ip)) {
    logSuspiciousActivity(ip, "blacklisted_ip_attempt");
    return false;
  }
  if (isWhitelistedIP(ip)) return true;

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

  if (bucket.count > max) {
    logSuspiciousActivity(ip, "rate_limit_exceeded");
  }
  return bucket.count <= max;
}

/* =========================
   Sanitização & limites
   ========================= */
const LIMITS = {
  subject: 200,
  headerValue: 1000,
  textBody: 10000,
  htmlBody: 20000,
  name: 120,
  address: 200,
  notes: 2000,
  attachmentSize: 10485760, // 10MB
  attachmentName: 255,
};

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function validateAttachment(attachment) {
  if (!attachment || typeof attachment !== "object") {
    throw new Error("Anexo inválido");
  }
  const {
    filename,
    contentBase64,
    contentType = "application/octet-stream",
  } = attachment;
  if (!filename || typeof filename !== "string")
    throw new Error("Nome do arquivo é obrigatório");
  if (!contentBase64 || typeof contentBase64 !== "string")
    throw new Error("Conteúdo do arquivo é obrigatório");
  if (filename.length > LIMITS.attachmentName) {
    throw new Error(
      `Nome do arquivo muito longo (máximo ${LIMITS.attachmentName} caracteres)`
    );
  }
  if (/[<>:"/\\|?*]/.test(filename)) {
    throw new Error("Nome do arquivo contém caracteres inválidos");
  }
  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    throw new Error(`Tipo de arquivo não permitido: ${contentType}`);
  }
  if (contentBase64.length > LIMITS.attachmentSize) {
    throw new Error(
      `Arquivo muito grande (máximo ${LIMITS.attachmentSize} bytes)`
    );
  }
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(contentBase64)) {
    throw new Error("Conteúdo do arquivo não é base64 válido");
  }
  return { filename, contentBase64, contentType };
}

function truncate(str, max) {
  if (typeof str !== "string") return str;
  return str.length > max ? str.slice(0, max) : str;
}
function sanitizeHeaderValue(value, max = LIMITS.headerValue) {
  if (value == null) return "";
  const s = String(value)
    .replace(/[\r\n]+/g, " ")
    .trim();
  return truncate(s, max);
}
function normalizeEmail(email) {
  if (!email) return "";
  return String(email).trim().toLowerCase();
}

const BLOCKED_DOMAINS = [
  "tempmail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "throwaway.email",
];

function isValidEmailDomain(email) {
  if (!email) return false;
  const domain = email.split("@")[1];
  if (!domain) return false;
  if (BLOCKED_DOMAINS.includes(domain.toLowerCase())) return false;
  if (!domain.includes(".")) return false;
  return true;
}
function isValidEmail(email) {
  if (!email) return false;
  const s = String(email);
  if (/[\r\n]/.test(s)) return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(s)) return false;
  return isValidEmailDomain(s);
}

/* =========================
   SMTP baixo nível
   ========================= */
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

function buildMime({
  from,
  to,
  cc,
  bcc,
  subject,
  text,
  html,
  replyTo,
  attachments = [],
}) {
  const date = new Date().toUTCString();
  const toList = Array.isArray(to) ? to.join(", ") : to;
  const ccList = cc ? (Array.isArray(cc) ? cc.join(", ") : cc) : undefined;
  const bccList = bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined;
  const messageId = `<${Date.now()}.${Math.random()
    .toString(36)
    .slice(2)}@local>`;

  const headers = {
    From: sanitizeHeaderValue(from),
    To: sanitizeHeaderValue(toList),
    ...(ccList ? { Cc: ccList } : {}),
    ...(bccList ? { Bcc: bccList } : {}),
    Subject: sanitizeHeaderValue(truncate(subject ?? "", LIMITS.subject)),
    Date: date,
    "Message-ID": messageId,
    "MIME-Version": "1.0",
  };
  if (replyTo) headers["Reply-To"] = sanitizeHeaderValue(replyTo);

  const altBoundary = `alt_${Math.random().toString(36).slice(2)}`;
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
        "Content-Type": `text/plain; charset="utf-8"`,
      };
      return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${truncate(
        text || "",
        LIMITS.textBody
      )}${CRLF}`;
    }
    const headersWithCT = {
      ...headers,
      "Content-Type": `multipart/alternative; boundary="${altBoundary}"`,
    };
    const altBody = textPart + htmlPart + `--${altBoundary}--${CRLF}`;
    return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${altBody}`;
  }

  const headersWithCT = {
    ...headers,
    "Content-Type": `multipart/mixed; boundary="${mixedBoundary}"`,
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
    const validatedAttachment = validateAttachment(att);
    const { filename, contentBase64, contentType } = validatedAttachment;
    const sanitizedFilename = filename.replace(/[^\x20-\x7E]/g, "");
    mixedBody +=
      `--${mixedBoundary}${CRLF}` +
      `Content-Type: ${contentType}; name="${sanitizedFilename}"${CRLF}` +
      `Content-Transfer-Encoding: base64${CRLF}` +
      `Content-Disposition: attachment; filename="${sanitizedFilename}"${CRLF}${CRLF}` +
      `${contentBase64}${CRLF}`;
  }

  mixedBody += `--${mixedBoundary}--${CRLF}`;
  return `${joinHeaders(headersWithCT)}${CRLF}${CRLF}${mixedBody}`;
}

class SMTPClient {
  constructor({
    host,
    port = 587,
    secure = false,
    user,
    pass,
    helo = "localhost",
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
    if (!recipients.length)
      throw new Error("Ao menos um destinatário é obrigatório");

    let socket = null;
    try {
      socket = secure
        ? tls.connect(port, host, { servername: host })
        : net.connect(port, host);

      let resp = await readResponse(socket);
      if (resp.code !== 220)
        throw new Error("Falha no banner SMTP: " + resp.lines.join("\n"));

      socket.write(`EHLO ${helo}${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250) {
        socket.write(`HELO ${helo}${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 250)
          throw new Error("HELO/EHLO falhou: " + resp.lines.join("\n"));
      }

      const supportsStartTLS = resp.lines.some((l) =>
        l.toUpperCase().includes("STARTTLS")
      );
      if (!secure && supportsStartTLS) {
        socket.write(`STARTTLS${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 220)
          throw new Error("STARTTLS falhou: " + resp.lines.join("\n"));

        await new Promise((resolve) => {
          socket.removeAllListeners("data");
          const secured = tls.connect({ socket, servername: host }, () =>
            resolve()
          );
          socket.write = secured.write.bind(secured);
          socket.on = secured.on.bind(secured);
          socket.once = secured.once.bind(secured);
          socket.setTimeout = secured.setTimeout.bind(secured);
          socket.removeAllListeners = secured.removeAllListeners.bind(secured);
        });

        socket.write(`EHLO ${helo}${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 250)
          throw new Error("EHLO pós-STARTTLS falhou: " + resp.lines.join("\n"));
      }

      if (user && pass) {
        const supportsAuthLogin = resp.lines.some(
          (l) => /AUTH\b/i.test(l) && /LOGIN/i.test(l)
        );
        const supportsAuthPlain = resp.lines.some(
          (l) => /AUTH\b/i.test(l) && /PLAIN/i.test(l)
        );

        if (supportsAuthPlain) {
          const payload = base64(`\u0000${user}\u0000${pass}`);
          socket.write(`AUTH PLAIN ${payload}${CRLF}`);
          resp = await readResponse(socket);
          if (resp.code !== 235)
            throw new Error("AUTH PLAIN falhou: " + resp.lines.join("\n"));
        } else if (supportsAuthLogin) {
          socket.write(`AUTH LOGIN${CRLF}`);
          resp = await readResponse(socket);
          if (resp.code !== 334)
            throw new Error("AUTH LOGIN não aceito: " + resp.lines.join("\n"));

          socket.write(base64(user) + CRLF);
          resp = await readResponse(socket);
          if (resp.code !== 334)
            throw new Error("Usuário não aceito: " + resp.lines.join("\n"));

          socket.write(base64(pass) + CRLF);
          resp = await readResponse(socket);
          if (resp.code !== 235)
            throw new Error("Senha não aceita: " + resp.lines.join("\n"));
        } else {
          throw new Error("Servidor não anuncia AUTH PLAIN/Login");
        }
      }

      socket.write(`MAIL FROM:<${from}>${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250)
        throw new Error("MAIL FROM falhou: " + resp.lines.join("\n"));

      for (const rcpt of recipients) {
        socket.write(`RCPT TO:<${rcpt}>${CRLF}`);
        resp = await readResponse(socket);
        if (resp.code !== 250 && resp.code !== 251) {
          throw new Error(`RCPT TO ${rcpt} falhou: ` + resp.lines.join("\n"));
        }
      }

      socket.write(`DATA${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 354)
        throw new Error("DATA não aceito: " + resp.lines.join("\n"));

      const raw = buildMime({
        from,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        replyTo,
        attachments: Array.isArray(attachments) ? attachments : [],
      });
      const normalized = raw.replace(/\r?\n/g, CRLF);
      const stuffed = dotStuff(normalized);

      socket.write(stuffed + CRLF + `.${CRLF}`);
      resp = await readResponse(socket);
      if (resp.code !== 250)
        throw new Error("Envio do corpo falhou: " + resp.lines.join("\n"));

      socket.write(`QUIT${CRLF}`);
      await readResponse(socket);

      return { ok: true, message: "Enviado" };
    } finally {
      if (socket && !socket.destroyed) {
        try {
          socket.end();
        } catch {}
      }
    }
  }
}

/* =========================
   Serviços de e-mail (API)
   ========================= */
export const sendEmail = async (emailData) => {
  try {
    const {
      host,
      port,
      secure,
      user,
      pass,
      helo,
      from,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      attachments,
    } = emailData;

    const client = new SMTPClient({ host, port, secure, user, pass, helo });

    const result = await client.send({
      from,
      to,
      cc,
      bcc,
      subject: subject || "Mensagem da Imobiliária Bortone",
      text: text || "Olá! Este é um email da Imobiliária Bortone.",
      html: html || "",
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    return result;
  } catch (error) {
    throw new Error("Erro ao enviar email: " + error.message);
  }
};

export const sendScheduleConfirmation = async (scheduleData) => {
  try {
    const { appointment } = scheduleData;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : 587;
    const secure =
      String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const helo = process.env.SMTP_HELO || "localhost";
    const fromEmpresa = process.env.MAIL_FROM_EMPRESA;
    const destinatarioEmpresa =
      process.env.MAIL_TO_EMPRESA || "agendamentos@imobiliaria-bortone.com.br";

    if (!host || !fromEmpresa) {
      throw new Error(
        "Configuração SMTP ausente (SMTP_HOST e MAIL_FROM_EMPRESA são obrigatórios)"
      );
    }

    const { name, email, phone, propertyAddress, propertyId, notes } =
      appointment || {};

    const userEmail = normalizeEmail(email);
    if (!isValidEmail(userEmail)) {
      throw new Error("E-mail do usuário inválido");
    }

    const cleanName = truncate(String(name || "").trim(), LIMITS.name);
    const cleanAddress = truncate(
      String(propertyAddress || "").trim(),
      LIMITS.address
    );
    const cleanNotes = truncate(String(notes || "").trim(), LIMITS.notes);
    const cleanPhone = (phone || "-").toString().trim();

    const whenDate = (appointment?.date || "").toString().trim();
    const whenTime = (appointment?.time || "").toString().trim();
    const imovelTag =
      cleanAddress || (propertyId ? `ID ${propertyId}` : "Imóvel");

    const client = new SMTPClient({ host, port, secure, user, pass, helo });

// Defina o valor base da URL, caso a variável de ambiente não esteja configurada
const urlBase1 = process.env.DASH_IMOB_URL || "https://imobiliaria-bortone.vercel.app";

// Monta a URL do imóvel usando o ID da propriedade
let urlImovel = `${urlBase1}/imoveis/${encodeURIComponent(propertyId)}`;

// Garantindo que a URL tenha o protocolo correto
if (urlImovel.indexOf("://") === -1) {
  urlImovel = `https://${urlImovel}`;
}

// Usuário
const subjectUser = "Recebemos seu agendamento – Imobiliária Bortone";

const textUser =
  `Olá ${cleanName || "usuário"}, recebemos seu agendamento.\n\n` +
  `Em breve entraremos em contato para confirmar os detalhes.\n\n` +
  `Imobiliária Bortone`;

const htmlUser = emailShell({
  title: "Agendamento recebido",
  bodyHTML: `
    <p style="margin: 0 0 12px;">
      Olá <strong>${esc(cleanName || "usuário")}</strong>,
    </p>
    <p style="margin: 0 0 16px;">
      Recebemos seu agendamento e já estamos verificando a disponibilidade.
    </p>

    ${
      cleanNotes
        ? `<p style="margin:16px 0 0;">
            <strong>Observações:</strong> ${esc(cleanNotes)}
          </p>`
        : ""
    }

    <p style="margin:16px 0 0;">
      Em breve entraremos em contato para confirmar os detalhes.
    </p>

    <!-- Adiciona o link ao final do corpo do e-mail -->
    <p style="margin:16px 0 0;">
       link do imóvel:  <a href="${urlImovel}">${urlImovel}</a>
    </p>
  `,
  footerNote: "Dúvidas? Responda este e-mail.",
});

// Envio de e-mail com o corpo HTML
await client.send({
  from: fromEmpresa,
  to: userEmail,
  subject: subjectUser,
  text: textUser,
  html: htmlUser,
});


    // Imobiliária
    const subjectImob = `Novo agendamento: ${cleanName || ""} / ${imovelTag}`;
    const textImob =
      `Novo agendamento\n` +
      `Nome: ${cleanName}\nE-mail: ${userEmail}\nTelefone: ${cleanPhone}\n` +
      (whenDate || whenTime ? `Data/Horário: ${whenDate} ${whenTime}\n` : ``) +
      `Imóvel: ${imovelTag}\n` +
      (cleanAddress ? `Endereço: ${cleanAddress}\n` : ``) +
      `Observações: ${cleanNotes || "-"}`;
      
// Função para transformar o link de agendamento para imóvel
const transformarLink = (url) => {
  return url.replace("/agendamentos/", "/imoveis/");
};

// Defina um valor padrão para DASH_IMOB_URL se ele não estiver configurado corretamente
const urlBase = process.env.DASH_IMOB_URL || "https://imobiliaria-bortone.vercel.app";

// Montando a URL do agendamento

let urlOriginal = `${urlBase}/agendamentos/${encodeURIComponent(propertyId)}`;



// Garantindo que o link não tenha slashes extras
if (urlOriginal.indexOf("://") === -1) {
  // Adiciona o domínio padrão se não tiver protocolo (http:// ou https://)
  urlOriginal = `https://${urlOriginal}`;
}

// Transformando o link
const urlTransformada = transformarLink(urlOriginal);

// Agora passando a URL transformada no ctaHref do e-mail
const htmlImob = emailShell({
  title: "Novo agendamento",
  ctaHref: urlTransformada, // Agora com a URL transformada
  bodyHTML: `
    <h3 style="margin:0 0 12px;">Detalhes do cliente</h3>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;width:180px;font-weight:600;">Nome</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${esc(cleanName)}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;">E-mail</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${esc(userEmail)}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;">Telefone</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${esc(cleanPhone)}</td></tr>
      ${whenDate || whenTime ? `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;">Data/Horário</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${esc(`${whenDate} ${whenTime}`.trim())}</td></tr>` : ``}
    </table>

    <h3 style="margin:16px 0 12px;">Imóvel</h3>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      ${cleanAddress ? `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;width:180px;font-weight:600;">Endereço</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${esc(cleanAddress)}</td></tr>` : ``}
    </table>

    ${cleanNotes ? `<p style="margin:16px 0 0;"><strong>Observações do cliente:</strong> ${esc(cleanNotes)}</p>` : ``}
  `,
  ctaLabel: "Abrir Página do Imóvel",
  footerNote: "Gerado automaticamente pelo módulo de Agendamentos.",
});

// Envio de e-mails
await Promise.all([
  client.send({
    from: fromEmpresa,
    to: userEmail,
    subject: subjectUser,
    text: textUser,
    html: htmlUser,
  }),
  client.send({
    from: fromEmpresa,
    to: destinatarioEmpresa,
    subject: subjectImob,
    text: textImob,
    html: htmlImob,
    replyTo: userEmail,
  }),
]);

return {
  success: true,
  message: "Agendamento confirmado e e-mails enviados",
};

  } catch (error) {
    throw new Error(
      "Erro ao enviar confirmação de agendamento: " + error.message
    );
  }
};
