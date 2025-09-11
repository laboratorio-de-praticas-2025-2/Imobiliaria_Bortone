// routes/agendamentoRoute.js
import express from 'express';
import { 
  sendEmail, 
  sendScheduleConfirmation, 
  sendPropertyNotification 
} from '../controllers/agendamentoController.js';

const router = express.Router();

// Rota para envio de email simples (utilitário dentro do módulo de agendamento)
if (process.env.NODE_ENV !== 'production') {
  router.post('/send', sendEmail);
}

// Rota para confirmação de agendamento
router.post('/schedule', sendScheduleConfirmation);

// Rota alternativa para agendamento (compatibilidade)
router.post('/agendar', sendScheduleConfirmation);

// Rota para notificação de novos imóveis relacionada a agendamento
router.post('/property-notification', sendPropertyNotification);

export default router;
