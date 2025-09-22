import { Sequelize } from "sequelize";
import Imovel from "../models/Imovel";
import RecomendacaoImovel from "../models/recomendacaoImovelModal";
import { 
  sendPropertyRecommendation, 
  sendToMultipleUsers, 
  notifyNewProperty,
  broadcastNotification 
} from '../utils/socketHelper.js';

class NotificationService {

  // Função com a finalidade é acionar o SocketManager para o envio das notificações.
  async dispararAlertaNovoImovel(novoImovel) {
    const { latitude, longitude, preco, area, tipo_negociacao, status } = novoImovel;

    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);

    try {
      const recomendacoes = await RecomendacaoImovel.findAll({
        include: [
          {
            model: Imovel,
            required: true,
            where: {
              tipo_negociacao,
              status,
              preco: { [Sequelize.Op.between]: [preco * 0.9, preco * 1.1] },
              area: { [Sequelize.Op.between]: [area * 0.9, area * 1.1] },
              latitude: { [Sequelize.Op.between]: [latitude - 0.05, latitude + 0.05] },
              longitude: { [Sequelize.Op.between]: [longitude - 0.05, longitude + 0.05] },
            },
          },
        ],
        where: {
          data_visita: { [Sequelize.Op.gte]: umMesAtras },
        },
      });

      const imovelSorteado = await this._buscarImovelPopular();

      // Enviar notificações via Socket.IO
      const notificacoesSent = await this._enviarNotificacoes(recomendacoes, novoImovel, imovelSorteado);

      return { 
        recomendacoes, 
        imovelSorteado,
        notificacoesSent
      }
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      throw new Error("Erro ao buscar recomendações.");
    }
  }

  // Função que notifica imóveis populares para usuários que não visitaram nenhum imóvel
  async _buscarImovelPopular() {
    try {
      // 1) pegar os 10 imoveis mais populares
      const imoveisPopulares = await RecomendacaoImovel.findAll({
        attributes: [
          "imovel_id",
          [Sequelize.fn("COUNT", Sequelize.col("imovel_id")), "total"],
        ],
        group: ["imovel_id"],
        order: [[Sequelize.literal("total"), "DESC"]],
        limit: 10,
      });

      if (imoveisPopulares.length === 0) return null;

      // 2) sortear 1 desses 10
      const sorteado = imoveisPopulares[
        Math.floor(Math.random() * imoveisPopulares.length)
      ];

      // 3) buscar dados completos
      const imovelSorteado = await Imovel.findByPk(sorteado.imovel_id);

      return imovelSorteado;
    } catch (error) {
      console.error("Erro ao buscar imóvel popular:", error);
      throw new Error("Erro ao buscar imóvel popular.");
    }
  }

  // Função para enviar notificações via Socket.IO
  async _enviarNotificacoes(recomendacoes, novoImovel, imovelSorteado) {
    const notificacoesSent = {
      recomendacoes: 0,
      imovelPopular: 0,
      broadcast: false
    };

    try {
      // 1. Enviar recomendações personalizadas para usuários com histórico
      if (recomendacoes && recomendacoes.length > 0) {
        const userIds = [...new Set(recomendacoes.map(rec => rec.usuario_id))];
        
        const results = notifyNewProperty(userIds, {
          id: novoImovel.id,
          preco: novoImovel.preco,
          area: novoImovel.area,
          tipo_negociacao: novoImovel.tipo_negociacao,
          endereco: novoImovel.endereco,
          titulo: `Novo ${novoImovel.tipo_negociacao} disponível!`,
          descricao: `Encontramos um imóvel que pode interessar você com base no seu histórico de buscas.`
        });

        notificacoesSent.recomendacoes = results.filter(r => r.sent).length;
        console.log(`Notificações de recomendação enviadas para ${notificacoesSent.recomendacoes} usuários`);
      }

      // 2. Enviar imóvel popular para usuários sem histórico (broadcast limitado)
      if (imovelSorteado) {
        const broadcastResult = broadcastNotification('popular_property', {
          type: 'popular_property',
          title: 'Imóvel Popular em Destaque',
          message: 'Confira este imóvel que está chamando atenção!',
          property: {
            id: imovelSorteado.id,
            preco: imovelSorteado.preco,
            area: imovelSorteado.area,
            tipo_negociacao: imovelSorteado.tipo_negociacao,
            endereco: imovelSorteado.endereco
          }
        });

        notificacoesSent.broadcast = broadcastResult;
        console.log(`Broadcast de imóvel popular ${broadcastResult ? 'enviado' : 'falhou'}`);
      }

      // 3. Broadcast geral sobre novo imóvel no sistema
      const generalBroadcast = broadcastNotification('new_property_available', {
        type: 'system_notification',
        title: 'Novo Imóvel Disponível',
        message: 'Um novo imóvel foi adicionado ao nosso catálogo!',
        property: {
          id: novoImovel.id,
          tipo_negociacao: novoImovel.tipo_negociacao,
          preco: novoImovel.preco
        }
      });

      notificacoesSent.generalBroadcast = generalBroadcast;

    } catch (error) {
      console.error('Erro ao enviar notificações via Socket.IO:', error);
    }

    return notificacoesSent;
  }

  // Função para notificar alteração de preço
  async notificarAlteracaoPreco(imovelId, precoAntigo, precoNovo) {
    try {
      // Buscar usuários interessados neste imóvel
      const interessados = await RecomendacaoImovel.findAll({
        where: { imovel_id: imovelId },
        attributes: ['usuario_id']
      });

      if (interessados.length > 0) {
        const userIds = [...new Set(interessados.map(i => i.usuario_id))];
        
        const results = sendToMultipleUsers(userIds, 'price_change', {
          type: 'price_change',
          title: 'Alteração de Preço',
          message: 'O preço de um imóvel de seu interesse foi alterado',
          data: {
            imovelId,
            precoAntigo,
            precoNovo,
            timestamp: new Date().toISOString()
          }
        });

        console.log(`Notificações de alteração de preço enviadas para ${results.filter(r => r.sent).length} usuários`);
        return results;
      }
    } catch (error) {
      console.error('Erro ao notificar alteração de preço:', error);
      throw new Error('Erro ao notificar alteração de preço.');
    }
  }

  // Função para notificar agendamento de visita
  async notificarAgendamento(userId, dadosAgendamento) {
    try {
      const result = sendPropertyRecommendation(userId, {
        type: 'appointment',
        title: 'Agendamento Confirmado',
        message: 'Sua visita foi agendada com sucesso!',
        data: dadosAgendamento
      });

      console.log(`Notificação de agendamento ${result ? 'enviada' : 'falhou'} para usuário ${userId}`);
      return result;
    } catch (error) {
      console.error('Erro ao notificar agendamento:', error);
      throw new Error('Erro ao notificar agendamento.');
    }
  }
}

export default NotificationService;
