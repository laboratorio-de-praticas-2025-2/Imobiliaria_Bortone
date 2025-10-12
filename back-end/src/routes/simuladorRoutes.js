import express from 'express';
import simController from '../controllers/simuladorController.js';
import validateSimulacao from '../middlewares/validateSimulacao.js';

const router = express.Router();

// Rota real do simulador
router.post('/calcular', validateSimulacao, simController.calcularSimulacao);

// Rota de teste
router.get('/teste', (req, res) => {
  res.json({ message: 'Backend do simulador funcionando!' });
});

export default router;