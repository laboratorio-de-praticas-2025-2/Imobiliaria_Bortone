// routes/agendamentoRoute.js
import express from 'express';
import { 
  sendEmail, 
  sendScheduleConfirmation, 
  sendPropertyNotification 
} from '../controllers/agendamentoController.js';

const agendamentoRoutes = express.Router();

// Rota para envio de email simples (utilitário dentro do módulo de agendamento)
if (process.env.NODE_ENV !== 'production') {
  agendamentoRoutes.post('/send', sendEmail);
}

// Rota para confirmação de agendamento
agendamentoRoutes.post('/schedule', sendScheduleConfirmation);

// Rota alternativa para agendamento (compatibilidade)
agendamentoRoutes.post('/agendar', sendScheduleConfirmation);

// Rota para notificação de novos imóveis relacionada a agendamento
agendamentoRoutes.post('/property-notification', sendPropertyNotification);

export default agendamentoRoutes;
