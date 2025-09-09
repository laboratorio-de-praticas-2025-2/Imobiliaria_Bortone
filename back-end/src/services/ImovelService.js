import Imovel from '../models/ImovelModel.js';
import { Op } from 'sequelize';

export const buscarHome = async (endereco) => {
  try {
    const Propriedades = await Imovel.findAll({
      where: {
        endereco: {
          [Op.like]: `%${endereco}%`  // Busca parcial
        }
      }
    });
    return Propriedades;
  } catch (error) {
    throw new Error(
      'Não foi possível buscar as propriedades com o local: ' + error.message
    );
  }
};