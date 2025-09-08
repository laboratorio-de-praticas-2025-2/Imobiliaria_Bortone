import sequelize from "../config/sequelize-config.js";

class DashboardSerivce {
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
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      logging: false,
    });

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

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      logging: false,
    });
    return results;
  }

  // processa os dados para melhor apresentacao no front end

 async dashboardData() {
  try {
    const estatisticas = await this.estatisticasImoveisUsuarios();
    const vendas = await this.estatisticasVendas();

    // faz com que todos os tipos aparecam, mesmo se estiverem com 0 vendas
    const tiposImoveis = ['Apartamento', 'Casa', 'Terreno'];
    const vendasRecentes = tiposImoveis.map(tipo => {
      const registro = vendas.find(v => v.tipoImovel === tipo);
      return {
        tipo: tipo,
        quantidade: registro ? Number(registro.quantidade) : 0,
        porcentagem: registro ? Number(registro.porcentagem) : 0
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
      vendasRecentes
    };

    return processedData;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao processar dados do dashboard");
  }
}

}

export default new DashboardSerivce();
