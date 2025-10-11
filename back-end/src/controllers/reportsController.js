import ReportService from "../services/reportsService.js";

class ReportController {
  async gerarDadosParaRelatorio(req, res) {
    try {
      const tipo = req.query.tipo || "geral";

      const dadosRelatorio = await ReportService.buscarDadosParaRelatorio(tipo);

      res.json(dadosRelatorio);
    } catch (error) {
      console.error("Erro ao buscar dados para relatório:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar dados para relatório PDF" });
    }
  }

  async listarTiposRelatorios(req, res) {
    try {
      const tiposRelatorios = [
        {
          nome: "Relatório Geral",
          tipo: "geral",
          pdfNome: "Relatorio-Geral"
        },
        {
          nome: "Relatório de Imóveis",
          tipo: "imoveis", 
          pdfNome: "Relatorio-Imoveis"
        },
        {
          nome: "Relatório de Vendas",
          tipo: "vendas",
          pdfNome: "Relatorio-Vendas"
        },
        {
          nome: "Relatório de Aluguéis",
          tipo: "alugueis",
          pdfNome: "Relatorio-Alugueis"
        },
        {
          nome: "Relatório de Usuários",
          tipo: "usuarios",
          pdfNome: "Relatorio-Usuarios"
        }
      ];

      res.json(tiposRelatorios);
    } catch (error) {
      console.error("Erro ao listar tipos de relatórios:", error);
      res
        .status(500)
        .json({ error: "Erro ao listar tipos de relatórios" });
    }
  }
}

export default new ReportController();
