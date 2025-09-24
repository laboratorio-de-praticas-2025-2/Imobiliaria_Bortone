import Blog from "../models/Blog.js";
import { Op } from "sequelize";

class BlogService {
  async createArtigo({ titulo, conteudo, data_publicacao, url_imagem, usuario_id }) {
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
  }

  async getAllArtigos(params) {
    try {
      console.log("=== BLOG SERVICE DEBUG ===");
      console.log("Parâmetros recebidos:", params);

      const optionsArtigos = {};

      if (params?.titulo) {
        optionsArtigos.where = {
          titulo: {
            [Op.like]: `%${params.titulo}%`,
          },
        };
        console.log("Filtro por título aplicado:", params.titulo);
      }

      if (params?.usuario_id) {
        optionsArtigos.where = optionsArtigos.where || {};
        optionsArtigos.where.usuario_id = params.usuario_id;
        console.log("Filtro por usuário aplicado:", params.usuario_id);
      }

      const ordem = params?.direcao === "DESC" ? "DESC" : "ASC";
      if (params?.ordenarPor === "data") {
        optionsArtigos.order = [["data_publicacao", ordem]];
        console.log("Ordenação aplicada por data:", ordem);
      } else if (params?.ordenarPor === "alfabetica") {
        optionsArtigos.order = [["titulo", ordem]];
        console.log("Ordenação alfabética aplicada:", ordem);
      } else {
        optionsArtigos.order = [["data_publicacao", "DESC"]];
        console.log("Ordenação padrão aplicada (data DESC)");
      }

      const page = parseInt(params?.page) || 1;
      const limit = parseInt(params?.limit) || 12;
      const offset = (page - 1) * limit;

      optionsArtigos.limit = limit;
      optionsArtigos.offset = offset;

      console.log("Paginação - Página:", page, "Limite:", limit, "Offset:", offset);
      console.log("Options finais:", JSON.stringify(optionsArtigos, null, 2));

      const result = await Blog.findAndCountAll(optionsArtigos);

      const totalItems = result.count;
      const totalPages = Math.ceil(totalItems / limit);
      const artigos = result.rows;

      console.log("Artigos encontrados:", artigos.length);
      console.log("Total de registros:", totalItems);
      console.log("Total de páginas:", totalPages);

      return {
        data: artigos,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Erro no service de artigos:", error);
      throw error;
    }
  }

  async getArtigoById(id) {
    try {
      const artigo = await Blog.findByPk(id);
      if (!artigo) return null;
      return artigo;
    } catch (error) {
      console.error(`Erro ao buscar artigo ${id}:`, error.message);
      throw error;
    }
  }

  async updateArtigo(id, dadosAtualizar) {
    try {
      const artigo = await Blog.findByPk(id);
      if (!artigo) return null;

      await artigo.update(dadosAtualizar);
      return artigo;
    } catch (error) {
      console.error(`Erro ao atualizar artigo ${id}:`, error.message);
      throw error;
    }
  }

  async deleteArtigo(id) {
    try {
      const artigo = await Blog.findByPk(id);
      if (!artigo) return null;

      await artigo.destroy();
      return true;
    } catch (error) {
      console.error(`Erro ao deletar artigo ${id}:`, error.message);
      throw error;
    }
  }
}

export default new BlogService();