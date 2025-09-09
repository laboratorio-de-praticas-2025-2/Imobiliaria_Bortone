import { Sequelize } from "sequelize";
import connection from '../config/sequelize-config.js'

const Blog = connection.define("blog", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    conteudo: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    data_publicacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    url_imagem: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }},
    {
    tableName: 'blog',
    timestamps: false, 
});

export default Blog;