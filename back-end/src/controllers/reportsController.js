import ReportService from "../services/reportsService.js";

class ReportController {
  async gerarDadosParaRelatorio(req, res) {
    try {
      const tipo = req.query.tipo || "geral";

      console.log(`📋 Solicitando relatório do tipo: ${tipo}`);

      // Validar tipo de relatório
      const tiposValidos = ['geral', 'imoveis', 'vendas', 'alugueis', 'locacoes', 'usuarios'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ 
          error: "Tipo de relatório inválido",
          tiposValidos: tiposValidos 
        });
      }

      const dadosRelatorio = await ReportService.buscarDadosParaRelatorio(tipo);

      console.log(`✅ Relatório ${tipo} gerado com sucesso`);

      // Garantir que sempre retornamos um objeto com pdfNome
      if (!dadosRelatorio.pdfNome) {
        dadosRelatorio.pdfNome = `Relatório ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
      }

      res.status(200).json(dadosRelatorio);
    } catch (error) {
      console.error(`❌ Erro ao buscar dados para relatório ${req.query.tipo || 'geral'}:`, {
        message: error.message,
        stack: error.stack
      });
      
      res.status(500).json({ 
        error: "Erro interno do servidor ao gerar relatório",
        message: error.message,
        pdfNome: `Relatório ${req.query.tipo || 'Geral'} - Erro`
      });
    }
  }
}

export default new ReportController();
