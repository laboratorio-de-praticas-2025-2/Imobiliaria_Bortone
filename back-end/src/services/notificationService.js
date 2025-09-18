import { Sequelize } from "sequelize";
import Imovel from "../models/Imovel";
import RecomendacaoImovel from "../models/recomendacaoImovelModal";

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

      // TODO: montar o payload para enviar para o SocketManager, retorna as informações de imóveis por enquanto.
      return { recomendacoes, imovelSorteado}
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
}

export default NotificationService;
