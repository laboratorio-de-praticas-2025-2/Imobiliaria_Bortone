import sequelize from "../config/sequelize-config.js";
import fs from "fs";

class ReportService {
  async buscarDadosParaRelatorio(tipo) {
    //TODO: IMPLEMENTAR CONDICIONAL PARA VARIA TIPO DE DADO BUSCADO NO TIPO COM BASE NO PARAMETRO "tipo"

    const QUERY = `SELECT * FROM dadosRelatorioGeral;`

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
