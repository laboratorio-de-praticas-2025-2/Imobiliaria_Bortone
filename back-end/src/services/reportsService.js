import Imovel from "../models/Imovel.js";
import puppeteer from "puppeteer"; //IMPORTA PUPPETEER PARA CRIACAO DO PDF
import sequelize from "../config/sequelize-config.js";
import imagemParaBase64 from "../utils/converterImagemParaBase64.js";
import fs from "fs";
import handlebars from "handlebars";

class ReportService {
  static async buscarDados(filtros = {}) {
    const query = fs.readFileSync("./src/queries/dados-pdf-geral.sql", "utf-8");

    const resultados = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: filtros,
      logging: false,
    });    

    return resultados;
  }

  // GERA PDF
  static async gerarPDF(filtros = {}) {
    handlebars.registerHelper("json", function (context) {
      return JSON.stringify(context);
    });
    //Informações extra para geração do PDF    
    const formattedDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const dados = await this.buscarDados(filtros);
    const resultado = JSON.parse(dados[0].resultado);

    const templateHtml = fs.readFileSync(
      "./src/templates/report-template-pdf.html",
      "utf8"
    );

    const template = handlebars.compile(templateHtml);

    // Preenche template com dados
    const html = template({
      dados: dados,   
      data_emissao: formattedDate,
    });

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();
    return pdf;
  }
}

export default ReportService;
