import Imovel from "../models/Imovel.js";
import puppeteer from "puppeteer";
import sequelize from "../config/sequelize-config.js";
import imagemParaBase64 from "../utils/converterImagemParaBase64.js";
import fs from "fs";
import handlebars from "handlebars";

class ReportService {
  static async buscarDados(tipo) {
    //TODO: IMPLEMENTAR CONDICIONAL PARA VARIA TIPO DE DADO BUSCADO NO TIPO COM BASE NO PARAMETRO "tipo"

    const query = fs.readFileSync("./src/queries/dados-pdf-geral.sql", "utf-8");

    const resultados = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      logging: false,
    });

    return resultados;
  }

  // GERA PDF
  static async gerarPDF(tipo) {
    handlebars.registerHelper("json", function (context) {
      return JSON.stringify(context);
    });
    //Informações extra para geração do PDF
    const logoBase64 = imagemParaBase64("./src/static/imgs/LogoPreta.png");
    const icon_house = imagemParaBase64("./src/static/imgs/icon_house.png");
    const icon_build = imagemParaBase64("./src/static/imgs/icon_build.png");
    const icon_calendar = imagemParaBase64("./src/static/imgs/icon_calendar.png");
    const icon_metroq = imagemParaBase64("./src/static/imgs/icon_metroq.png");
    const icon_bed = imagemParaBase64("./src/static/imgs/icon_bed.png");
    const icon_coin = imagemParaBase64("./src/static/imgs/icon_coin.png");
    const icon_admin = imagemParaBase64("./src/static/imgs/icon_admin.png");
    const icon_add_person = imagemParaBase64("./src/static/imgs/icon_add_person.png");
    const icon_person = imagemParaBase64("./src/static/imgs/icon_person.png");
    const formattedDate = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const dados = await this.buscarDados(tipo);
    const resultado = JSON.parse(dados[0].resultado);
    const templateHtml = fs.readFileSync("./src/templates/report-template-pdf.html", "utf8");

    const template = handlebars.compile(templateHtml);

    // Preenche template com dados
    const html = template({
      dados: resultado,
      images: {
        logo: logoBase64,
        icon_house: icon_house,
        icon_build: icon_build,
        icon_calendar: icon_calendar,
        icon_metroq: icon_metroq,
        icon_bed: icon_bed,
        icon_coin: icon_coin,
        icon_admin: icon_admin,
        icon_add_person: icon_add_person,
        icon_person: icon_person,
      },
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
