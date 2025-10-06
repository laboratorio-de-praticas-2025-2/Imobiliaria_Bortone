import express from 'express'
import ReportController from '../controllers/reportsController.js';
const relatorioRouter = express.Router();

/**
 * GET /relatorio
 * Query Params:
 *  - secoes: SUMARIO_EXECUTIVO,JORNADA_CLIENTE,ESTOQUE_IMOBILIARIO,DESEMPENHO_VENDAS,DESEMPENHO_LOCACOES
 *  - data_inicio: formato YYYY-MM-DD
 *  - data_fim: formato YYYY-MM-DD
 */
relatorioRouter.get("/", ReportController.gerarDadosParaRelatorio); 

// /relatorios - lista os tipos de relatórios disponíveis
relatorioRouter.get("/s", ReportController.listarTiposRelatorios);

export default relatorioRouter;
