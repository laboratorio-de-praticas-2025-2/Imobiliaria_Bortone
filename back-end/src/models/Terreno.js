import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const Terreno = connection.define("terreno", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imovel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }},
    {
    tableName: 'terreno',
    timestamps: false, 
});

export default Terreno;