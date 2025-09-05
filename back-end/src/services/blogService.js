import Blog from "../Models/Blog.js";

const blogService = {
  // Criar
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
      console.error("Erro ao criar blog:", error.message);
      throw new Error("Não foi possível criar o blog.");
    }
  },
  // Buscar todos
  async getAll() {
    try {
      return await Blog.findAll();
    } catch (error) {
      console.error("Erro ao buscar todos os blogs:", error.message);
      throw new Error("Não foi possível listar os blogs.");
    }
  },
  // Buscar por ID
  async getById(id) {
    try {
      const blog = await Blog.findByPk(id);
      if (!blog) throw new Error("Blog não encontrado.");
      return blog;
    } catch (error) {
      console.error(`Erro ao buscar blog ${id}:`, error.message);
      throw new Error("Não foi possível buscar o blog.");
    }
  },
};

export default blogService;
