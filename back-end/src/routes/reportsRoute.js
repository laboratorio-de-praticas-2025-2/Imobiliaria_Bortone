import express from 'express'
import ReportController from '../controllers/reportsController.js';
const relatorioRouter = express.Router();

// /relatorio?tipo=geral
relatorioRouter.get("/relatorio", ReportController.gerarPDF); 

export default relatorioRouter;
