import Blog from "../models/Blog.js";

// Tudo oq for BLOG, alterar para ARTIGO

const blogService = {
  // async createArtigo (dadosArtigo)
  async create({ titulo, conteudo, data_publicacao, url_imagem, usuario_id }) {
    try {
      // const novoArtigo = await Blog.create(dadosArtigo) ....
      return await Blog.create({
        titulo,
        conteudo,
        data_publicacao,
        url_imagem,
        usuario_id,
      });
      // return novoArtigo
    } catch (error) {
      // Alterar para "Erro ao criar artigo"
      console.error("Erro ao criar blog:", error.message);
      // throw error
    }
  },
  // async getAllArtigos
  async getAllBlog() { // Adicionar os parametros para ordenar por data ou ordem alfabetica, e pesquisar
    try {

      // Adicionar lógica de pesquisa por titulo

      // Adicionar lógica de ordenação por data de publicaçao e por ordem alfabetica

      return await Blog.findAll(); // Passar os parametros
    } catch (error) {
      // Alterar para "Erro ao buscar todos os artigos"
      console.error("Erro ao buscar todos os blogs:", error.message);
      // throw error
    }
  },
  // async getArtigoById
  async getByIdBlog(id) {
    try {
      // const artigo = ...
      const blog = await Blog.findByPk(id);
      // Alterar para "Artigo com o ID: ... não encontrado."
      if (!blog) throw new Error("Blog não encontrado.");
      return blog;
    } catch (error) {
      // Alterar para "Erro ao buscar artigo"
      console.error(`Erro ao buscar blog ${id}:`, error.message);
      // throw error
    }
  },
  // async updateArtigo
  async updateBlog(id, updates) { //Alterar "updates" para "dadosAtualizar"
    try {
      const blog = await Blog.findByPk(id);
      // Alterar para "Artigo com o ID: ... não encontrado."
      if (!blog) throw new Error("Blog não encontrado.");
      await blog.update(updates);
      return blog;
    } catch (error) {
      // Alterar para "Erro ao atualizar artigo"
      console.error(`Erro ao atualizar blog ${id}:`, error.message);
      // throw error
    }
  },
  // async deleteArtigo
  async deleteBlog(id) {
    try {
      const blog = await Blog.findByPk(id);
      // Alterar para "Artigo com o ID: ... não encontrado."
      if (!blog) throw new Error("Blog não encontrado.");
      await blog.destroy();
      return true;
    } catch (error) {
      // Alterar para "Erro ao remover artigo"
      console.error(`Erro ao remover blog ${id}:`, error.message);
      // throw error
    }
  },
};

export default blogService;
