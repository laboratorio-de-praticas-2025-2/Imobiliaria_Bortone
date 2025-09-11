// import PublicidadeModel from ...
const Publicidade = require("../models/publicidade");

class PublicidadeService {
  async createPublicidade(dadosCreatePublicidade) {
    try {
      // const newPublicidade = ...
      const newPublicidade = await Publicidade.create({
        titulo: dadosCreatePublicidade.titulo,
        conteudo: dadosCreatePublicidade.conteudo,
        url_imagem: dadosCreatePublicidade.url_imagem,
        usuario_id: dadosCreatePublicidade.usuario_id,
        // Definir o atributo "ativo" como false
        ativo: false
      });

      // return newPublicidade;
      return newPublicidade;
    } catch (error) {
      throw error;
    }
  }

  // async updatePublicidade (idPublicidade, dadosUpdatePublicidade) ...
  async updatePublicidade(idPublicidade, dadosUpdatePublicidade) {
    try {
      // O service não deve validar os dados e nem tratar erros, apenas buscar a publicidade referente ao id recebido e fazer as alterações de acordo com os dados recebidos
      const updatePublicidade = await Publicidade.findByPk(idPublicidade);
      if (!updatePublicidade) {
        return null;
      }

      updatePublicidade.titulo = dadosUpdatePublicidade.titulo ?? updatePublicidade.titulo;
      updatePublicidade.conteudo = dadosUpdatePublicidade.conteudo ?? updatePublicidade.conteudo;
      updatePublicidade.url_imagem = dadosUpdatePublicidade.url_imagem ?? updatePublicidade.url_imagem;
      updatePublicidade.usuario_id = dadosUpdatePublicidade.usuario_id ?? updatePublicidade.usuario_id;
      updatePublicidade.ativo = dadosUpdatePublicidade.ativo ?? updatePublicidade.ativo;

      await updatePublicidade.save();

      return updatePublicidade;
    } catch (error) {
      throw error;
    }
  }

  async deletePublicidade(idPublicidade) {
    try {
      const deletePublicidade = await Publicidade.findByPk(idPublicidade);
      if (!deletePublicidade) {
        return null;
      }
      await deletePublicidade.destroy();
      return deletePublicidade;
    } catch (error) {
      throw error;
    }
  }

    async readPublicidade(idPublicidade) {  
    try {
      // O service não deve validar os dados e nem tratar erros, apenas buscar a publicidade referente ao id recebido e retornar o registro 
      const readPublicidade = await Publicidade.findByPk(idPublicidade);
      if (!readPublicidade) {
        return null;
      }
      return readPublicidade;
    } catch (error) {
      throw error;
    }
  }

  // Adicionar o método GetAllPublicidades, com o opcional de receber parametros para ordenação por data ou por ordem alfabetica
  async getAllPublicidades(params) {
    try {
      const options = {};

      if (params && params.ordenarPor) {
        const ordemPublicidade = params.direcao === "DESC" ? "DESC" : "ASC";

        if (params.ordenarPor === "data") {
          options.order = [["createdAt", ordemPublicidade]];
        } else if (params.ordenarPor === "alfabetica") {
          options.order = [["titulo", ordemPublicidade]];
        }
      }

      const publicidades = await Publicidade.findAll(options);
      return publicidades;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PublicidadeService();
