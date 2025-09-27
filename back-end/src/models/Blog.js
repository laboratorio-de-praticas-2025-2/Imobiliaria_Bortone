import connection from "../config/sequelize-config.js";
import { DataTypes } from "sequelize";
import Usuario from "./Usuario.js"; 

const Blog = connection.define(
  "blog",
  {
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    conteudo: { type: DataTypes.TEXT, allowNull: false },
    data_publicacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    url_imagem: { type: DataTypes.STRING(255) },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Usuario, key: "id" }},
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Blog;
