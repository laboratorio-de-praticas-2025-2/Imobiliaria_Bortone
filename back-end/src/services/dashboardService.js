import sequelize from "../config/sequelize-config.js";

class dashService {
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
    const [results] = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      logging: false
    });

    return results;
  }

}

export default new dashService();
