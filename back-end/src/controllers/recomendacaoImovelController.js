import * as recomendacaoImovelService from '../services/recomendacaoImovelService.js';

export const createRecomendacaoImovel = async (req, res) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

  try {
    const novaRecomendacao = await recomendacaoImovelService.createRecomendacao({
      usuario_id,
      imovel_id,
      data_visita
    });
    res.status(201).json({
      message: 'Novo registro na tabela recomendacao_imovel.',
      data: novaRecomendacao,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getRecommendacoes = (req, res) => {
  // Futuramente irei chamar uma função do service para buscar as recomendações
  res.status(501).json({ message: 'Este endpoint ainda não está implementado.' });
};