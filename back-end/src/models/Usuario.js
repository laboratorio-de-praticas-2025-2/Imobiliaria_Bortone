import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const User = connection.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    nivel: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    celular: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'usuario',
});

User.sync({ force: false });

export default User;
