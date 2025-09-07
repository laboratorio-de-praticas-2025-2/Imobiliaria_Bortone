const Publicidade = require("../models/publicidade");

class PublicidadeService {
  async createPublicidade(dadosCreatePublicidade) {
    try {
      const publicidade = await Publicidade.create({
        titulo: dadosCreatePublicidade.titulo,
        conteudo: dadosCreatePublicidade.conteudo,
        url_imagem: dadosCreatePublicidade.url_imagem,
        usuario_id: dadosCreatePublicidade.usuario_id
      });

      return publicidade;
    } catch (error) {
      throw error;
    }
  }

  async updatePublicidade(id, dadosUpdatePublicidade) {
    try {
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

      return { message: `Publicidade com ID ${id} foi deletada com sucesso.` };
    } catch (error) {
      throw error;
    }
  }

    async readPublicidade(id) {
    try {
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
  
}

module.exports = new PublicidadeService();
