import * as recomendacaoImovelService from '../services/recomendacaoImovelService.js';
import { sendPropertyRecommendation, sendNotificationToUser } from '../utils/socketHelper.js';

export const createRecomendacaoImovel = async (req, res) => {
  const { usuario_id, imovel_id, data_visita } = req.body;

  try {
    const novaRecomendacao = await recomendacaoImovelService.createRecomendacao({
      usuario_id,
      imovel_id,
      data_visita
    });

    // Enviar notificação em tempo real via Socket.IO
    const notificationSent = sendPropertyRecommendation(usuario_id, {
      id: novaRecomendacao.id,
      imovel_id,
      data_visita,
      message: 'Encontramos um imóvel que pode interessar você!'
    });

    console.log(`Notificação Socket.IO ${notificationSent ? 'enviada' : 'não enviada'} para usuário ${usuario_id}`);

    res.status(201).json({
      message: 'Novo registro na tabela recomendacao_imovel.',
      data: novaRecomendacao,
      notificationSent
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