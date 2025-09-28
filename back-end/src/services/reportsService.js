import { error } from "console";
import sequelize from "../config/sequelize-config.js";
import fs from "fs";

class ReportService {
  async #executeQuery(query, errorMessage) {
    try {
      return await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        logging: true,
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
    const [imoveis, usuarios, vendas, alugueis] = await Promise.all([
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
    };
  }

  async obterDadosImoveis() {
    const QUERY_IMOVEIS = `select * from dadosRelatorioImoveis`;
    const ERROR_MESSAGE = "Falha ao recuperar dados de imóveis para relatório";

    const queryResponse = await this.#executeQuery(
      QUERY_IMOVEIS,
      ERROR_MESSAGE
    );
    
    return JSON.parse(queryResponse[0]?.imoveis || 0);
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
      totalUsuarios: totalResult[0]?.total || 0,
      totalAdministradores: adminResult[0]?.total || 0,
      totalVisitantes: visitantesResult[0]?.total || 0,
    };
  }

  async obterDadosVendas() {
    const QUERY_VENDAS = `select * from dadosRelatorioVendas`;
    const ERROR_MESSAGE = "Falha ao recuperar dados de vendas para relatório";

    const vendaResult = await this.#executeQuery(QUERY_VENDAS, ERROR_MESSAGE);
    console.log("aaaaaa");
    console.log(vendaResult[0]?.vendas);

    return JSON.parse(vendaResult[0]?.vendas || 0);
  }

  async obterDadosAlugueis() {
    const QUERY_LOCACOES = `select * from dadosRelatorioLocacoes`;
    const ERROR_MESSAGE = "Falha ao recuperar dados de locações para relatório";

    const queryResponse = await this.#executeQuery(QUERY_LOCACOES, ERROR_MESSAGE);

    return JSON.parse(queryResponse[0]?.alugueis || 0);
  }
}

export default new ReportService();
