// routes/agendamentoRoute.js
import express from "express";
import {
  sendEmail,
  sendScheduleConfirmation,
  sendPropertyNotification,
} from "../controllers/agendamentoController.js";

const agendamentoRoutes = express.Router();

// Middleware de headers de segurança
agendamentoRoutes.use((req, res, next) => {
  // Headers de segurança
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Rate limiting por IP
  const clientIP = req.ip || req.connection?.remoteAddress || "unknown";
  const userAgent = req.get('User-Agent') || '';
  
  // Log de requisições para auditoria
  console.log(`[AUDIT] ${new Date().toISOString()} - IP: ${clientIP} - ${req.method} ${req.path} - UA: ${userAgent.substring(0, 100)}`);
  
  next();
});

// Middleware de validação de tamanho de payload
agendamentoRoutes.use(express.json({ 
  limit: '10mb', // Limite de 10MB para JSON
  verify: (req, res, buf) => {
    // Verificação adicional do tamanho do payload
    if (buf.length > 10 * 1024 * 1024) { // 10MB
      throw new Error('Payload muito grande');
    }
  }
}));

// Middleware de validação de Content-Type
agendamentoRoutes.use((req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({ 
      error: 'Content-Type deve ser application/json' 
    });
  }
  next();
});

// Rota para envio de email simples (utilitário dentro do módulo de agendamento)
if (process.env.NODE_ENV !== "production") {
  agendamentoRoutes.post("/send", sendEmail);
}

// Rota para confirmação de agendamento
agendamentoRoutes.post("/schedule", sendScheduleConfirmation);

// Rota alternativa para agendamento (compatibilidade)
agendamentoRoutes.post("/agendar", sendScheduleConfirmation);

// Rota para notificação de novos imóveis relacionada a agendamento
agendamentoRoutes.post("/property-notification", sendPropertyNotification);

export default agendamentoRoutes;
