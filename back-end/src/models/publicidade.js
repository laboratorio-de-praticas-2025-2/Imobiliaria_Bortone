export default (sequelize, DataTypes) => {
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
          model: "usuario", // nome exato da tabela no banco
          key: "id",
        },
      },
    },
    {
      tableName: "publicidade",
      timestamps: false, // se quiser createdAt/updatedAt, mude para true
    }
  );

  // Relacionamento: cada publicidade pertence a um usuário
  Publicidade.associate = (models) => {
    Publicidade.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });
  };

  return Publicidade;
};
