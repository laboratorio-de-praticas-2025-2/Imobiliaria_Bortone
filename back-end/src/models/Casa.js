import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const Casa = connection.define("casa", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imovel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    quartos: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    banheiros: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    vagas: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    possui_piscina: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    possui_jardim: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }},
    {
    tableName: 'casa',
    timestamps: false, 
});

export default Casa;