import express from 'express'
import ReportController from '../controllers/reportsController.js';
const relatorioRouter = express.Router();

// /relatorio?tipo=geral
relatorioRouter.get("/", ReportController.gerarDadosParaRelatorio); 

// /relatorios - lista os tipos de relatórios disponíveis
relatorioRouter.get("/s", ReportController.listarTiposRelatorios);

export default relatorioRouter;
