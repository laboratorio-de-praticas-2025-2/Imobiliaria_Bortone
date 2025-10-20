import DashboardService from "../services/dashboardService.js";
class DashboardController {
  // usado pela rota /dashboard
  async findInfosDashboard(req, res) {
    try {
      const now = new Date();
      const dataFim = req.query.data_fim || now.toISOString().split("T")[0];
      const dataFimAjustada = ajustaDataFimParaUltimoDiaMes(dataFim);
      const dataInicio =
        req.query.data_inicio ||
        new Date(now.getFullYear(), now.getMonth() - 3, 1)
          .toISOString()
          .split("T")[0];
      const response = await DashboardService.dashboardData(
        dataInicio,
        dataFimAjustada
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  }
}

function ajustaDataFimParaUltimoDiaMes(dataFim) {
  const data = new Date(dataFim);
  return new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59, 999)
    .toISOString()
    .slice(0, 10);
}

export default new DashboardController();
