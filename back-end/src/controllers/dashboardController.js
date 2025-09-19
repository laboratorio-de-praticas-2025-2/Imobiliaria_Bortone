import DashboardService from "../services/dashboardService.js";
class DashboardController {
  // usado pela rota /dashboard 
  async findInfosDashboard(req, res, next) {
    try {
      const response = await DashboardService.dashboardData();
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  }
}

export default new DashboardController();