import sequelize from "../config/sequelize-config.js";
import fs from "fs";

class ReportService {
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
      this.obterDadosAlugueis()
    ]);

    return {
      imoveis,
      usuarios,
      vendas,
      alugueis
    };
  }

  async obterDadosImoveis() {
    const totalImoveisQuery = `
      SELECT COUNT(*) as total FROM imoveis WHERE status = 'disponivel'
    `;
    
    const casasQuery = `
      SELECT COUNT(*) as total FROM imoveis 
      WHERE tipo IN ('casa', 'Casa') AND status = 'disponivel'
    `;
    
    const terrenosQuery = `
      SELECT COUNT(*) as total FROM imoveis 
      WHERE tipo IN ('terreno', 'Terreno') AND status = 'disponivel'
    `;

    const [totalResult, casasResult, terrenosResult] = await Promise.all([
      sequelize.query(totalImoveisQuery, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(casasQuery, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(terrenosQuery, { type: sequelize.QueryTypes.SELECT })
    ]);

    return {
      totalImoveis: totalResult[0]?.total || 0,
      totalCasas: casasResult[0]?.total || 0,
      totalTerrenos: terrenosResult[0]?.total || 0
    };
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
      sequelize.query(totalUsuariosQuery, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(administradoresQuery, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(visitantesQuery, { type: sequelize.QueryTypes.SELECT })
    ]);

    return {
      totalUsuarios: totalResult[0]?.total || 0,
      totalAdministradores: adminResult[0]?.total || 0,
      totalVisitantes: visitantesResult[0]?.total || 0
    };
  }

  async obterDadosVendas() {
    const vendaQuery = `
      SELECT COUNT(*) as total FROM imoveis 
      WHERE tipo_negociacao = 'venda' AND status = 'disponivel'
    `;

    const [vendaResult] = await sequelize.query(vendaQuery, { 
      type: sequelize.QueryTypes.SELECT 
    });
    
    return {
      totalVenda: vendaResult?.total || 0
    };
  }

  async obterDadosAlugueis() {
    const aluguelQuery = `
      SELECT COUNT(*) as total FROM imoveis 
      WHERE tipo_negociacao = 'aluguel' AND status = 'disponivel'
    `;

    const [aluguelResult] = await sequelize.query(aluguelQuery, { 
      type: sequelize.QueryTypes.SELECT 
    });
    
    return {
      totalLocacao: aluguelResult?.total || 0
    };
  }
}

export default new ReportService();
