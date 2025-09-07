// Controller: valida a entrada e delega ao service
import { sendAgendamentoEmail } from '../services/agendamentoService.js';

export async function enviarEmailAgendamento(req, res) {
  try {
    const {
      host, port, secure, user, pass, helo,
      from, to, cc, bcc, subject, text, html, attachments,
    } = req.body;

    if (!host || !from || !to) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: 'host', 'from' e 'to'." });
    }

    const result = await sendAgendamentoEmail({
      host, port, secure, user, pass, helo,
      from, to, cc, bcc, subject, text, html, attachments,
    });

    return res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('[AgendamentoController] erro:', error);
    return res.status(500).json({ error: error.message || 'Falha ao enviar e-mail' });
  }
}
