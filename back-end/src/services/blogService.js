import Blog from "../models/Blog.js";

const blogService = {
  async createArtigo({
    titulo,
    conteudo,
    data_publicacao,
    url_imagem,
    usuario_id,
  }) {
    try {
      const novoArtigo = await Blog.create({
        titulo,
        conteudo,
        data_publicacao,
        url_imagem,
        usuario_id,
      });
      return novoArtigo;
    } catch (error) {
      console.error("Erro ao criar artigo:", error.message);
      throw error;
    }
  },

  async getAllArtigos() {
    // Adicionar os parametros para ordenar por data ou ordem alfabetica, e pesquisar
    try {
      // Adicionar lógica de pesquisa por titulo

      // Adicionar lógica de ordenação por data de publicaçao e por ordem alfabetica

      return await Blog.findAll(); // Passar os parametros
    } catch (error) {
      console.error("Erro ao buscar todos os artigos:", error.message);
      throw error;
    }
  },

  async getArtigoById(id) {
    try {
      const artigo = await Blog.findByPk(id);
      if (!artigo) throw new Error(`Artigo com o ID: ${id} não encontrado.`);
      return artigo;
    } catch (error) {
      console.error(`Erro ao buscar artigo ${id}:`, error.message);
      throw error;
    }
  },

  async updateArtigo(id, dadosAtualizar) {
    try {
      const artigo = await Blog.findByPk(id);
      if (!artigo) throw new Error(`Artigo com o ID: ${id} não encontrado.`);
      await artigo.update(dadosAtualizar);
      return artigo;
    } catch (error) {
      console.error(`Erro ao atualizar artigo ${id}:`, error.message);
      throw error;
    }
  },

  async deleteArtigo(id) {
    try {
      const artigo = await Blog.findByPk(id);
      if (!artigo) throw new Error(`Artigo com o ID: ${id} não encontrado.`);
      await artigo.destroy();
      return true;
    } catch (error) {
      console.error(`Erro ao remover blog ${id}:`, error.message);
      throw error;
    }
  },
};

export default blogService;
