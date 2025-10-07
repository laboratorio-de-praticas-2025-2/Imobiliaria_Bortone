import ImagemImovel from '../models/ImagemImovel.js';

export const createImagem = async (imagemData) => {
  try {
    const novaImagem = await ImagemImovel.create(imagemData);
    return novaImagem;
  } catch (error) {
    throw new Error(`Erro ao criar imagem: ${error.message}`);
  }
};

export const deleteImagem = async (id) => {
  try {
    const deleted = await ImagemImovel.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(`Erro ao excluir imagem: ${error.message}`);
  }
};

export const getImageById = async (id) => {
  try {
    const imagem = await ImagemImovel.findByPk(id);
    return imagem;
  } catch (error) {
    throw new Error(`Erro ao buscar imagem por ID: ${error.message}`);
  }
};

export const getImagesByImovelId = async (imovelId) => {
  try {
    const imagens = await ImagemImovel.findAll({ where: { imovel_id: imovelId } });
    return imagens;
  } catch (error) {
    throw new Error(`Erro ao buscar imagens por ID do imóvel: ${error.message}`);
  }
};