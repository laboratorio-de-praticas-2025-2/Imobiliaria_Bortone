import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const Usuario = connection.define("usuario", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    senha: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    nivel: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    celular: {
        type: Sequelize.TEXT,
        allowNull: false,
    }},
    {
    tableName: 'usuario',
    timestamps: false, 
});

export default Usuario;