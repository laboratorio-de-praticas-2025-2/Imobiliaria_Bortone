import Casa from "../models/Casa.js";
import Terreno from "../models/Terreno.js";
import ImagemImovel from "../models/ImagemImovel.js";
import * as ImoveisService from "../services/ImoveisService.js";
import NotificationService from "../services/notificationService.js";


const extractEntityData = (body) => {
    const {
      tipo,
      endereco,
      cidade,
      estado,
      preco,
      area,
      descricao,
      murado,
      latitude,
      longitude,
      usuario_id,
      tipo_negociacao,
      status,
      quartos,
      banheiros,
      vagas,
      possui_piscina,
      possui_jardim,
      visibilidade_preco
    } = body;

    const requiredImovelFields = ['tipo', 'endereco', 'cidade', 'estado', 'preco'];
    for (const field of requiredImovelFields) {
      if (!body[field]) {
        throw new Error(`Campo obrigatório faltando: ${field}`);
      }
    }

    const validTipoNegociacao = ['aluguel', 'venda'];
    if (tipo_negociacao && !validTipoNegociacao.includes(tipo_negociacao)) {
      throw new Error(`Tipo de negociação inválido. Valores aceitos: ${validTipoNegociacao.join(', ')}`);
    }

    const validStatus = ['disponivel', 'indisponivel', 'vendido', 'locado'];
    if (status && !validStatus.includes(status)) {
      throw new Error(`Status inválido. Valores aceitos: ${validStatus.join(', ')}`);
    }

    const imovelData = {
      tipo,
      endereco,
      cidade,
      estado,
      preco: parseFloat(preco),
      area: area ? parseInt(area) : null,
      descricao: descricao || null,
      murado: murado ? 1 : 0,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      usuario_id: usuario_id ? parseInt(usuario_id) : null,
      tipo_negociacao: tipo_negociacao || 'venda',
      status: status || 'disponivel',
      data_cadastro: new Date(),
      data_update_status: new Date(),
      visibilidade_preco: visibilidade_preco === undefined ? 1 : (visibilidade_preco ? 1 : 0),
    };

    const casaData = {
      quartos: quartos ? parseInt(quartos) : null,
      banheiros: banheiros ? parseInt(banheiros) : null,
      vagas: vagas ? parseInt(vagas) : null,
      possui_piscina: possui_piscina ? 1 : 0,
      possui_jardim: possui_jardim ? 1 : 0,
    };

    if (tipo === 'casa' || tipo === 'apartamento') {
      const requiredCasaFields = ['quartos', 'banheiros', 'vagas', 'possui_piscina', 'possui_jardim'];
      for (const field of requiredCasaFields) {
        if (!(field in body) || (body[field] === undefined || body[field] === null)) {
          throw new Error(`Campo obrigatório faltando para Casa/Apartamento: ${field}`);
        }
      }
    }

    return { imovelData, casaData };
  };

