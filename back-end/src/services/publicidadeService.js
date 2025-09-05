const Publicidade = require("../models/publicidade");

class PublicidadeService {
  async serviceCreate(dadosPublicidade) {
    try {
      const publicidade = await Publicidade.create({
        titulo: dadosPublicidade.titulo,
        conteudo: dadosPublicidade.conteudo,
        url_imagem: dadosPublicidade.url_imagem,
        usuario_id: dadosPublicidade.usuario_id
      });

      return publicidade;
    } catch (error) {
      throw error;
    }
  }

  async updatePublicidade(id, novosDados) {
    try {
      if (!id || isNaN(id) || Number(id) <= 0) {
        throw new Error("ID de publicidade inválido.");
      }
      
      const publicidade = await Publicidade.findByPk(id);

      if (!publicidade) {
        throw new Error(`Publicidade com ID ${id} não encontrada.`);
      }

      publicidade.titulo = novosDados.titulo || publicidade.titulo;
      publicidade.conteudo = novosDados.conteudo || publicidade.conteudo;
      publicidade.url_imagem = novosDados.url_imagem || publicidade.url_imagem;
      publicidade.usuario_id = novosDados.usuario_id || publicidade.usuario_id;
      

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
}

module.exports = new PublicidadeService();
