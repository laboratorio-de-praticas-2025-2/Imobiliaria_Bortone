import PublicidadeModel from "../models/publicidadeModel.js";
import { Op } from "sequelize";

class PublicidadeService {
  async createPublicidade(dadosCreatePublicidade) {
    try {
      const newPublicidade = await PublicidadeModel.create({
        titulo: dadosCreatePublicidade.titulo,
        conteudo: dadosCreatePublicidade.conteudo,
        url_imagem: dadosCreatePublicidade.url_imagem,
        usuario_id: dadosCreatePublicidade.usuario_id,
        ativo: dadosCreatePublicidade.ativo
      });
      return newPublicidade;
    } catch (error) {
      throw error;
    }
  }

  async updatePublicidade(idPublicidade, dadosUpdatePublicidade) {
    try {
 
      const updatePublicidade = await PublicidadeModel.findByPk(idPublicidade);
      if (!updatePublicidade) {
        return null;
      }

      updatePublicidade.titulo = dadosUpdatePublicidade.titulo ?? updatePublicidade.titulo;
      updatePublicidade.conteudo = dadosUpdatePublicidade.conteudo ?? updatePublicidade.conteudo;
      updatePublicidade.usuario_id = dadosUpdatePublicidade.usuario_id ?? updatePublicidade.usuario_id;
      updatePublicidade.ativo = dadosUpdatePublicidade.ativo ?? updatePublicidade.ativo;
      
      // Atualizar url_imagem apenas se for fornecida
      if (dadosUpdatePublicidade.url_imagem !== undefined) {
        updatePublicidade.url_imagem = dadosUpdatePublicidade.url_imagem;
      }

      await updatePublicidade.save();

      return updatePublicidade;
    } catch (error) {
      throw error;
    }
  }

  async deletePublicidade(idPublicidade) {
    try {
      const deletePublicidade = await PublicidadeModel.findByPk(idPublicidade);
      if (!deletePublicidade) {
        return null;
      }
      await deletePublicidade.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

    async getPublicidadeById(idPublicidade) {  
    try {
      const Publicidade = await PublicidadeModel.findByPk(idPublicidade);
      if (!Publicidade) {
        return null;
      }
      return Publicidade;
    } catch (error) {
      throw error;
    }
  }

async getAllPublicidades(params = {}) {
    const { search, ordenarPor = "id", direcao = "ASC" } = params;
    const options = {};
    // Filtro de busca por título
    if (search) {
      options.where = {
        titulo: { [Op.like]: `%${search}%` }
      };
    }
    const campos = {
      id: "id",
      titulo: "titulo",
      alfabetica: "alfabetica",
      data: "data"
    };
    const campo = campos[ordenarPor] || "id";
    options.order = [[campo, direcao.toUpperCase() === "DESC" ? "DESC" : "ASC"]];
    return PublicidadeModel.findAll(options);
  }
}


export default new PublicidadeService();
