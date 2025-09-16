import mapaService from '../services/mapaService.js';

class MapaController {
  /**
   * GET /mapa - Lista todos os imóveis com filtros opcionais
   */
  async listarImoveis(req, res) {
    try {
      const filtros = {
        tipo: req.query.tipo,
        precoMin: req.query.precoMin ? parseFloat(req.query.precoMin) : null,
        precoMax: req.query.precoMax ? parseFloat(req.query.precoMax) : null,
        areaMin: req.query.areaMin ? parseInt(req.query.areaMin) : null,
        areaMax: req.query.areaMax ? parseInt(req.query.areaMax) : null,
        tipoNegociacao: req.query.tipoNegociacao,
        cidade: req.query.cidade,
        estado: req.query.estado,
        murado: req.query.murado !== undefined ? req.query.murado === 'true' : undefined,
        latitude: req.query.latitude ? parseFloat(req.query.latitude) : null,
        longitude: req.query.longitude ? parseFloat(req.query.longitude) : null,
        raio: req.query.raio ? parseFloat(req.query.raio) : null
      };

      const imoveis = await mapaService.buscarImoveis(filtros);
      
      res.status(200).json({
        success: true,
        data: imoveis,
        total: imoveis.length
      });
    } catch (error) {
      console.error('Erro ao listar imóveis:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /mapa/busca - Busca imóveis para a tela do mapa com filtros específicos
   */
  async buscarImoveisParaMapa(req, res) {
    try {
      const filtros = {
        tipo: req.query.tipo,
        precoMin: req.query.precoMin ? parseFloat(req.query.precoMin) : null,
        precoMax: req.query.precoMax ? parseFloat(req.query.precoMax) : null,
        areaMin: req.query.areaMin ? parseInt(req.query.areaMin) : null,
        areaMax: req.query.areaMax ? parseInt(req.query.areaMax) : null,
        quartos: req.query.quartos ? parseInt(req.query.quartos) : null,
        banheiros: req.query.banheiros ? parseInt(req.query.banheiros) : null,
        possuiPiscina: req.query.possuiPiscina !== undefined ? req.query.possuiPiscina === 'true' : undefined,
        possuiJardim: req.query.possuiJardim !== undefined ? req.query.possuiJardim === 'true' : undefined,
        murado: req.query.murado !== undefined ? req.query.murado === 'true' : undefined
      };

      const imoveis = await mapaService.buscarImoveisParaMapa(filtros);
      
      res.status(200).json({
        success: true,
        data: imoveis,
        total: imoveis.length
      });
    } catch (error) {
      console.error('Erro ao buscar imóveis para o mapa:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /mapa/coordenadas - Busca imóveis por coordenadas geográficas
   */
  async buscarImoveisPorCoordenadas(req, res) {
    try {
      const { lat, lng, raio } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: 'Latitude e longitude são obrigatórios'
        });
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const raioBusca = raio ? parseFloat(raio) : 0.01;

      const imoveis = await mapaService.buscarImoveisPorCoordenadas(latitude, longitude, raioBusca);
      
      res.status(200).json({
        success: true,
        data: imoveis,
        total: imoveis.length,
        coordenadas: { latitude, longitude, raio: raioBusca }
      });
    } catch (error) {
      console.error('Erro ao buscar imóveis por coordenadas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /mapa/:id - Busca imóvel específico por ID
   */
  async buscarImovelPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID do imóvel é obrigatório e deve ser um número'
        });
      }

      const imovel = await mapaService.buscarImovelPorId(parseInt(id));
      
      res.status(200).json({
        success: true,
        data: imovel
      });
    } catch (error) {
      console.error('Erro ao buscar imóvel por ID:', error);
      
      if (error.message === 'Imóvel não encontrado') {
        return res.status(404).json({
          success: false,
          message: 'Imóvel não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /mapa/tipos - Lista todos os tipos de imóveis disponíveis
   */
  async listarTiposImoveis(req, res) {
    try {
      const tipos = await mapaService.buscarTiposImoveis();
      
      res.status(200).json({
        success: true,
        data: tipos
      });
    } catch (error) {
      console.error('Erro ao listar tipos de imóveis:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /mapa/cidades - Lista todas as cidades disponíveis
   */
  async listarCidades(req, res) {
    try {
      const cidades = await mapaService.buscarCidades();
      
      res.status(200).json({
        success: true,
        data: cidades
      });
    } catch (error) {
      console.error('Erro ao listar cidades:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

export default new MapaController();
