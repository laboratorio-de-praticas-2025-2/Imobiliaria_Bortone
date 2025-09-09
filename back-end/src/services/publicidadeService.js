// import PublicidadeModel from ...
const Publicidade = require("../models/publicidade");

class PublicidadeService {
  async createPublicidade(dadosCreatePublicidade) {
    try {
      // const newPublicidade = ...
      const publicidade = await Publicidade.create({
        titulo: dadosCreatePublicidade.titulo,
        conteudo: dadosCreatePublicidade.conteudo,
        url_imagem: dadosCreatePublicidade.url_imagem,
        usuario_id: dadosCreatePublicidade.usuario_id
        // Definir o atributo "ativo" como false
      });

      // return newPublicidade;
      return publicidade;
    } catch (error) {
      throw error;
    }
  }

  // async updatePublicidade (idPublicidade, dadosUpdatePublicidade) ...
  async updatePublicidade(id, dadosUpdatePublicidade) {
    try {
      // O service não deve validar os dados e nem tratar erros, apenas buscar a publicidade referente ao id recebido e fazer as alterações de acordo com os dados recebidos
      if (!id || isNaN(id) || Number(id) <= 0) {
        throw new Error("ID de publicidade inválido.");
      }
      
      const publicidade = await Publicidade.findByPk(id);
      if (!publicidade) {
        throw new Error(`Publicidade com ID ${id} não encontrada.`);
      }

      publicidade.titulo = dadosUpdatePublicidade.titulo || publicidade.titulo;
      publicidade.conteudo = dadosUpdatePublicidade.conteudo || publicidade.conteudo;
      publicidade.url_imagem = dadosUpdatePublicidade.url_imagem || publicidade.url_imagem;
      publicidade.usuario_id = dadosUpdatePublicidade.usuario_id || publicidade.usuario_id;
      // Atualizar também o atributo "ativo"

      await publicidade.save();

      return publicidade;
    } catch (error) {
      throw error;
    }
  }

  async deletePublicidade(id) {
    try {
      const publicidade = await Publicidade.findByPk(id);

      if (!publicidade) {
        throw new Error(`Publicidade com ID ${id} não encontrada.`);
      }

      await publicidade.destroy();

      // O service não deve retornar mensagens
      return { message: `Publicidade com ID ${id} foi deletada com sucesso.` };
    } catch (error) {
      throw error;
    }
  }

    async readPublicidade(id) {
    try {
      // O service não deve validar os dados e nem tratar erros, apenas buscar a publicidade referente ao id recebido e retornar o registro 
      if (!id || isNaN(id) || Number(id) <= 0) {
        throw new Error("ID de publicidade inválido.");
      }

      const publicidade = await Publicidade.findByPk(id);

      if (!publicidade) {
        throw new Error(`Publicidade com ID ${id} não encontrada.`);
      }

      return publicidade;
    } catch (error) {
      throw error;
    }
  }

  // Adicionar o método GetAllPublicidades, com o opcional de receber parametros para ordenação por data ou por ordem alfabetica
  
}

module.exports = new PublicidadeService();
