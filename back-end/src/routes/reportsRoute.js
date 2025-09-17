import express from 'express'
import ReportController from '../controllers/reportsController.js';
const relatorioRouter = express.Router();

// /relatorio?tipo=geral
relatorioRouter.get("/relatorio", ReportController.gerarPDF); 
//relatorioRouter.get("/relatorio/:tipo/preview",ReportController.previewPDF)

export default relatorioRouter;
