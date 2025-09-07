// routes/recomendacaoImovel.js
import express from 'express';
import { createRecomendacaoImovel } from '../controllers/recomendacaoImovelController.js';
import { getRecommendacoes } from '../controllers/recomendacaoImovelController.js';
import { validacaoRecomendacaoImovel } from '../middlewares/validacaoRecomendacaoImovel.js';

const router = express.Router();

router.post('/recomendacao_imovel', validacaoRecomendacaoImovel, createRecomendacaoImovel);
router.get('/recomendacoes', getRecommendacoes);

export default router;