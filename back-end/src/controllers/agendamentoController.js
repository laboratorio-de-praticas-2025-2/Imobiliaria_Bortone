import * as agendamentoService from '../services/agendamentoService.js';
import Agendamento from '../models/Agendamento.js';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

// Validação de entrada robusta
const validateEmailInput = (input) => {
  if (!input || typeof input !== 'object') {
    throw new Error('Dados de entrada inválidos');
  }
  
  const { host, port, secure, user, pass, helo, from, to, cc, bcc, subject, text, html, attachments } = input;
  
  // Validação de campos obrigatórios
  if (!host || !from || !to) {
    throw new Error('host, from e to são obrigatórios');
  }
  
  // Validação de tipos
  if (typeof host !== 'string' || typeof from !== 'string') {
    throw new Error('host e from devem ser strings');
  }
  
  // Validação de email
  const emailRegex = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!emailRegex.test(from)) {
    throw new Error('Email from inválido');
  }
  
  // Validação de port
  if (port && (isNaN(port) || port < 1 || port > 65535)) {
    throw new Error('Porta inválida');
  }
  
  // Validação de secure
  if (secure !== undefined && typeof secure !== 'boolean') {
    throw new Error('secure deve ser boolean');
  }
  
  // Validação de tamanho de campos
  if (subject && subject.length > 200) {
    throw new Error('Subject muito longo (máximo 200 caracteres)');
  }
  
  if (text && text.length > 10000) {
    throw new Error('Texto muito longo (máximo 10000 caracteres)');
  }
  
  if (html && html.length > 20000) {
    throw new Error('HTML muito longo (máximo 20000 caracteres)');
  }
  
  // Validação de anexos
  if (attachments && Array.isArray(attachments)) {
    for (const attachment of attachments) {
      if (!attachment.filename || !attachment.contentBase64) {
        throw new Error('Anexos devem ter filename e contentBase64');
      }
      if (attachment.filename.length > 255) {
        throw new Error('Nome do arquivo muito longo');
      }
      if (attachment.contentBase64.length > 10485760) { // 10MB
        throw new Error('Anexo muito grande (máximo 10MB)');
      }
    }
  }
  
  return { host, port, secure, user, pass, helo, from, to, cc, bcc, subject, text, html, attachments };
};

export const sendEmail = async (req, res) => {
  try {
    const validatedData = validateEmailInput(req.body);
    const { host, port, secure, user, pass, helo, from, to, cc, bcc, subject, text, html, attachments } = validatedData;

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
    
    // Não expor detalhes internos em produção
    const isDevelopment = process.env.NODE_ENV !== 'production';
    res.status(400).json({ 
      error: "Erro ao enviar email",
      details: isDevelopment ? error.message : undefined
    });
  }
};
  
// Validação de dados de agendamento
const validateAppointmentInput = (input) => {
  if (!input || typeof input !== 'object') {
    throw new Error('Dados de agendamento inválidos');
  }

  const { appointment } = input;

  if (!appointment || typeof appointment !== 'object') {
    throw new Error('appointment é obrigatório');
  }

  const { name, email, phone, propertyAddress, propertyId, notes, visitPeriod } = appointment;

  // Validação de campos obrigatórios
  if (!name || !email || !visitPeriod) {
    throw new Error('name, email e visitPeriod são obrigatórios');
  }

  // Validação de tipos
  if (typeof name !== 'string' || typeof email !== 'string' || typeof visitPeriod !== 'string') {
    throw new Error('name, email e visitPeriod devem ser strings');
  }

  // Validação de email
  const emailRegex = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }

  // Validação de tamanho
  if (name.length > 120) {
    throw new Error('Nome muito longo (máximo 120 caracteres)');
  }
  if (email.length > 254) {
    throw new Error('Email muito longo (máximo 254 caracteres)');
  }
  if (phone && phone.length > 20) {
    throw new Error('Telefone muito longo (máximo 20 caracteres)');
  }
  if (propertyAddress && propertyAddress.length > 200) {
    throw new Error('Endereço do imóvel muito longo (máximo 200 caracteres)');
  }
  if (notes && notes.length > 2000) {
    throw new Error('Observações muito longas (máximo 2000 caracteres)');
  }
  if (visitPeriod.length > 100) {
    throw new Error('Período de visitação muito longo (máximo 100 caracteres)');
  }

  return { appointment: { name, email, phone, propertyAddress, propertyId, notes, visitPeriod } };
};



