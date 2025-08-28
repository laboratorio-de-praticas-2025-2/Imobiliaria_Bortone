import connection from "../config/sequelize-config.js";
import { DataTypes } from "sequelize";

const Blog = connection.define(
  "blog",
  {
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    conteudo: { type: DataTypes.TEXT },
    data_publicacao: { type: DataTypes.DATE },
    url_imagem: { type: DataTypes.STRING(255) },
    usuario_id: { type: DataTypes.INTEGER },
  },
  {
    freezeTableName: true, // não pluraliza o nome
    timestamps: false, // <--- desativa createdAt/updatedAt
  }
);

export default Blog;