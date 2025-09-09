// import BlogModel
import Blog from "../Models/Blog.js";

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
      // Retornar os erros de forma mais simples, ex: throw error
      console.error("Erro ao criar blog:", error.message);
      throw new Error("Não foi possível criar o blog.");
    }
  },
  // Buscar todos
  // async getAllPublicacoes
  async getAll() {
    try {
      return await Blog.findAll();
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: throw error
      console.error("Erro ao buscar todos os blogs:", error.message);
      throw new Error("Não foi possível listar os blogs.");
    }
  },
  // Buscar por ID
  // async getPublicacaoById
  async getById(id) {
    try {
      const blog = await Blog.findByPk(id);
      //  O service não deve tratar os erros, apenas procurar o registro pelo id e retornar
      if (!blog) throw new Error("Blog não encontrado.");
      return blog;
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: throw error
      console.error(`Erro ao buscar blog ${id}:`, error.message);
      throw new Error("Não foi possível buscar o blog.");
    }
  },
  // Atualizar
  // async updatePublicacao
  async update(id, updates) {
    try {
      const blog = await Blog.findByPk(id);
      // O service não deve tratar os erros, apenas procurar o registro pelo id e retornar
      if (!blog) throw new Error("Blog não encontrado.");
      await blog.update(updates);
      return blog;
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: throw error
      console.error(`Erro ao atualizar blog ${id}:`, error.message);
      throw new Error("Não foi possível atualizar o blog.");
    }
  },
  // Deletar
  // async deletePublicacao
  async delete(id) {
    try {
      const blog = await Blog.findByPk(id);
      // O service não deve tratar os erros, apenas procurar o registro pelo id e retornar
      if (!blog) throw new Error("Blog não encontrado.");
      await blog.destroy();
      return true;
    } catch (error) {
      // Retornar os erros de forma mais simples, ex: throw error
      console.error(`Erro ao remover blog ${id}:`, error.message);
      throw new Error("Não foi possível remover o blog.");
    }
  },
};

export default blogService;
