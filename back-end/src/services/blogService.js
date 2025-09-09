// import BlogModel
import Blog from "../models/Blog.js";

const blogService = {
  // Criar
  // async createPublicacao
  async create({ titulo, conteudo, data_publicacao, url_imagem, usuario_id }) {
    try {
      return await Blog.create({
        titulo,
        conteudo,
        data_publicacao,
        url_imagem,
        usuario_id,
      });
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: console
      console.error("Erro ao criar blog:", error.message);
    }
  },
  // Buscar todos
  // async getAllPublicacoes
  async getAllBlog() {
    try {
      return await Blog.findAll();
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: console
      console.error("Erro ao buscar todos os blogs:", error.message);
    }
  },
  // Buscar por ID
  // async getPublicacaoById
  async getByIdBlog(id) {
    try {
      const blog = await Blog.findByPk(id);
      //  O service não deve tratar os erros, apenas procurar o registro pelo id e retornar
      if (!blog) throw new Error("Blog não encontrado.");
      return blog;
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: console
      console.error(`Erro ao buscar blog ${id}:`, error.message);
    }
  },
  // Atualizar
  // async updatePublicacao
  async updateBlog(id, updates) {
    try {
      const blog = await Blog.findByPk(id);
      // O service não deve tratar os erros, apenas procurar o registro pelo id e retornar
      if (!blog) throw new Error("Blog não encontrado.");
      await blog.update(updates);
      return blog;
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: console
      console.error(`Erro ao atualizar blog ${id}:`, error.message);
    }
  },
  // Deletar
  // async deletePublicacao
  async deleteBlog(id) {
    try {
      const blog = await Blog.findByPk(id);
      // O service não deve tratar os erros, apenas procurar o registro pelo id e retornar
      if (!blog) throw new Error("Blog não encontrado.");
      await blog.destroy();
      return true;
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: console
      console.error(`Erro ao remover blog ${id}:`, error.message);
    }
  },
};

export default blogService;
