import sequelize from "../config/sequelize-config.js";
import fs from "fs";

class ReportService {
  async buscarDadosParaRelatorio(tipo) {
    //TODO: IMPLEMENTAR CONDICIONAL PARA VARIA TIPO DE DADO BUSCADO NO TIPO COM BASE NO PARAMETRO "tipo"

    const query = fs.readFileSync("./src/queries/dados-pdf-geral.sql", "utf-8");

    const dadosRelatorio = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      logging: false,
    });

    return dadosRelatorio;
  }
}

export default new ReportService();
