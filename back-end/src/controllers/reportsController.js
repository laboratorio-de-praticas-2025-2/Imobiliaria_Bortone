import ReportService from "../services/reportsService.js";
import { REPORTS_SECOES } from "../utils/constantes.js";

class ReportController {
  async gerarDadosParaRelatorio(req, res) {
    try {
      const now = new Date();
      const dataFimParam =
        req.query.data_fim || now.toISOString().split("T")[0];
      const dataFimAjustada = ajustaDataFimParaUltimoDiaMes(dataFimParam);
      const dataInicio =
        req.query.data_inicio ||
        new Date(now.getFullYear(), now.getMonth() - 3, 1)
          .toISOString()
          .split("T")[0];

      const secoesParam =
        req.query.secoes ||
        [
          REPORTS_SECOES.SUMARIO_EXECUTIVO,
          REPORTS_SECOES.JORNADA_CLIENTE,
          REPORTS_SECOES.ANALISE_ESTOQUE,
          REPORTS_SECOES.DESEMPENHO_VENDAS,
          REPORTS_SECOES.DESEMPENHO_LOCACOES,
        ].join(",");
      const secoesValues = secoesParam.split(",");

      res.json(dadosRelatorio);
    } catch (error) {
      console.error("Erro ao buscar dados para relatório:", error);
      res.status(500).json({ error: "Erro ao buscar dados para relatório" });
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

function ajustaDataFimParaUltimoDiaMes(dataFim) {
  const data = new Date(dataFim);
  return new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59, 999)
    .toISOString()
    .slice(0, 10);
}

export default new ReportController();
