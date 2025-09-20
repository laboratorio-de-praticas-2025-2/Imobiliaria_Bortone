import PublicidadeModel from "../models/publicidadeModel.js";

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

  async getAllPublicidades(params) {
    try {
      const optionsPublicidade = {};

      if (params && params.ordenarPor) {
        const ordemPublicidade = params.direcao === "DESC" ? "DESC" : "ASC";

        if (params.ordenarPor === "data") {
          optionsPublicidade.order = [["id", ordemPublicidade]];
        } else if (params.ordenarPor === "alfabetica") {
          optionsPublicidade.order = [["titulo", ordemPublicidade]];
        }
      }

      const AllPublicidades = await PublicidadeModel.findAll(optionsPublicidade);
      return AllPublicidades;
    } catch (error) {
      throw error;
    }
  }
}

export default new PublicidadeService();
