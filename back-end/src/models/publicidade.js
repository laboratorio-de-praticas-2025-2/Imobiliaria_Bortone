import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize-config.js";

// const PublicidadeModel = ...
const Publicidade = sequelize.define(
  "Publicidade",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false, // obrigatório para criar
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false, // obrigatório para criar
    },
    url_imagem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: "usuario", //nome exato da tabela no banco
        key: "id",
      },
    },
    // Adicionar aqui o atributo "ativo" do tipo boolean
  },
  {
    tableName: "publicidade",
    timestamps: false,
  }
);

// export default PublicidadeModel;
export default Publicidade;