import { error } from "console";
import sequelize from "../config/sequelize-config.js";
import fs from "fs";

class ReportService {
  async #executeQuery(query, errorMessage) {
    try {
      return await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        logging: false,
      });
    } catch (dbError) {
      console.error(`${errorMessage}:`, {
        message: dbError.message,
        query: query.substring(0, 200) + "...",
        stack: dbError.stack,
      });

      throw new Error(errorMessage);
    }
  }

  async buscarDadosParaRelatorio(tipo) {
    try {
      let dadosRelatorio = {};

      switch (tipo) {
        case "geral":
          dadosRelatorio = await this.obterDadosGerais();
          break;
        case "imoveis":
          dadosRelatorio = await this.obterDadosImoveis();
          break;
        case "vendas":
          dadosRelatorio = await this.obterDadosVendas();
          break;
        case "alugueis":
        case "locacoes":
          dadosRelatorio = await this.obterDadosAlugueis();
          break;
        case "usuarios":
          dadosRelatorio = await this.obterDadosUsuarios();
          break;
        default:
          throw new Error("Tipo de relatório inválido.");
      }

      return dadosRelatorio;
    } catch (error) {
      console.error("Erro ao buscar dados do relatório:", error);
      throw error;
    }
  }

  async obterDadosGerais() {
    const [{imoveis}, {usuarios}, {vendas},{alugueis}] = await Promise.all([
      this.obterDadosImoveis(),
      this.obterDadosUsuarios(),
      this.obterDadosVendas(),
      this.obterDadosAlugueis(),
    ]);

    return {
      imoveis,
      usuarios,
      vendas,
      alugueis,
      pdfNome: "Relatório Geral"
    };
  }

  async obterDadosImoveis() {
    try {
      // Query para obter dados consolidados de imóveis
      const QUERY_IMOVEIS = `
        SELECT 
          COUNT(*) as totalImoveis,
          COUNT(CASE WHEN tipo_negociacao = 'venda' THEN 1 END) as totalVendas,
          COUNT(CASE WHEN tipo_negociacao = 'aluguel' THEN 1 END) as totalAlugueis,
          COUNT(CASE WHEN status = 'disponivel' THEN 1 END) as disponiveis,
          COUNT(CASE WHEN status = 'vendido' THEN 1 END) as vendidos,
          COUNT(CASE WHEN status = 'locado' THEN 1 END) as locados,
          COUNT(CASE WHEN status = 'indisponivel' THEN 1 END) as indisponiveis,
          COUNT(CASE WHEN tipo = 'casa' THEN 1 END) as totalCasas,
          COUNT(CASE WHEN tipo = 'terreno' THEN 1 END) as totalTerrenos,
          AVG(preco) as precoMedio,
          SUM(CASE WHEN tipo_negociacao = 'venda' THEN preco ELSE 0 END) as valorTotalVendas,
          SUM(CASE WHEN tipo_negociacao = 'aluguel' THEN preco ELSE 0 END) as valorTotalAlugueis
        FROM imoveis`;

      const ERROR_MESSAGE = "Falha ao recuperar dados de imóveis para relatório";

      const queryResponse = await this.#executeQuery(QUERY_IMOVEIS, ERROR_MESSAGE);

      const resultado = queryResponse[0] || {};

      return {
        imoveis: {
          totalImoveis: parseInt(resultado.totalImoveis) || 0,
          totalVendas: parseInt(resultado.totalVendas) || 0,
          totalAlugueis: parseInt(resultado.totalAlugueis) || 0,
          disponiveis: parseInt(resultado.disponiveis) || 0,
          vendidos: parseInt(resultado.vendidos) || 0,
          locados: parseInt(resultado.locados) || 0,
          indisponiveis: parseInt(resultado.indisponiveis) || 0,
          totalCasas: parseInt(resultado.totalCasas) || 0,
          totalTerrenos: parseInt(resultado.totalTerrenos) || 0,
          precoMedio: parseFloat(resultado.precoMedio) || 0,
          valorTotalVendas: parseFloat(resultado.valorTotalVendas) || 0,
          valorTotalAlugueis: parseFloat(resultado.valorTotalAlugueis) || 0,
          pdfNome: "Relatório de Imóveis"
        }
      }
    } catch (error) {
      console.error("Erro ao obter dados de imóveis:", error);
      throw new Error("Falha ao recuperar dados de imóveis para relatório");
    }
  }

  async obterDadosUsuarios() {
    const totalUsuariosQuery = `
      SELECT COUNT(*) as total FROM usuario WHERE ativo = 1
    `;

    const administradoresQuery = `
      SELECT COUNT(*) as total FROM usuario 
      WHERE nivel = 0 AND ativo = 1
    `;

    const visitantesQuery = `
      SELECT COUNT(*) as total FROM usuario 
      WHERE nivel = 1 AND ativo = 1
    `;

    const [totalResult, adminResult, visitantesResult] = await Promise.all([
      sequelize.query(totalUsuariosQuery, {
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(administradoresQuery, {
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(visitantesQuery, { type: sequelize.QueryTypes.SELECT }),
    ]);

    return {
      usuarios: {
        totalUsuarios: totalResult[0]?.total || 0,
        totalAdministradores: adminResult[0]?.total || 0,
        totalVisitantes: visitantesResult[0]?.total || 0,
        pdfNome: "Relatório de Usuários"
      },
    };
  }

  async obterDadosVendas() {
    try {
      // Query para obter dados consolidados de vendas
      const QUERY_VENDAS = `
        SELECT 
          COUNT(*) as totalVendas,
          COUNT(CASE WHEN status = 'vendido' THEN 1 END) as imoveisVendidos,
          SUM(CASE WHEN status = 'vendido' THEN preco ELSE 0 END) as valorTotalVendas,
          AVG(CASE WHEN status = 'vendido' THEN preco ELSE NULL END) as ticketMedio,
          COUNT(CASE WHEN tipo = 'casa' AND status = 'vendido' THEN 1 END) as casasVendidas,
          COUNT(CASE WHEN tipo = 'terreno' AND status = 'vendido' THEN 1 END) as terrenosVendidos,
          COUNT(CASE WHEN tipo_negociacao = 'venda' AND status = 'disponivel' THEN 1 END) as disponiveisParaVenda
        FROM imoveis 
        WHERE tipo_negociacao = 'venda'`;

      const ERROR_MESSAGE = "Falha ao recuperar dados de vendas para relatório";

      const vendaResult = await this.#executeQuery(QUERY_VENDAS, ERROR_MESSAGE);

      const resultado = vendaResult[0] || {};

      return {
        vendas: {
          totalVendas: parseInt(resultado.totalVendas) || 0,
          imoveisVendidos: parseInt(resultado.imoveisVendidos) || 0,
          valorTotalVendas: parseFloat(resultado.valorTotalVendas) || 0,
          ticketMedio: parseFloat(resultado.ticketMedio) || 0,
          casasVendidas: parseInt(resultado.casasVendidas) || 0,
          terrenosVendidos: parseInt(resultado.terrenosVendidos) || 0,
          disponiveisParaVenda: parseInt(resultado.disponiveisParaVenda) || 0,
          pdfNome: "Relatório de Vendas"
        }
      };
    } catch (error) {
      console.error("Erro ao obter dados de vendas:", error);
      throw new Error("Falha ao recuperar dados de vendas para relatório");
    }
  }

  async obterDadosAlugueis() {
    try {
      // Query para obter dados consolidados de alugueis/locações
      const QUERY_LOCACOES = `
        SELECT 
          COUNT(*) as totalAlugueis,
          COUNT(CASE WHEN status = 'locado' THEN 1 END) as imoveisLocados,
          SUM(CASE WHEN status = 'locado' THEN preco ELSE 0 END) as valorTotalLocacoes,
          AVG(CASE WHEN status = 'locado' THEN preco ELSE NULL END) as valorMedioAluguel,
          COUNT(CASE WHEN tipo = 'casa' AND status = 'locado' THEN 1 END) as casasLocadas,
          COUNT(CASE WHEN tipo = 'terreno' AND status = 'locado' THEN 1 END) as terrenosLocados,
          COUNT(CASE WHEN tipo_negociacao = 'aluguel' AND status = 'disponivel' THEN 1 END) as disponiveisParaAluguel
        FROM imoveis 
        WHERE tipo_negociacao = 'aluguel'`;

      const ERROR_MESSAGE = "Falha ao recuperar dados de locações para relatório";

      const queryResponse = await this.#executeQuery(QUERY_LOCACOES, ERROR_MESSAGE);

      const resultado = queryResponse[0] || {};

      return {
        alugueis: {
          totalAlugueis: parseInt(resultado.totalAlugueis) || 0,
          imoveisLocados: parseInt(resultado.imoveisLocados) || 0,
          valorTotalLocacoes: parseFloat(resultado.valorTotalLocacoes) || 0,
          valorMedioAluguel: parseFloat(resultado.valorMedioAluguel) || 0,
          casasLocadas: parseInt(resultado.casasLocadas) || 0,
          terrenosLocados: parseInt(resultado.terrenosLocados) || 0,
          disponiveisParaAluguel: parseInt(resultado.disponiveisParaAluguel) || 0,
          pdfNome: "Relatório de Locações"
        }
      };
    } catch (error) {
      console.error("Erro ao obter dados de alugueis:", error);
      throw new Error("Falha ao recuperar dados de locações para relatório");
    }
  }
}

export default new ReportService();
