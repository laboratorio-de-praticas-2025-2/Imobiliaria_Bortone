import PublicidadeModel from "../models/publicidadeModel.js";
import { Op } from "sequelize";

class PublicidadeService {
  async createPublicidade(dadosCreatePublicidade) {
    try {
      const newPublicidade = await PublicidadeModel.create({
        titulo: dadosCreatePublicidade.titulo,
        conteudo: dadosCreatePublicidade.conteudo,
        url_imagem: dadosCreatePublicidade.url_imagem,
        usuario_id: dadosCreatePublicidade.usuario_id,
        ativo: dadosCreatePublicidade.ativo
      });
      return newPublicidade;
    } catch (error) {
      throw error;
    }
  }

  async updatePublicidade(idPublicidade, dadosUpdatePublicidade) {
    try {
 
      const updatePublicidade = await PublicidadeModel.findByPk(idPublicidade);
      if (!updatePublicidade) {
        return null;
      }

      updatePublicidade.titulo = dadosUpdatePublicidade.titulo ?? updatePublicidade.titulo;
      updatePublicidade.conteudo = dadosUpdatePublicidade.conteudo ?? updatePublicidade.conteudo;
      updatePublicidade.usuario_id = dadosUpdatePublicidade.usuario_id ?? updatePublicidade.usuario_id;
      updatePublicidade.ativo = dadosUpdatePublicidade.ativo ?? updatePublicidade.ativo;
      
      // Atualizar url_imagem apenas se for fornecida
      if (dadosUpdatePublicidade.url_imagem !== undefined) {
        updatePublicidade.url_imagem = dadosUpdatePublicidade.url_imagem;
      }

      await updatePublicidade.save();

      return updatePublicidade;
    } catch (error) {
      throw error;
    }
  }

  async deletePublicidade(idPublicidade) {
    try {
      const deletePublicidade = await PublicidadeModel.findByPk(idPublicidade);
      if (!deletePublicidade) {
        return null;
      }
      await deletePublicidade.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

    async getPublicidadeById(idPublicidade) {  
    try {
      const Publicidade = await PublicidadeModel.findByPk(idPublicidade);
      if (!Publicidade) {
        return null;
      }
      return Publicidade;
    } catch (error) {
      throw error;
    }
  }

  async getAllPublicidades(params) {
    try {
      console.log('=== SERVICE DEBUG ===');
      console.log('Parâmetros recebidos:', params);

      const optionsPublicidade = {};

      // Implementar filtros se necessário
      if (params && params.titulo) {
        optionsPublicidade.where = {
          titulo: {
            [PublicidadeModel.sequelize.Sequelize.Op.like]: `%${params.titulo}%`
          }
        };
        console.log('Filtro por título aplicado:', params.titulo);
      }

      if (params && params.usuario_id) {
        if (!optionsPublicidade.where) {
          optionsPublicidade.where = {};
        }
        optionsPublicidade.where.usuario_id = params.usuario_id;
        console.log('Filtro por usuário aplicado:', params.usuario_id);
      }

      // Implementar ordenação
      if (params && params.ordenarPor) {
        const ordemPublicidade = params.direcao === "DESC" ? "DESC" : "ASC";
        console.log('Ordenação solicitada:', params.ordenarPor, 'direção:', ordemPublicidade);

        if (params.ordenarPor === "data") {
          // Usar ID para ordenação por data de inclusão (ID maior = mais recente)
          optionsPublicidade.order = [["id", ordemPublicidade]];
          console.log('Aplicando ordenação por ID (data)');
        } else if (params.ordenarPor === "alfabetica") {
          optionsPublicidade.order = [["titulo", ordemPublicidade]];
          console.log('Aplicando ordenação alfabética por título');
        }
      } else {
        // Ordenação padrão por data de inclusão (mais recente primeiro)
        optionsPublicidade.order = [["id", "DESC"]];
        console.log('Aplicando ordenação padrão (ID DESC)');
      }

      // Implementar paginação
      const page = parseInt(params?.page) || 1;
      const limit = parseInt(params?.limit) || 12; // 12 itens por página por padrão
      const offset = (page - 1) * limit;

      optionsPublicidade.limit = limit;
      optionsPublicidade.offset = offset;

      console.log('Paginação aplicada - Página:', page, 'Limite:', limit, 'Offset:', offset);
      console.log('Options finais para busca:', JSON.stringify(optionsPublicidade, null, 2));

      // Usar findAndCountAll para obter tanto os dados quanto o total de registros
      const result = await PublicidadeModel.findAndCountAll(optionsPublicidade);

      const totalItems = result.count;
      const totalPages = Math.ceil(totalItems / limit);
      const publicidades = result.rows;

      console.log('Publicidades encontradas:', publicidades.length);
      console.log('Total de registros:', totalItems);
      console.log('Total de páginas:', totalPages);

      if (publicidades.length > 0) {
        console.log('Primeira publicidade:', publicidades[0].titulo, 'ID:', publicidades[0].id);
        console.log('Última publicidade:', publicidades[publicidades.length - 1].titulo, 'ID:', publicidades[publicidades.length - 1].id);
      }
      console.log('====================');

      // Retornar dados com metadados de paginação
      return {
        data: publicidades,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      console.error('Erro no service:', error);
      throw error;
    }
  }
}


export default new PublicidadeService();
