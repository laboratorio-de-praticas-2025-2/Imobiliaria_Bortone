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
    };
  }

  async obterDadosImoveis() {
    // Dados mockados para imóveis - correspondendo ao PDF
    return {
      imoveis: {
        total: 85,
        porTipo: {
          apartamentos: 31,
          casas: 34,
          terrenos: 20
        },
        porNegociacao: {
          venda: 50,
          aluguel: 35
        },
        porStatus: {
          disponivel: 85,
          vendido: 0,
          locado: 0
        },
        porFaixaDePreco: {
          ate300k: 51,
          entre300kE600k: 32,
          maiorQue600k: 2
        },
        valorMedio: 350000,
        areaMedia: 120
      }
    }
  }

  async obterDadosUsuarios() {
    // Dados mockados para usuários
    return {
      usuarios: {
        totalUsuarios: 45,
        totalAdministradores: 3,
        totalVisitantes: 42,
        novosUsuariosMes: 8,
        usuariosAtivos: 38
      }
    };
  }

  async obterDadosVendas() {
    // Dados mockados para vendas
    return {
      vendas: {
        totalVendas: 25,
        valorTotalVendas: 8750000,
        valorMedioVenda: 350000,
        vendasPorMes: [
          { mes: "2024-01", Casa: 1, Apartamento: 2, Terreno: 0 },
          { mes: "2024-02", Casa: 2, Apartamento: 2, Terreno: 1 },
          { mes: "2024-03", Casa: 1, Apartamento: 2, Terreno: 1 },
          { mes: "2024-04", Casa: 3, Apartamento: 2, Terreno: 1 },
          { mes: "2024-05", Casa: 1, Apartamento: 2, Terreno: 0 },
          { mes: "2024-06", Casa: 2, Apartamento: 2, Terreno: 0 }
        ],
        vendasPorTipo: {
          apartamentos: 12,
          casas: 10,
          terrenos: 3
        }
      }
    };
  }

  async obterDadosAlugueis() {
    // Dados mockados para aluguéis
    return {
      alugueis: {
        totalLocacoes: 18,
        valorTotalLocacoes: 54000,
        valorMedioLocacao: 3000,
        locacoesPorMes: [
          { mes: "2024-01", Casa: 1, Apartamento: 1, Terreno: 0 },
          { mes: "2024-02", Casa: 2, Apartamento: 2, Terreno: 0 },
          { mes: "2024-03", Casa: 1, Apartamento: 2, Terreno: 0 },
          { mes: "2024-04", Casa: 1, Apartamento: 2, Terreno: 0 },
          { mes: "2024-05", Casa: 1, Apartamento: 1, Terreno: 0 },
          { mes: "2024-06", Casa: 2, Apartamento: 2, Terreno: 0 }
        ],
        locacoesPorTipo: {
          apartamentos: 12,
          casas: 6
        },
        taxaOcupacao: 85.5
      }
    };
  }
}

export default new ReportService();
