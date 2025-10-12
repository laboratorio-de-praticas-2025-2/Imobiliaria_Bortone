import { Sequelize } from "sequelize";
import Imovel from "../models/Imovel.js";
import RecomendacaoImovel from "../models/recomendacaoImovelModel.js";
// Importar apenas funções essenciais - SEM REDUNDÂNCIA
import {
  sendToMultipleUsers,
  broadcastNotification,
  sendToUser,
  isSocketManagerAvailable
} from '../utils/socketHelper.js';

class NotificationService {
  // Constantes de configuração para tolerâncias de recomendação
  static PRICE_TOLERANCE = 0.3; // 30% de variação no preço
  static AREA_TOLERANCE = 0.3; // 30% de variação na área
  static GEO_TOLERANCE = 0.05; // ~5km de raio geográfico
  static DAYS_LOOKBACK = 30; // Considerar visitas dos últimos 30 dias
  static TOP_PROPERTIES_LIMIT = 10; // Top 10 imóveis mais populares
  static CACHE_DURATION = 30 * 60 * 1000; // Cache de 30 minutos

  constructor() {
    this.popularPropertyCache = null;
    this.cacheExpiry = null;
  }

  // Função com a finalidade é acionar o SocketManager para o envio das notificações.
  async dispararAlertaNovoImovel(novoImovel) {
    const startTime = Date.now();

    // Validação de entrada - previne erros e garante integridade
    if (!novoImovel || typeof novoImovel !== 'object') {
      throw new Error('Dados do imóvel são obrigatórios e devem ser um objeto válido');
    }

    if (!novoImovel.id) {
      throw new Error('ID do imóvel é obrigatório');
    }

    // Validar campos obrigatórios para o algoritmo de recomendação
    const requiredFields = ['latitude', 'longitude', 'preco', 'area', 'tipo_negociacao', 'status'];
    for (const field of requiredFields) {
      if (novoImovel[field] === undefined || novoImovel[field] === null) {
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Validar tipos de dados críticos
    const precoNumerico = parseFloat(novoImovel.preco);
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      throw new Error('Preço deve ser um número positivo');
    }

    const areaNumerica = parseFloat(novoImovel.area);
    if (isNaN(areaNumerica) || areaNumerica <= 0) {
      throw new Error('Área deve ser um número positivo');
    }

    const latitudeNumerico = parseFloat(novoImovel.latitude);
    const longitudeNumerico = parseFloat(novoImovel.longitude);

    if (isNaN(latitudeNumerico) || isNaN(longitudeNumerico)) {
      throw new Error('Coordenadas geográficas devem ser números válidos');
    }


    const { tipo_negociacao, status } = novoImovel;
    const preco = precoNumerico; 
    const area = areaNumerica;
    const latitude = latitudeNumerico;
    const longitude = longitudeNumerico;

    const umMesAtras = new Date();
    umMesAtras.setDate(umMesAtras.getDate() - NotificationService.DAYS_LOOKBACK);

    try {
      const recomendacoes = await RecomendacaoImovel.findAll({
        include: [
          {
            model: Imovel,
            as: 'imovel',
            required: true,
            where: {
              tipo_negociacao,
              status,
              preco: {
                [Sequelize.Op.between]: [
                  preco * (1 - NotificationService.PRICE_TOLERANCE),
                  preco * (1 + NotificationService.PRICE_TOLERANCE)
                ]
              },
              area: {
                [Sequelize.Op.between]: [
                  area * (1 - NotificationService.AREA_TOLERANCE),
                  area * (1 + NotificationService.AREA_TOLERANCE)
                ]
              },
              latitude: {
                [Sequelize.Op.between]: [
                  latitude - NotificationService.GEO_TOLERANCE,
                  latitude + NotificationService.GEO_TOLERANCE
                ]
              },
              longitude: {
                [Sequelize.Op.between]: [
                  longitude - NotificationService.GEO_TOLERANCE,
                  longitude + NotificationService.GEO_TOLERANCE
                ]
              },
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

      const executionTime = Date.now() - startTime;

      return {
        recomendacoes,
        imovelSorteado,
        notificacoesSent,
        executionTime
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      throw new Error(`Erro ao processar notificações: ${error.message}`);
    }
  }

  // Função que notifica imóveis populares para usuários que não visitaram nenhum imóvel
  async _buscarImovelPopular() {
    // Verificar cache para manter consistência do imóvel popular
    if (this.popularPropertyCache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
      return this.popularPropertyCache;
    }


    try {
      // 1) pegar os 10 imoveis mais populares
      const imoveisPopulares = await RecomendacaoImovel.findAll({
        attributes: [
          "imovel_id",
          [Sequelize.fn("COUNT", Sequelize.col("imovel_id")), "total"],
        ],
        group: ["imovel_id"],
        order: [[Sequelize.literal("total"), "DESC"]],
        limit: NotificationService.TOP_PROPERTIES_LIMIT,
      });

      if (imoveisPopulares.length === 0) {
        return null;
      }

      // 2) sortear 1 desses 10
      const sorteado = imoveisPopulares[
        Math.floor(Math.random() * imoveisPopulares.length)
      ];

      // 3) buscar dados completos
      const imovelSorteado = await Imovel.findByPk(sorteado.imovel_id);


      // Atualizar cache para manter consistência
      this.popularPropertyCache = imovelSorteado;
      this.cacheExpiry = Date.now() + NotificationService.CACHE_DURATION;

      return imovelSorteado;
    } catch (error) {
      console.error("[NotificationService] Erro ao buscar imóvel popular:", error.message);
      throw new Error("Erro ao buscar imóvel popular.");
    }
  }

  // Função para enviar notificações via Socket.IO - SEM REDUNDÂNCIAS
  async _enviarNotificacoes(recomendacoes, novoImovel, imovelSorteado) {

   

    const notificacoesSent = {
      recomendacoes: 0,
      broadcast: false
    };

    try {
      // 1. NOTIFICAÇÕES PERSONALIZADAS (baseadas em recomendações) - UMA SÓ VEZ
      if (recomendacoes && recomendacoes.length > 0) {
        const usuariosIds = [...new Set(recomendacoes.map(r => r.usuario_id))];

        const resultados = sendToMultipleUsers(usuariosIds, 'nova_recomendacao', {
          type: 'personalized_recommendation',
          title: 'Nova Recomendação Personalizada',
          message: 'Encontramos um imóvel que combina com seu perfil!',
          property: {
            id: novoImovel.id,
            tipo_negociacao: novoImovel.tipo_negociacao,
            preco: novoImovel.preco,
            area: novoImovel.area,
            endereco: novoImovel.endereco,
            imagens: novoImovel.imagens
          }
        });

        notificacoesSent.recomendacoes = resultados.filter(r => r.sent).length;
      }

      // 2. BROADCAST DE IMÓVEL POPULAR (para usuários sem histórico) - UMA SÓ VEZ
      if (imovelSorteado) {

        const broadcastResult = broadcastNotification('imovel_popular', {
          type: 'popular_property',
          title: 'Imóvel Popular em Destaque',
          message: 'Confira este imóvel que está chamando atenção!',
          property: {
            id: imovelSorteado.id,
            tipo_negociacao: imovelSorteado.tipo_negociacao,
            preco: imovelSorteado.preco,
            area: imovelSorteado.area,
            endereco: imovelSorteado.endereco,
            imagens: imovelSorteado.imagens
          }
        });

        notificacoesSent.broadcast = broadcastResult;
      } else {
            console.log('ℹ️ Nenhum imóvel popular encontrado para broadcast');
        }
        return notificacoesSent;
    } catch (error) {
      console.error("❌ ERRO em _enviarNotificacoes:", error.message);
      throw new Error("Erro ao enviar notificações em tempo real.");
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

        const results = sendToMultipleUsers(userIds, 'alteracao_preco', {
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
      const result = sendToUser(userId, 'appointment_notification', {
        type: 'appointment',
        title: 'Agendamento Confirmado',
        message: 'Sua visita foi agendada com sucesso!',
        data: dadosAgendamento
      });

      return result;
    } catch (error) {
      console.error('[NotificationService] Erro ao notificar agendamento:', error.message);
      throw new Error('Erro ao notificar agendamento.');
    }
  }
}

export default NotificationService;
