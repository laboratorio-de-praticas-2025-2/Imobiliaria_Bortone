import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const Imovel = connection.define("imoveis", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    endereco: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    cidade: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    estado: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    preco: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('disponivel','indisponivel','vendido','locado'),
        allowNull: false,
    },
    area: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    data_cadastro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    murado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    tipo_negociacao: {
        type: Sequelize.ENUM('venda','aluguel'),
        allowNull:false
    },
    latitude: {
        type: Sequelize.REAL,
        allowNull: false,
    },
    longitude: {
        type: Sequelize.REAL,
        allowNull: false,
    },
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    data_update_status: {
        type: Sequelize.DATE,
        allowNull: false
    }},
    {
    tableName: 'imoveis',
    timestamps: false, 
});

export default Imovel;