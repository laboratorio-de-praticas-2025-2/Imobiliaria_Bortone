// Service: regra de negócio e chamada ao SMTP
import { SMTPClient } from './smtpService.js';

export async function sendAgendamentoEmail(payload) {
  const {
    host, port, secure, user, pass, helo,
    from, to, cc, bcc, subject, text, html, attachments,
  } = payload;  // payload é o objeto com todas as informações necessárias para o envio do e-mail. Ele evita passar 10 parâmetros separados na função

  const client = new SMTPClient({ host, port, secure, user, pass, helo });

  const result = await client.send({
    from,
    to,
    cc,
    bcc,
    subject: subject || 'Agendamento Recebido com Sucesso',
    text: text || '',
    html: html || `
  <p>Prezado(a),</p>
  <p>
    Informamos que seu <strong>agendamento foi recebido com sucesso</strong>.
    Solicitamos, por gentileza, que aguarde nosso retorno para mais informações.
  </p>
  <p>Atenciosamente,<br>
  Equipe <em>[Imobiliária Bortone]</em></p>
`,
    attachments: Array.isArray(attachments) ? attachments : [],
  });

  return result; // { ok: true, message: '...' }
}
