import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const Agendamento = connection.define(
  "agendamento",
  {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    data_marcada: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    data_create: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    id_imovel: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    },
    mensagem: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    concluido: {
      type: Sequelize.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "agendamentos",
    timestamps: false,
  }
);

export default Agendamento;
