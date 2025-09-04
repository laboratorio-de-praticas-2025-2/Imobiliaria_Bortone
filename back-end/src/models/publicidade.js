export default (sequelize, DataTypes) => {
  const Publicidade = sequelize.define('Publicidade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    url_imagem: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // torna o campo obrigatório
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    tableName: 'publicidade',
    timestamps: false
  });

  // Relacionamentos
  Publicidade.associate = (models) => {
    Publicidade.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return Publicidade;
};