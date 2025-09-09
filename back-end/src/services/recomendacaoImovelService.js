import RecomendacaoImovel from '../models/recomendacaoImovelModel.js'; 

export const createRecomendacao = async (data) => {
  try {
    const novaRecomendacao = await RecomendacaoImovel.create(data);
    return novaRecomendacao;
  } catch (error) {
    throw new Error('Não foi possível criar a recomendação: ' + error.message);
  }
};