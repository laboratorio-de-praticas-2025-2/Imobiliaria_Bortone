import ReportService from "../services/reportsService.js";

class ReportController {
  static async gerarPDF(req, res) {
    try {
      const filtros = req.query || req.body; // flexível: query string ou body
      const pdfBuffer = await ReportService.gerarPDF(filtros);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({ error: "Erro ao gerar relatório PDF" });
    }
  }
}

export default ReportController;
