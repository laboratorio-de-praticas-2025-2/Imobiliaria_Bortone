import ReportService from "../services/reportsService.js";

class ReportController {
  static async gerarPDF(req, res) {
    try {
      const tipo = req.query.tipo || "geral";

      const pdfBuffer = await ReportService.gerarPDF(tipo);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=relatorio.pdf");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({ error: "Erro ao gerar relatório PDF" });
    }
  }
}

export default ReportController;
