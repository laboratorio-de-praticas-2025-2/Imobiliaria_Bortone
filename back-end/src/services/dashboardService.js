import sequelize from "../config/sequelize-config.js";

class DashboardService {
  async #executeQuery(query, errorMessage) {
    try {
      return await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        logging: false,
      });
    } catch (dbError) {
      console.error(`${errorMessage}:`, {
        message: dbError.message,
        query: query.substring(0, 200) + "...", // Log parcial da query
        stack: dbError.stack,
      });

      throw new Error(errorMessage);
    }
  }

  // busca as estatisticas gerais dos imoveis (quantidade vendidos, disponiveis, alugados etc.) e de usuarios
  async estatisticasImoveisUsuarios() {
    const query = `SELECT * FROM estatisticasImoveisUsuarios;`;

    // executa a query no BD usando sequelize
    const errorMessage =
      "Falha ao recuperar estatísticas de imóveis e usuários";
    const results = await this.#executeQuery(query, errorMessage);
    return results[0];
  }
  // busca as estatisticas de vendas nos ultimos 30 dias e a sua %
  async estatisticasVendas() {
    const query = `SELECT * FROM estatisticasVendas;`;

    const errorMessage = "Falha ao recuperar estatísticas de vendas";

    return await this.#executeQuery(query, errorMessage);
  }
  async alugueisPorMes() {
    const query = `SELECT * from alugueisPorMes;`;

    const errorMessage = "Falha ao recuperar estatísticas de aluguéis";

    const results = await this.#executeQuery(query, errorMessage);

    // agrupa os resultados por mes
    try {
      const mesesAgrupados = results.reduce((acc, row) => {
        acc[row.mes] = acc[row.mes] || {
          mes: row.mes,
          Apartamento: 0,
          Casa: 0,
          Terreno: 0,
        };
        acc[row.mes][row.tipoImovel] = Number(row.total);
        return acc;
      }, {});

      return Object.values(mesesAgrupados);
    } catch (processingError) {
      console.error("Erro no processamento de aluguéis:", processingError);
      throw new Error("Falha no processamento dos dados de aluguéis");
    }
  }

  // processa os dados para melhor apresentacao no front end

  async dashboardData() {
    try {
      const [estatisticas, vendas, alugueis] = await Promise.all([
        this.estatisticasImoveisUsuarios(),
        this.estatisticasVendas(),
        this.alugueisPorMes(),
      ]);

      // faz com que todos os tipos aparecam, mesmo se estiverem com 0 vendas
      const tiposImoveis = ["Apartamento", "Casa", "Terreno"];
      const vendasRecentes = tiposImoveis.map((tipo) => {
        const registro = vendas.find((v) => v.tipoImovel === tipo);
        return {
          tipo: tipo,
          quantidade: registro ? Number(registro.quantidade) : 0,
          porcentagem: registro ? Number(registro.porcentagem) : 0,
        };
      });

      // estrutura os dados
      const processedData = {
        imoveis: {
          total: Number(estatisticas.totalImoveis),
          porTipo: {
            apartamentos: Number(estatisticas.totalApartamentos),
            casas: Number(estatisticas.totalCasas),
            terrenos: Number(estatisticas.totalTerrenos),
          },
          porNegociacao: {
            venda: Number(estatisticas.totalVenda),
            locacao: Number(estatisticas.totalLocacao),
          },
        },
        usuarios: {
          total: Number(estatisticas.totalUsuarios),
          administradores: Number(estatisticas.totalAdministradores),
          visitantes: Number(estatisticas.totalVisitantes),
        },
        vendasRecentes,
        alugueisPorMes: alugueis,
      };

      return processedData;
    } catch (error) {
      console.error("Erro crítico no dashboardData:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      throw new Error("Erro na composição dos dados do dashboard");
    }
  }
}

export default new DashboardService();
