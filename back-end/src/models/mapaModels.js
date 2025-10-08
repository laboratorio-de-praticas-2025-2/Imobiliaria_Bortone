// src/models/mapaModels.js

import { DataTypes } from 'sequelize';
import connection from '../config/sequelize-config.js';

// ---------------------------
// Model Usuario
// ---------------------------
const Usuario = connection.define('usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: true },
  email: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  senha: { type: DataTypes.STRING(255), allowNull: true },
  nivel: { type: DataTypes.ENUM('visitante', 'administrador'), allowNull: true },
  celular: { type: DataTypes.STRING(20), allowNull: true }
}, {
  tableName: 'usuario',
  timestamps: false
});

// ---------------------------
// Model Imovel
// ---------------------------
const Imovel = connection.define('imoveis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.STRING(50), allowNull: true },
  endereco: { type: DataTypes.STRING(255), allowNull: true },
  cidade: { type: DataTypes.STRING(100), allowNull: true },
  estado: { type: DataTypes.STRING(2), allowNull: true },
  preco: { type: DataTypes.DECIMAL(12,2), allowNull: true },
  status: { type: DataTypes.STRING(20), allowNull: true },
  area: { type: DataTypes.INTEGER, allowNull: true },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  data_cadastro: { type: DataTypes.DATEONLY, allowNull: true },
  murado: { type: DataTypes.BOOLEAN, allowNull: true },
  latitude: { type: DataTypes.DECIMAL(10,7), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(10,7), allowNull: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: true },
  tipo_negociacao: { type: DataTypes.ENUM('venda','aluguel'), allowNull: false, defaultValue: 'venda' }
}, {
  tableName: 'imoveis',
  timestamps: false
});

// ---------------------------
// Model Casa
// ---------------------------
const Casa = connection.define('casa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  imovel_id: { type: DataTypes.INTEGER, allowNull: true },
  quartos: { type: DataTypes.INTEGER, allowNull: true },
  banheiros: { type: DataTypes.INTEGER, allowNull: true },
  vagas: { type: DataTypes.INTEGER, allowNull: true },
  possui_piscina: { type: DataTypes.BOOLEAN, allowNull: true },
  possui_jardim: { type: DataTypes.BOOLEAN, allowNull: true }
}, {
  tableName: 'casa',
  timestamps: false
});

// ---------------------------
// Model ImagemImovel
// ---------------------------
const ImagemImovel = connection.define('imagem_imovel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  imovel_id: { type: DataTypes.INTEGER, allowNull: true },
  url_imagem: { type: DataTypes.STRING(255), allowNull: true },
  descricao: { type: DataTypes.STRING(255), allowNull: true }
}, {
  tableName: 'imagem_imovel',
  timestamps: false
});

// ---------------------------
// Associações
// ---------------------------
Usuario.hasMany(Imovel, { foreignKey: 'usuario_id' });
Imovel.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Imovel.hasMany(ImagemImovel, { foreignKey: 'imovel_id' });
ImagemImovel.belongsTo(Imovel, { foreignKey: 'imovel_id' });

Imovel.hasOne(Casa, { foreignKey: 'imovel_id' });
Casa.belongsTo(Imovel, { foreignKey: 'imovel_id' });

// ---------------------------
// Exportando todos os models
// ---------------------------
export {
  Usuario,
  Imovel,
  Casa,
  ImagemImovel
};
