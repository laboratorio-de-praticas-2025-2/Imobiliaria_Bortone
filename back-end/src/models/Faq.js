import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const Faq = connection.define("faq", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pergunta: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resposta: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  usuario_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // references: adicionar referencia para tabela usuario
  },
});

Faq.sync({ force: false });

export default Faq;