export const sendScheduleConfirmation = async (req, res) => {
  try {
    const validatedData = validateAppointmentInput(req.body);
    const { appointment } = validatedData;
    const {
      name,
      email,
      phone,
      propertyAddress,
      propertyId,
      notes,
      visitPeriod
    } = appointment;

    // Corpo do e-mail melhorado
    const subject = `Confirmação de Solicitação de Agendamento - Imobiliária Bortone`;
    const text = `Olá ${name},\n\nRecebemos sua solicitação de agendamento de visita.\n\nDados do agendamento:\n- Nome: ${name}\n- E-mail: ${email}\n- Telefone: ${phone || 'Não informado'}\n- Endereço do imóvel: ${propertyAddress || 'Não informado'}\n- ID do imóvel: ${propertyId || 'Não informado'}\n- Período de interesse: ${visitPeriod}\n- Observações: ${notes || 'Nenhuma'}\n\nNossa equipe entrará em contato para confirmar a visita.\n\nObrigado por escolher a Imobiliária Bortone!`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Imobiliária Bortone</h1>
          <h2 style="margin: 10px 0 0 0;">Confirmação de Solicitação de Agendamento</h2>
        </div>
        <div style="padding: 20px;">
          <p>Olá <strong>${name}</strong>,</p>
          <p>Recebemos sua solicitação de agendamento de visita. Confira os dados:</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>E-mail:</strong> ${email}</li>
            <li><strong>Telefone:</strong> ${phone || 'Não informado'}</li>
            <li><strong>Endereço do imóvel:</strong> ${propertyAddress || 'Não informado'}</li>
            <li><strong>ID do imóvel:</strong> ${propertyId || 'Não informado'}</li>
            <li><strong>Período de interesse:</strong> ${visitPeriod}</li>
            <li><strong>Observações:</strong> ${notes || 'Nenhuma'}</li>
          </ul>
          <p>Nossa equipe entrará em contato para confirmar a visita.</p>
          <p>Obrigado por escolher a Imobiliária Bortone!</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>Imobiliária Bortone - Seu sonho de casa própria começa aqui</p>
        </div>
      </div>
    `;

    // Rate limiting
    const clientIP = req.ip || req.connection?.remoteAddress || "unknown";
    const route = req.originalUrl || req.url || "";
    if (!agendamentoService.checkRateLimit(clientIP, route)) {
      return res.status(429).json({
        error: "Too Many Requests - Limite de 5 agendamentos por minuto"
      });
    }

    // NOVA FUNCIONALIDADE: Salvar agendamento no banco de dados
    let agendamentoSalvo = null;
    try {
      // Buscar ou criar usuário com base no email
      let usuario = await Usuario.findOne({ where: { email: email } });
      
      if (!usuario) {
        // Se usuário não existe, criar um novo usuário temporário
        // Senha temporária será definida quando o usuário se cadastrar
        const senhaTemporaria = await bcrypt.hash('temp_' + Date.now(), 10);
        
        usuario = await Usuario.create({
          nome: name,
          email: email,
          senha: senhaTemporaria,
          nivel: 1, // usuário comum
          celular: phone || null,
          ativo: 1
        });
        
        console.log(`✅ Novo usuário criado: ${usuario.id} - ${usuario.email}`);
      } else {
        // Se usuário existe, atualizar nome e telefone se fornecidos
        if (name && name !== usuario.nome) {
          usuario.nome = name;
        }
        if (phone && phone !== usuario.celular) {
          usuario.celular = phone;
        }
        await usuario.save();
        
        console.log(`✅ Usuário existente atualizado: ${usuario.id} - ${usuario.email}`);
      }

      // Criar registro de agendamento no banco
      // Usar data atual + 7 dias como data_marcada padrão se não especificada
      const dataAgendamento = appointment.date && appointment.time 
        ? new Date(`${appointment.date}T${appointment.time}`)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias a partir de agora

      const agendamentoData = {
        id_usuario: usuario.id,
        data_marcada: dataAgendamento,
        data_create: new Date(),
        id_imovel: propertyId ? parseInt(propertyId) : null,
        mensagem: `${notes || ''}\nPeríodo preferido: ${visitPeriod}\nTelefone: ${phone || 'Não informado'}`.trim(),
        concluido: 0
      };
      
      console.log('📝 Dados do agendamento a serem salvos:', agendamentoData);
      
      agendamentoSalvo = await Agendamento.create(agendamentoData);

      console.log(`✅ Agendamento salvo no banco: ID ${agendamentoSalvo.id} para usuário ${usuario.id} (${usuario.email})`);
      
    } catch (dbError) {
      console.error('❌ Erro ao salvar agendamento no banco:', dbError);
      // Continuar com o envio de email mesmo se houver erro no banco
    }

    // Tentar enviar email, mas não falhar se houver erro
    let emailResult = null;
    try {
      emailResult = await agendamentoService.sendScheduleConfirmation({
        appointment,
        subject,
        text,
        html
      });
      console.log('✅ Email de confirmação enviado com sucesso');
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de confirmação:', emailError.message);
      // Continuar mesmo se o email falhar
    }

    // Resposta de sucesso baseada no que foi salvo
    if (agendamentoSalvo) {
      res.json({
        success: true,
        message: emailResult ? 
          "Agendamento confirmado, salvo no banco e e-mail enviado com sucesso" : 
          "Agendamento salvo com sucesso (email não enviado)",
        data: {
          agendamento: {
            id: agendamentoSalvo.id,
            data_marcada: agendamentoSalvo.data_marcada,
            id_imovel: agendamentoSalvo.id_imovel
          },
          email: emailResult || null
        }
      });
    } else {
      throw new Error("Falha ao salvar agendamento no banco de dados");
    }
  } catch (error) {
    console.error('Erro ao enviar confirmação de agendamento:', error);
    // Não expor detalhes internos em produção
    const isDevelopment = process.env.NODE_ENV !== 'production';
    res.status(400).json({
      error: "Erro ao processar agendamento",
      details: isDevelopment ? error.message : undefined
    });
  }
};

// Validação de dados de notificação de imóvel
const validatePropertyNotificationInput = (input) => {
  if (!input || typeof input !== 'object') {
    throw new Error('Dados de notificação inválidos');
  }
  
  const { host, port, secure, user, pass, helo, from, to, propertyData } = input;
  
  // Validação de campos obrigatórios
  if (!host || !from || !to) {
    throw new Error('host, from e to são obrigatórios');
  }
  
  if (!propertyData || !propertyData.title) {
    throw new Error('propertyData com title é obrigatório');
  }
  
  // Validação de tipos
  if (typeof host !== 'string' || typeof from !== 'string' || typeof to !== 'string') {
    throw new Error('host, from e to devem ser strings');
  }
  
  // Validação de email
  const emailRegex = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (!emailRegex.test(from)) {
    throw new Error('Email from inválido');
  }
  
  // Validação de propertyData
  if (typeof propertyData !== 'object') {
    throw new Error('propertyData deve ser um objeto');
  }
  
  const { title, address, price, description, contactPhone } = propertyData;
  
  if (typeof title !== 'string' || title.length > 200) {
    throw new Error('Título inválido ou muito longo (máximo 200 caracteres)');
  }
  
  if (address && (typeof address !== 'string' || address.length > 200)) {
    throw new Error('Endereço muito longo (máximo 200 caracteres)');
  }
  
  if (description && (typeof description !== 'string' || description.length > 2000)) {
    throw new Error('Descrição muito longa (máximo 2000 caracteres)');
  }
  
  if (contactPhone && (typeof contactPhone !== 'string' || contactPhone.length > 20)) {
    throw new Error('Telefone de contato muito longo (máximo 20 caracteres)');
  }
  
  return { host, port, secure, user, pass, helo, from, to, propertyData };
};

export const sendPropertyNotification = async (req, res) => {
  try {
    const validatedData = validatePropertyNotificationInput(req.body);
    const { host, port, secure, user, pass, helo, from, to, propertyData } = validatedData;

    const { title, address, price, description, contactPhone } = propertyData;
    
    // Sanitização de dados para prevenir XSS
    const sanitizeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };
    
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedAddress = sanitizeHtml(address || "Não informado");
    const sanitizedPrice = sanitizeHtml(price || "A consultar");
    const sanitizedDescription = sanitizeHtml(description || "Sem descrição");
    const sanitizedContactPhone = sanitizeHtml(contactPhone || "Não informado");
    
    const subject = `Novo Imóvel Disponível - ${sanitizedTitle}`;
    const text = `Novo imóvel disponível na Imobiliária Bortone:\n\nTítulo: ${sanitizedTitle}\nEndereço: ${sanitizedAddress}\nPreço: ${sanitizedPrice}\nDescrição: ${sanitizedDescription}\nContato: ${sanitizedContactPhone}\n\nAcesse nosso site para mais informações!`;
    
    const html = `
<div style="font-family: Arial, sans-serif; line-height:1.5; color:#222; max-width:600px; margin:0 auto;">
  <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Imobiliária Bortone</h1>
    <h2 style="margin: 10px 0 0 0;">Novo Imóvel Disponível</h2>
  </div>
  <div style="padding: 20px;">
    <h3>${sanitizedTitle}</h3>
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 10px 0;"><strong>Endereço:</strong> ${sanitizedAddress}</li>
      <li style="margin: 10px 0;"><strong>Preço:</strong> ${sanitizedPrice}</li>
      <li style="margin: 10px 0;"><strong>Contato:</strong> ${sanitizedContactPhone}</li>
    </ul>
    <p><strong>Descrição:</strong></p>
    <p>${sanitizedDescription}</p>
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
    
    // Não expor detalhes internos em produção
    const isDevelopment = process.env.NODE_ENV !== 'production';
    res.status(400).json({ 
      error: "Erro ao enviar notificação de imóvel",
      details: isDevelopment ? error.message : undefined
    });
  }
};
