import sequelize from "../config/sequelize-config.js";
import fs from "fs";

class ReportService {
  async buscarDadosParaRelatorio(tipo) {
    //TODO: IMPLEMENTAR CONDICIONAL PARA VARIA TIPO DE DADO BUSCADO NO TIPO COM BASE NO PARAMETRO "tipo"

    let QUERY;
    switch (tipo) {
      case "geral":
        QUERY = `SELECT * FROM dadosRelatorioGeral;`;
        break;
      case "imoveis":
        QUERY = `SELECT * FROM dadosRelatorioImoveis;`;
        break;
      case "vendas":
        QUERY = `SELECT * FROM dadosRelatorioVendas;`;
        break;
      case "alugueis":
        QUERY = `SELECT * FROM dadosRelatorioAlugueis;`;
        break;
      case "usuarios":
        QUERY = `SELECT * FROM dadosRelatorioUsuarios;`;
        break;
      default:
        throw new Error("Tipo de relatório inválido.");
    }

    const response = await sequelize.query(QUERY, {
      type: sequelize.QueryTypes.SELECT,
      logging: false,
    });

    if (response.length === 0) {
      throw new Error("Nenhum dado encontrado para o relatório.");
    }

    const dadosRelatorio = JSON.parse(response[0].resultado);

    return dadosRelatorio;
  }
}

export default new ReportService();
