import ReportService from "../services/reportsService.js";

class ReportController {
  async gerarDadosParaRelatorio(req, res) {
    try {
      const tipo = req.query.tipo || "geral";

      const dadosRelatorio = await ReportService.buscarDadosParaRelatorio(tipo);

      res.send(dadosRelatorio);
    } catch (error) {
      console.error("Erro ao buscar dados para relatório:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar dados para relatório PDF" });
    }
  }
}

export default new ReportController();
