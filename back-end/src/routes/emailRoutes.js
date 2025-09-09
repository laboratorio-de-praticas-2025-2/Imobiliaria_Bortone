// routes/emailRoutes.js
import express from 'express';
import { 
  sendEmail, 
  sendScheduleConfirmation, 
  sendPropertyNotification 
} from '../controllers/emailController.js';

const router = express.Router();

// Rota para envio de email simples
router.post('/email/send', sendEmail);

// Rota para confirmação de agendamento
router.post('/email/schedule', sendScheduleConfirmation);

// Rota alternativa para agendamento (compatibilidade)
router.post('/email/agendar', sendScheduleConfirmation);

// Rota para notificação de novos imóveis
router.post('/email/property-notification', sendPropertyNotification);

export default router;