export const getByStatus = async (req, res) => {
    const { status } = req.params;
    try {
      const imoveis = await ImoveisService.findBy({ status }, [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }, { model: ImagemImovel, as: 'imagem_imovel' }]);
      res.status(200).json(imoveis);
    } catch (error) {
      console.error("Erro ao buscar imóveis por status:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

export const getByNegociacao = async (req, res) => {
    const { tipo } = req.params;
    try {
      const imoveis = await ImoveisService.findBy({ tipo_negociacao: tipo }, [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }, { model: ImagemImovel, as: 'imagem_imovel' }]);
      res.status(200).json(imoveis);
    } catch (error) {
      console.error("Erro ao buscar imóveis por tipo de negociação:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

export const getFilteredImoveis = async (req, res) => {
    try {
      // Parâmetros de paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50; // Default 50 para manter compatibilidade
      const offset = (page - 1) * limit;

      const filters = {
        tipo_negociacao: req.query.tipo_negociacao,
        tipo: req.query.tipo,
        status: req.query.status,
        minPreco: req.query.minPreco ? parseFloat(req.query.minPreco) : undefined,
        maxPreco: req.query.maxPreco ? parseFloat(req.query.maxPreco) : undefined,
        minArea: req.query.minArea ? parseInt(req.query.minArea) : undefined,
        maxArea: req.query.maxArea ? parseInt(req.query.maxArea) : undefined,
        quartos: req.query.quartos,
        banheiros: req.query.banheiros,
        vagas: req.query.vagas,
        searchTerm: req.query.searchTerm,
        citySearchTerm: req.query.citySearchTerm,
      };

      const filterMappings = {
        tipo_negociacao: { field: 'tipo_negociacao', type: 'exact' },
        tipo: { field: 'tipo', type: 'exact' },
        status: { field: 'status', type: 'exact' },
        preco: { field: 'preco', type: 'range' },
        area: { field: 'area', type: 'range' },
        quartos: { field: 'quartos', type: 'plus', model: 'casa' },
        banheiros: { field: 'banheiros', type: 'plus', model: 'casa' },
        vagas: { field: 'vagas', type: 'plus', model: 'casa' },
        searchTerm: { field: 'endereco', type: 'search' },
        citySearchTerm: { field: 'cidade', type: 'search' },
      };

      // Handle ordering parameters
      const ordering = {};
      if (req.query.orderBy) {
        ordering.orderBy = req.query.orderBy;
      }
      if (req.query.orderDirection) {
        ordering.orderDirection = req.query.orderDirection;
      }

      // Handle pagination parameters
      const pagination = {};
      if (req.query.page) {
        pagination.page = req.query.page;
      }
      if (req.query.pagination) {
        pagination.pagination = req.query.pagination;
      }
      
      // // Debug logging
      // console.log("Controller - Query parameters:", req.query);
      // console.log("Controller - Filters object:", filters);
      // console.log("Controller - Status filter value:", req.query.status);

      const result = await ImoveisService.getFilteredEntities(
        filters, 
        filterMappings, 
        [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }, { model: ImagemImovel, as: 'imagem_imovel' }], 
        ordering,
        pagination,
        true // Include pagination metadata
      );
      
      res.status(200).json(result);

    } catch (error) {
      console.error("Erro ao buscar imóveis com filtros:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório" });
      }

      const validStatuses = ['disponivel', 'indisponivel', 'vendido', 'locado'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: `Status inválido. Valores aceitos: ${validStatuses.join(', ')}` 
        });
      }

      await ImoveisService.update(id, { 
        status, 
        data_update_status: new Date() 
      });
      res.status(200).json({ message: "Status do imóvel atualizado com sucesso." });
    } catch (error) {
      if (error.message === "imóvel não encontrado") {
        res.status(404).json({ error: error.message });
      } else {
        console.error("Erro ao atualizar status do imóvel:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  };

export const getById = async (req, res) => {
    const { id } = req.params;
    try {
      const entity = await ImoveisService.getById(id, [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }, { model: ImagemImovel, as: 'imagem_imovel' }]);
      res.status(200).json(entity);
    } catch (error) {
      console.error(`Erro ao buscar imóvel por ID:`, error);
      if (error.message.includes("não encontrado")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  };

export const create = async (req, res) => {
    try {
      const { imovelData, casaData } = extractEntityData(req.body);
      const newImovel = await ImoveisService.create(imovelData, casaData);

      setImmediate(async () => {
      try{
        console.log("🔍 Iniciando sistema de notificações...");
        const notificationService = new NotificationService();
        console.log("✅ NotificationService criado");
        const resultado = await notificationService.dispararAlertaNovoImovel(newImovel, req.loggedUser);
        console.log("📊 Resultado do disparo:", resultado);
        console.log(`✅ Notificações enviadas para o imóvel ${newImovel.id}`);
      } catch(notificationError){
        console.error("❌ Erro ao enviar notificações:", notificationError.message);
        console.error("🔍 Stack completo:", notificationError.stack);
        console.error("🔍 Tipo do erro:", notificationError.constructor.name);
      }
      });

      res.status(201).json(newImovel);
    } catch (error) {
      console.error("Erro ao criar imóvel:", error);
      res.status(400).json({ error: error.message });
    }
  };

export const deleteImovel = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await ImoveisService.deleteImovel(id);
      if (!deleted) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
      }
      res.status(200).json({ message: "Imóvel e todas as entidades relacionadas foram excluídos com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

export const update = async (req, res) => {
  const { id } = req.params;
  try {
    const { imovelData, casaData } = extractEntityData(req.body);
    const updatedImovel = await ImoveisService.update(id, imovelData, casaData);
    res.status(200).json(updatedImovel);
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    res.status(400).json({ error: error.message });
  }
};
