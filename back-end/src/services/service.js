const { Publicidade } = require("../models/model");

class PublicidadeService {
  async updatePublicidade(id, novosDados) {
    try {
      const publicidade = await Publicidade.findByPk(id);

      if (!publicidade) {
        throw new Error(`Publicidade com ID ${id} não encontrada.`);
      }

      publicidade.titulo = novosDados.titulo || publicidade.titulo;
      publicidade.conteudo = novosDados.conteudo || publicidade.conteudo;
      publicidade.url_imagem = novosDados.url_imagem || publicidade.url_imagem;
      publicidade.usuario_id = novosDados.usuario_id || publicidade.usuario_id;
      publicidade.ativo = novosDados.ativo !== undefined ? novosDados.ativo : publicidade.ativo;

      await publicidade.save();

      return publicidade;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PublicidadeService();
