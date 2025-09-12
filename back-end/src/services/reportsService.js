import Imovel from "../models/Imovel.js";
import puppeteer from "puppeteer"; //IMPORTA PUPPETEER PARA CRIACAO DO PDF

class ReportService {
  
  static async buscarDados(filtros={}) {
    return await Imovel.findAll({ where: filtros });
  }

  // ESTRUTURA O HTML
  static async gerarHTML(dados) {
    const rows = dados.map(i => `
      <tr>
        <td>${i.titulo}</td>
        <td>R$ ${i.preco.toFixed(2)}</td>
        <td>${i.vendido ? "Sim" : "Não"}</td>
      </tr>
    `).join("");

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2E86C1; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Relatório de Imóveis</h1>
          <table>
            <tr><th>Título</th><th>Preço</th><th>Vendido</th></tr>
            ${rows}
          </table>
        </body>
      </html>
    `;
  }

  // GERA PDF 
  static async gerarPDF(filtros = {}) {
    const dados = await this.buscarDados(filtros);
    const html = await this.gerarHTML(dados);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
    });

    await browser.close();
    return pdf;
  }
}

export default ReportService;
