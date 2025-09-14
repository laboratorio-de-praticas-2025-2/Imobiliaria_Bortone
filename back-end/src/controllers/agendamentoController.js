import * as agendamentoService from '../services/agendamentoService.js';

export const sendEmail = async (req, res) => {
  const { host, port, secure, user, pass, helo, from, to, cc, bcc, subject, text, html, attachments } = req.body;

  // Validação de campos obrigatórios
  if (!host || !from || !to) {
    return res.status(400).json({ 
      error: "host, from e to são obrigatórios" 
    });
  }

  try {
    const result = await agendamentoService.sendEmail({
      host, port, secure, user, pass, helo, from, to, cc, bcc, subject, text, html, attachments
    });

    res.json({ 
      success: true, 
      message: "Email enviado com sucesso",
      data: result 
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ 
      error: "Erro interno do servidor", //tratamento de erro
      details: error.message 
    });
  }
};
  
export const sendScheduleConfirmation = async (req, res) => {
  const { appointment } = req.body;

  // Rate limiting
  const clientIP = req.ip || req.connection?.remoteAddress || "unknown";
  const route = req.originalUrl || req.url || "";
  
  if (!agendamentoService.checkRateLimit(clientIP, route)) {
    return res.status(429).json({ 
      error: "Too Many Requests - Limite de 5 agendamentos por minuto" 
    });
  }

  // Validação de campos obrigatórios
  if (!appointment || !appointment.email || !appointment.name || !appointment.date || !appointment.time) {
    return res.status(400).json({ 
      error: "appointment com name, email, date e time é obrigatório" 
    });
  }

  try {
    const result = await agendamentoService.sendScheduleConfirmation({
      appointment
    });

    res.json({ 
      success: true, 
      message: "Agendamento confirmado e e-mails enviados com sucesso",
      data: result 
    });
  } catch (error) {
    console.error('Erro ao enviar confirmação de agendamento:', error);
    res.status(500).json({ 
      error: "Erro interno do servidor",
      details: error.message 
    });
  }
};

export const sendPropertyNotification = async (req, res) => {
  const { host, port, secure, user, pass, helo, from, to, propertyData } = req.body;

  // Validação de campos obrigatórios
  if (!host || !from || !to) {
    return res.status(400).json({ 
      error: "host, from e to são obrigatórios" 
    });
  }

  if (!propertyData || !propertyData.title) {
    return res.status(400).json({ 
      error: "propertyData com title é obrigatório" 
    });
  }

  try {
    const { title, address, price, description, contactPhone } = propertyData;
    
    const subject = `Novo Imóvel Disponível - ${title}`;
    const text = `Novo imóvel disponível na Imobiliária Bortone:\n\nTítulo: ${title}\nEndereço: ${address || "Não informado"}\nPreço: ${price || "A consultar"}\nDescrição: ${description || "Sem descrição"}\nContato: ${contactPhone || "Não informado"}\n\nAcesse nosso site para mais informações!`;
    
    const html = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color:#222; max-width:600px; margin:0 auto;">
  <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Imobiliária Bortone</h1>
    <h2 style="margin: 10px 0 0 0;">Novo Imóvel Disponível</h2>
  </div>
  <div style="padding: 20px;">
    <h3>${title}</h3>
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 10px 0;"><strong>Endereço:</strong> ${address || "Não informado"}</li>
      <li style="margin: 10px 0;"><strong>Preço:</strong> ${price || "A consultar"}</li>
      <li style="margin: 10px 0;"><strong>Contato:</strong> ${contactPhone || "Não informado"}</li>
    </ul>
    <p><strong>Descrição:</strong></p>
    <p>${description || "Sem descrição"}</p>
    <p style="text-align: center; margin-top: 30px;">
      <a href="#" style="background-color: #2c5aa0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Ver Detalhes
      </a>
    </p>
  </div>
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>Imobiliária Bortone - Seu sonho de casa própria começa aqui</p>
  </div>
</div>`;

    const result = await agendamentoService.sendEmail({
      host, port, secure, user, pass, helo, from, to, subject, text, html
    });

    res.json({ 
      success: true, 
      message: "Notificação de imóvel enviada com sucesso",
      data: result 
    });
  } catch (error) {
    console.error('Erro ao enviar notificação de imóvel:', error);
    res.status(500).json({ 
      error: "Erro interno do servidor",
      details: error.message 
    });
  }
};
