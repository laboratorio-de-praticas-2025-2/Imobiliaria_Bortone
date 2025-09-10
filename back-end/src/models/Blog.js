import connection from "../config/sequelize-config.js";
import { DataTypes } from "sequelize";

const Blog = connection.define(
  "blog",
  {
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    conteudo: { type: DataTypes.TEXT }, // Adicionar allowNull: false
    data_publicacao: { type: DataTypes.DATE }, // Definir default como now
    url_imagem: { type: DataTypes.STRING(255) },
    usuario_id: { type: DataTypes.INTEGER }, // Adicionar a referencia ao model usuarios
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Blog;
