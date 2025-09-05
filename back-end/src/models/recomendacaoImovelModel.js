import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const RecomendacaoImovel = connection.define("recomendacao_imovel", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    imovel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    data_visita: {
        type: Sequelize.DATE,
        allowNull: false,
    }},
    {
    tableName: 'recomendacao_imovel',
    timestamps: false, 
});

export default RecomendacaoImovel;