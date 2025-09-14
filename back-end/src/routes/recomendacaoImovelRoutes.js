import express from 'express';
import { createRecomendacaoImovel } from '../controllers/recomendacaoImovelController.js';
import { getRecomendacoes } from '../controllers/recomendacaoImovelController.js';
import { validacaoRecomendacaoImovel } from '../middlewares/validacaoRecomendacaoImovel.js';

const recomendacoesRoutes = express.Router();

recomendacoesRoutes.post('/recomendacao_imovel', validacaoRecomendacaoImovel, createRecomendacaoImovel);
recomendacoesRoutes.get('/recomendacoes', getRecomendacoes);

export default recomendacoesRoutes;