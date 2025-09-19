import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const ImagemImovel = connection.define("imagem_imovel", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    imovel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    url_imagem: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }},
    {
    tableName: 'imagem_imovel',
    timestamps: false, 
});

export default ImagemImovel;