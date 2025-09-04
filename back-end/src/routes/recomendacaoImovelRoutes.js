// routes/recomendacaoImovel.js
import express from 'express';
import { createRecomendacaoImovel } from '../controllers/recomendacaoImovelController.js';
import { validateRecomendacaoImovel } from '../middlewares/validacaoRecomendacaoImovel.js';

const router = express.Router();

router.post('/recomendacao_imovel', validateRecomendacaoImovel, createRecomendacaoImovel);

export default router;