import Casa from "../models/Casa.js";
import Terreno from "../models/Terreno.js";
import ImagemImovel from "../models/ImagemImovel.js";
import * as ImoveisService from "../services/ImoveisService.js";

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
      possui_jardim
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
      data_update_status: new Date()
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
      const filters = {
        tipo_negociacao: req.query.tipo_negociacao,
        tipo: req.query.tipo,
        minPreco: req.query.minPreco ? parseFloat(req.query.minPreco) : undefined,
        maxPreco: req.query.maxPreco ? parseFloat(req.query.maxPreco) : undefined,
        minArea: req.query.minArea ? parseInt(req.query.minArea) : undefined,
        maxArea: req.query.maxArea ? parseInt(req.query.maxArea) : undefined,
      };

      const filterMappings = {
        tipo_negociacao: { field: 'tipo_negociacao', type: 'exact' },
        tipo: { field: 'tipo', type: 'exact' },
        preco: { field: 'preco', type: 'range' },
        area: { field: 'area', type: 'range' },
      };

      const imoveis = await ImoveisService.getFilteredEntities(filters, filterMappings, [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }, { model: ImagemImovel, as: 'imagem_imovel' }]);
      res.status(200).json(imoveis);
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
