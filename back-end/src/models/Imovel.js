import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const Imovel = connection.define(
  "imovel",
  {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    endereco: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    cidade: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    estado: {
      type: Sequelize.STRING(2),
      allowNull: false,
    },
    preco: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    area: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    data_cadastro: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    murado: {
      type: Sequelize.TINYINT(1),
      allowNull: true,
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: true,
    },
    usuario_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    },
    tipo_negociacao: {
      type: Sequelize.ENUM("aluguel", "venda"),
      allowNull: true,
      defaultValue: "venda",
    },
    status: {
      type: Sequelize.ENUM("disponivel", "indisponivel", "vendido", "locado"),
      allowNull: true,
      defaultValue: "disponivel",
    },
    data_update_status: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "imoveis",
    timestamps: false,
  }
);

export default Imovel;
