import RecomendacaoImovel from '../models/RecomendacaoImovel.js';

// criar nova recomendação no DataBase
export const createRecomendacao = async (data) => {
    try {
        const novaRecomendacao = await RecomendacaoImovel.create(data);
        return novaRecomendacao;
    }   catch (err) {
        throw new Error("Erro ao criar recomendação.");
    }
};

// buscar toda as recomendações no DataBase
export const getAllRecomendacoes = async () => {
    try{
        const recomendacoes = await RecomendacaoImovel.findAll();
        return recomendacoes;
    }   catch (err) {
        throw new Error("Erro ao buscar recomendações.");
    }
};

// Buscar as recomendações por ID
export const getRecomendacaoByID = async (id) => {
    try {
        const recomendacao = await RecomendacaoImovel.findByPk(id);
        return recomendacao;
    }   catch (err) {
        throw new Error("Erro ao buscar recomendação por ID.")
    }
};

// deletar recomendação por ID
export const deleteRecomendacao = async (id) => {
    try{
        const recomendacoesDeletadas = await RecomendacaoImovel.destroy({
            where: {
                id: id
            },
        });

        return recomendacoesDeletadas > 0;
    } catch (err) {
        throw new Error("Erro ao deletar recomendações.")
    }
};

// Create, Read e Delete prontos.