import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize-config.js";

const PublicidadeModel = sequelize.define(
  "Publicidade",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url_imagem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "publicidade",
    timestamps: false,
  }
);


export default PublicidadeModel;