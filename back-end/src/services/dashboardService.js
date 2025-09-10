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
    const query = `SELECT 
        im.totalApartamentos,
        im.totalCasas,
        im.totalTerrenos,
        im.totalVenda,
        im.totalLocacao,
        im.totalImoveis,
        us.totalAdministradores,
        us.totalVisitantes,
        us.totalUsuarios
    FROM (
        SELECT  
          SUM(CASE WHEN i.tipo = 'Apartamento' THEN 1 ELSE 0 END) AS totalApartamentos,
          SUM(CASE WHEN i.tipo = 'Casa' THEN 1 ELSE 0 END) AS totalCasas,
          SUM(CASE WHEN i.tipo = 'Terreno' THEN 1 ELSE 0 END) AS totalTerrenos,
          SUM(CASE WHEN i.tipo_negociacao = 1 THEN 1 ELSE 0 END) AS totalVenda,
          SUM(CASE WHEN i.tipo_negociacao = 2 THEN 1 ELSE 0 END) AS totalLocacao,
          COUNT(1) as totalImoveis   
        FROM imoveis i
        WHERE i.status = 1
    ) im
    CROSS JOIN (
        SELECT  
          SUM(CASE WHEN f.nivel = 0 THEN 1 ELSE 0 END) AS totalAdministradores,
          SUM(CASE WHEN f.nivel = 1 THEN 1 ELSE 0 END) AS totalVisitantes,
          COUNT(1) as totalUsuarios   
        FROM usuario f
    ) us;`;

    // executa a query no BD usando sequelize
    const errorMessage =
      "Falha ao recuperar estatísticas de imóveis e usuários";
    const results = await this.#executeQuery(query, errorMessage);
    return results[0];
  }
  // busca as estatisticas de vendas nos ultimos 30 dias e a sua %
  async estatisticasVendas() {
    const query = `SELECT 
    i.tipo AS tipoImovel,
    COUNT(*) AS quantidade,
    ROUND(100 * COUNT(*) / (SELECT COUNT(*) FROM imoveis WHERE status = 'vendido' 
    AND data_update_status >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)), 2) 
    AS porcentagem
      FROM imoveis i
      WHERE i.status = 'vendido' 
      AND i.data_update_status >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY i.tipo;`;

    const errorMessage = "Falha ao recuperar estatísticas de vendas";

    return await this.#executeQuery(query, errorMessage);
  }
  async alugueisPorMes() {
    const query = `SELECT 
        m.mes,
        t.tipo AS tipoImovel,
        COALESCE(COUNT(i.id), 0) AS total
    FROM (
        -- gera os últimos 12 meses
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m') AS mes
        FROM (
            SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
            UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
        ) AS seqs
    ) m
    CROSS JOIN (
        SELECT 'Apartamento' AS tipo
        UNION ALL SELECT 'Casa'
        UNION ALL SELECT 'Terreno'
    ) t
    LEFT JOIN imoveis i
        ON i.tipo = t.tipo
        AND i.status = 'locado'
        AND DATE_FORMAT(i.data_update_status, '%Y-%m') = m.mes
    GROUP BY m.mes, t.tipo
    ORDER BY m.mes ASC, t.tipo;`;

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
