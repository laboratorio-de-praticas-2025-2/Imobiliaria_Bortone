import { Router } from 'express';
import { enviarEmailAgendamento } from '../controllers/agendamentoController.js';

const router = Router();

// POST /agendamentos/send-email
router.post('/send-email', enviarEmailAgendamento);

export default router;
