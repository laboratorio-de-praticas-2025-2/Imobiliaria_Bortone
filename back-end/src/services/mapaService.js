import { Imovel, Casa, ImagemImovel, Usuario } from '../models/mapaModels.js';
import { Op } from 'sequelize';
import connection from '../config/sequelize-config.js';

class MapaService {
  /**
   * Busca todos os imóveis com filtros opcionais
   */
  async buscarImoveis(filtros = {}) {
    try {
      const whereClause = {};
      const includeClause = [
        {
          model: ImagemImovel,
          as: 'imagem_imovels',
          attributes: ['url_imagem', 'descricao']
        },
        {
          model: Casa,
          as: 'casa',
          attributes: ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim']
        }
      ];

      // Filtro por tipo de propriedade
      if (filtros.tipo) {
        whereClause.tipo = filtros.tipo;
      }

      // Filtro por faixa de preço
      if (filtros.precoMin || filtros.precoMax) {
        whereClause.preco = {};
        if (filtros.precoMin) whereClause.preco[Op.gte] = filtros.precoMin;
        if (filtros.precoMax) whereClause.preco[Op.lte] = filtros.precoMax;
      }

      // Filtro por área
      if (filtros.areaMin || filtros.areaMax) {
        whereClause.area = {};
        if (filtros.areaMin) whereClause.area[Op.gte] = filtros.areaMin;
        if (filtros.areaMax) whereClause.area[Op.lte] = filtros.areaMax;
      }

      // Filtro por tipo de negociação
      if (filtros.tipoNegociacao) {
        whereClause.tipo_negociacao = filtros.tipoNegociacao;
      }

      // Filtro por cidade
      if (filtros.cidade) {
        whereClause.cidade = { [Op.like]: `%${filtros.cidade}%` };
      }

      // Filtro por estado
      if (filtros.estado) {
        whereClause.estado = filtros.estado;
      }

      // Filtro por murado
      if (filtros.murado !== undefined) {
        whereClause.murado = filtros.murado;
      }

      // Filtro por coordenadas (para busca por região)
      if (filtros.latitude && filtros.longitude && filtros.raio) {
        whereClause.latitude = {
          [Op.between]: [
            filtros.latitude - filtros.raio,
            filtros.latitude + filtros.raio
          ]
        };
        whereClause.longitude = {
          [Op.between]: [
            filtros.longitude - filtros.raio,
            filtros.longitude + filtros.raio
          ]
        };
      }

      const imoveis = await Imovel.findAll({
        where: whereClause,
        include: includeClause,
        order: [['data_cadastro', 'DESC']]
      });

      return imoveis;
    } catch (error) {
      throw new Error(`Erro ao buscar imóveis: ${error.message}`);
    }
  }

  /**
   * Busca imóveis por coordenadas (para o mapa)
   */
  async buscarImoveisPorCoordenadas(lat, lng, raio = 0.01) {
    try {
      const imoveis = await Imovel.findAll({
        where: {
          latitude: {
            [Op.between]: [lat - raio, lat + raio]
          },
          longitude: {
            [Op.between]: [lng - raio, lng + raio]
          }
        },
        include: [
          {
            model: ImagemImovel,
            as: 'imagem_imovels',
            attributes: ['url_imagem', 'descricao']
          },
          {
            model: Casa,
            as: 'casa',
            attributes: ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim']
          }
        ]
      });

      return imoveis;
    } catch (error) {
      throw new Error(`Erro ao buscar imóveis por coordenadas: ${error.message}`);
    }
  }

  /**
   * Busca imóvel por ID com todas as informações
   */
  async buscarImovelPorId(id) {
    try {
      const imovel = await Imovel.findByPk(id, {
        include: [
          {
            model: ImagemImovel,
            as: 'imagem_imovels',
            attributes: ['url_imagem', 'descricao']
          },
          {
            model: Casa,
            as: 'casa',
            attributes: ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nome', 'celular']
          }
        ]
      });

      if (!imovel) {
        throw new Error('Imóvel não encontrado');
      }

      return imovel;
    } catch (error) {
      throw new Error(`Erro ao buscar imóvel: ${error.message}`);
    }
  }

  /**
   * Busca imóveis com filtros específicos para a tela do mapa
   */
  async buscarImoveisParaMapa(filtros = {}) {
    try {
      const whereClause = {};
      const includeClause = [
        {
          model: ImagemImovel,
          as: 'imagem_imovels',
          attributes: ['url_imagem', 'descricao']
        },
        {
          model: Casa,
          as: 'casa',
          attributes: ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim']
        }
      ];

      // Filtros básicos
      if (filtros.tipo) {
        whereClause.tipo = filtros.tipo;
      }

      if (filtros.precoMin || filtros.precoMax) {
        whereClause.preco = {};
        if (filtros.precoMin) whereClause.preco[Op.gte] = filtros.precoMin;
        if (filtros.precoMax) whereClause.preco[Op.lte] = filtros.precoMax;
      }

      if (filtros.areaMin || filtros.areaMax) {
        whereClause.area = {};
        if (filtros.areaMin) whereClause.area[Op.gte] = filtros.areaMin;
        if (filtros.areaMax) whereClause.area[Op.lte] = filtros.areaMax;
      }

      // Filtros específicos para casas
      if (filtros.quartos) {
        includeClause[1].where = { quartos: filtros.quartos };
      }

      if (filtros.banheiros) {
        if (includeClause[1].where) {
          includeClause[1].where.banheiros = filtros.banheiros;
        } else {
          includeClause[1].where = { banheiros: filtros.banheiros };
        }
      }

      // Filtros de opções
      if (filtros.possuiPiscina !== undefined) {
        if (includeClause[1].where) {
          includeClause[1].where.possui_piscina = filtros.possuiPiscina;
        } else {
          includeClause[1].where = { possui_piscina: filtros.possuiPiscina };
        }
      }

      if (filtros.possuiJardim !== undefined) {
        if (includeClause[1].where) {
          includeClause[1].where.possui_jardim = filtros.possuiJardim;
        } else {
          includeClause[1].where = { possui_jardim: filtros.possuiJardim };
        }
      }

      if (filtros.murado !== undefined) {
        whereClause.murado = filtros.murado;
      }

      const imoveis = await Imovel.findAll({
        where: whereClause,
        include: includeClause,
        order: [['data_cadastro', 'DESC']]
      });

      return imoveis;
    } catch (error) {
      throw new Error(`Erro ao buscar imóveis para o mapa: ${error.message}`);
    }
  }

  /**
   * Busca todos os tipos de imóveis disponíveis
   */
  async buscarTiposImoveis() {
    try {
      const tipos = await Imovel.findAll({
        attributes: [[connection.fn('DISTINCT', connection.col('tipo')), 'tipo']],
        where: {
          tipo: {
            [Op.not]: null
          }
        }
      });

      return tipos.map(tipo => tipo.dataValues.tipo);
    } catch (error) {
      throw new Error(`Erro ao buscar tipos de imóveis: ${error.message}`);
    }
  }

  /**
   * Busca todas as cidades disponíveis
   */
  async buscarCidades() {
    try {
      const cidades = await Imovel.findAll({
        attributes: [[connection.fn('DISTINCT', connection.col('cidade')), 'cidade']],
        where: {
          cidade: {
            [Op.not]: null
          }
        },
        order: [['cidade', 'ASC']]
      });

      return cidades.map(cidade => cidade.dataValues.cidade);
    } catch (error) {
      throw new Error(`Erro ao buscar cidades: ${error.message}`);
    }
  }
}

export default new MapaService();
