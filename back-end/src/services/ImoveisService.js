import Imovel from '../models/Imovel.js';
import Casa from '../models/Casa.js';
import Terreno from '../models/Terreno.js';
import ImagemImovel from '../models/ImagemImovel.js';
import connection from '../config/sequelize-config.js'; 
import { Sequelize, Op } from 'sequelize';import RecomendacaoImovel from '../models/recomendacaoImovelModal.js';


export const create = async (imovelData, casaData) => {
  const transaction = await connection.transaction(); 
  try {
    const newImovel = await Imovel.create(imovelData, { transaction });

    if (imovelData.tipo === 'casa' || imovelData.tipo === 'apartamento') {
      await Casa.create({
        ...casaData,
        imovel_id: newImovel.id
      }, { transaction });
    }
    
    await Terreno.create({
      imovel_id: newImovel.id
    }, { transaction });

    await transaction.commit();
    return Imovel.findByPk(newImovel.id, { include: [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }] });
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erro ao criar imóvel: ${error.message}`);
  }
};

/**
 * @param {Object} criteria 
 * @param {Array<Object>} include 
 * @returns {Array<Object>} 
 */
export const findBy = async (criteria, include = []) => {
  try {
    const entities = await Imovel.findAll({
      where: criteria,
      include: include,
    });
    return entities;
  } catch (error) {
    throw new Error(`Erro ao buscar imóveis: ${error.message}`);
  }
};

/**
 * @param {number} id 
 * @param {Array<Object>} include
 * @returns {Object}
 */
export const getById = async (id, include = []) => {
  try {
    const entity = await Imovel.findByPk(id, { include });
    if (!entity) {
      throw new Error("imóvel não encontrado");
    }
    return entity;
  } catch (error) {
    throw new Error(`Erro ao buscar imóvel por ID: ${error.message}`);
  }
};

/**
 * 
 * @param {number} id 
 * @param {Object} imovelData 
 * @param {Object} casaData 
 * @param {Array<string>} imagem_imovel 
 * @returns {Object} 
 */
export const update = async (id, imovelData, casaData) => {
  const transaction = await connection.transaction();
  try {
    const imovel = await Imovel.findByPk(id, { transaction });
    if (!imovel) {
      throw new Error("Imóvel não encontrado.");
    }

    await imovel.update(imovelData, { transaction });

    if (imovelData.tipo === 'casa') {
      const casa = await Casa.findOne({ where: { imovel_id: id }, transaction });
      if (casa) {
        await casa.update(casaData, { transaction });
      } else {
        await Casa.create({ ...casaData, imovel_id: id }, { transaction });
      }
    } else if (imovelData.tipo === 'terreno') {
      const terreno = await Terreno.findOne({ where: { imovel_id: id }, transaction });
      if (!terreno) {
        await Terreno.create({ imovel_id: id }, { transaction });
      }
    }

    await transaction.commit();
    return Imovel.findByPk(id, { include: [{ model: Casa, as: 'casa' }, { model: Terreno, as: 'terreno' }] });
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erro ao atualizar imóvel: ${error.message}`);
  }
};

/**
 * @param {number} id - The ID of the entity to delete.
 * @returns {boolean} True if the entity was deleted, false otherwise.
 */
export const deleteImovel = async (id) => {
  const transaction = await connection.transaction(); 
  try {
    const imovel = await Imovel.findByPk(id, { transaction });
    if (!imovel) {
      await transaction.rollback();
      return false;
    }

    await Casa.destroy({ where: { imovel_id: id }, transaction });
    await Terreno.destroy({ where: { imovel_id: id }, transaction });
    await ImagemImovel.destroy({ where: { imovel_id: id }, transaction });
    await RecomendacaoImovel.destroy({ where: { imovel_id: id }, transaction });

    await imovel.destroy({ transaction });

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erro ao excluir imóvel: ${error.message}`);
  }
};

/**
 * @param {Object} filters 
 * @param {Object} filterMappings
 * @param {Array<Object>} include 
 * @returns {Array<Object>} 
 */
export const getFilteredEntities = async (filters, filterMappings, include = []) => {
  try {
    const where = {};

    for (const key in filters) {
      if (filters[key] !== undefined) {
        const mapping = filterMappings[key];
        if (mapping) {
          if (mapping.type === 'exact') {
            where[mapping.field] = filters[key];
          } else if (mapping.type === 'range') {
            const minKey = `min${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const maxKey = `max${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const minValue = filters[minKey];
            const maxValue = filters[maxKey];

            if (minValue !== undefined && maxValue !== undefined) {
              where[mapping.field] = { [Op.between]: [minValue, maxValue] };
            } else if (minValue !== undefined) {
              where[mapping.field] = { [Op.gte]: minValue };
            } else if (maxValue !== undefined) {
              where[mapping.field] = { [Op.lte]: maxValue };
            }
          }
        }
      }
    }

    const entities = await Imovel.findAll({
      where: where,
      include: include,
    });
    return entities;
  } catch (error) {
    throw new Error(`Erro ao buscar entidades filtradas: ${error.message}`);
  }
};
