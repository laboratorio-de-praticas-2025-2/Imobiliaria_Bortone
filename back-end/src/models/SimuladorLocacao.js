// src/models/mapaModels.js
const { DataTypes } = require('sequelize');
const connection = require('../config/sequelize-config.js');

// ---------------------------
// Model Imovel
// ---------------------------
const SimImovel = connection.define('SimuladorImoveis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.ENUM('casa', 'apartamento'), allowNull: false },
  preco: { type: DataTypes.DECIMAL(12,2), allowNull: false }
}, {
  tableName: 'SimuladorImoveis',
  timestamps: false
});

// ---------------------------
// Model Financiamento
// ---------------------------
const Financiamento = connection.define('financiamento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  imovel_id: { type: DataTypes.INTEGER, allowNull: false },
  valorEntrada: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  valorParcela: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  quantidadeParcelas: { type: DataTypes.INTEGER, allowNull: false },
  taxaJuros: { type: DataTypes.DECIMAL(5,2), allowNull: false }
}, {
  tableName: 'financiamento',
  timestamps: false
});

// ---------------------------
// Associações
// ---------------------------
SimImovel.hasOne(Financiamento, { foreignKey: 'imovel_id' });
Financiamento.belongsTo(SimImovel, { foreignKey: 'imovel_id' });

// ---------------------------
// Exportando todos os models
// ---------------------------
module.exports = {
  SimImovel,
  Financiamento,
};