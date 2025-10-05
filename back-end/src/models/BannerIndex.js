import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const BannerIndex = connection.define("banner_index", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        url_imagem: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        descricao: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        usuario_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        ativo: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    });

BannerIndex.sync({ force: false });

export default BannerIndex;
