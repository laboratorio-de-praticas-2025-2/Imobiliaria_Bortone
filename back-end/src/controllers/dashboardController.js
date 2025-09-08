import dashboardService from "../services/dashboardService.js";
class dashboardController {
  // usado pela rota /dashboard 
  async findInfoImoveis(req, res, next) {
    try {
      const response = await dashboardService.estatisticasImoveisUsuarios();
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  }
}

export default new dashboardController();