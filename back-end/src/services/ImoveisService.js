import Imovel from '../models/Imovel.js';
import Casa from '../models/Casa.js';
import Terreno from '../models/Terreno.js';
import ImagemImovel from '../models/ImagemImovel.js';
import connection from '../config/sequelize-config.js'; 
import { Sequelize, Op } from 'sequelize';import RecomendacaoImovel from '../models/recomendacaoImovelModel.js';


export const create = async (imovelData, casaData) => {
  const transaction = await connection.transaction(); 
  try {
    const newImovel = await Imovel.create(imovelData, { transaction });

    if (imovelData.tipo.toLowerCase() === 'casa' || imovelData.tipo.toLowerCase() === 'apartamento') {
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

    if (imovelData.tipo && imovelData.tipo.toLowerCase() === 'casa') {
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
 * @param {Array<Object>} include export const getFilteredEntities = async (..., includeMetadata = true) => {
   // ...
   if (includeMetadata) {
     // ... returns { entities, totalCount, totalPages, ... }
   }
   // ... otherwise, just returns the entities array
   return entities;
 };
 
 * @param {Object} ordering - Object with orderBy and orderDirection properties
 * @param {Object} pagination - Object with page and pagination properties
 * @param {boolean} includeMetadata - Whether to include pagination metadata in response
 * @returns {Array<Object>|Object} - Array of entities or object with entities and metadata
 */
export const getFilteredEntities = async (filters, filterMappings, include = [], ordering = {}, pagination = {}, includeMetadata = true) => {
  try {
    const where = {};
    const casaWhere = {};


    const handlePlusFilter = (value, field) => {
      if (typeof value === 'string' && value.includes('+')) {
        const baseNumber = parseInt(value, 10);
        if (!isNaN(baseNumber)) {
          casaWhere[field] = {
            [Op.gte]: baseNumber 
          };
          return true;
        }
      }
      return false;
    };

    for (const key in filterMappings) {
      const mapping = filterMappings[key];
      const filterValue = filters[key];


      if (mapping.type === 'search' && filterValue) {
        where[mapping.field] = {
          [Op.like]: `%${filterValue}%`
        };
        continue;
      }


      const minKey = `min${key.charAt(0).toUpperCase() + key.slice(1)}`;
      const maxKey = `max${key.charAt(0).toUpperCase() + key.slice(1)}`;
      const minValue = filters[minKey];
      const maxValue = filters[maxKey];

      if (mapping.model === 'casa') {

         if (['quartos', 'banheiros', 'vagas'].includes(mapping.field)) {
          if (filterValue) {
            if (!handlePlusFilter(filterValue, mapping.field)) {
              // If not a "+" case, use exact match
              casaWhere[mapping.field] = parseInt(filterValue, 10);
            }
          }
          continue;
        }

        if (filterValue !== undefined) {
          casaWhere[mapping.field] = filterValue;
        }
      } else if (mapping.type === 'exact') {
        if (filterValue !== undefined) {
          where[mapping.field] = filterValue;
        }
      } else if (mapping.type === 'range') {
        if (minValue !== undefined && maxValue !== undefined) {
          where[mapping.field] = { [Op.between]: [minValue, maxValue] };
        } else if (minValue !== undefined) {
          where[mapping.field] = { [Op.gte]: minValue };
        } else if (maxValue !== undefined) {
          where[mapping.field] = { [Op.lte]: maxValue };
        }
      }
    }

    if (Object.keys(casaWhere).length > 0) {
      let casaInclude = include.find(item => item.model === Casa && item.as === 'casa');

      if (casaInclude) {
        casaInclude.where = { ...casaInclude.where, ...casaWhere };
      } else {
        include.push({ model: Casa, as: 'casa', where: casaWhere });
      }
    }
    
    const order = [];
    if (ordering.orderBy && ordering.orderDirection) {
      const validOrderBy = ['data_cadastro', 'endereco', 'preco', 'area'];
      const validOrderDirection = ['ASC', 'DESC'];
      
      console.log("Service - Ordering received:", ordering);
      console.log("Service - Valid orderBy:", validOrderBy.includes(ordering.orderBy));
      console.log("Service - Valid orderDirection:", validOrderDirection.includes(ordering.orderDirection.toUpperCase()));
      
      if (validOrderBy.includes(ordering.orderBy) && validOrderDirection.includes(ordering.orderDirection.toUpperCase())) {
        order.push([ordering.orderBy, ordering.orderDirection.toUpperCase()]);
        console.log("Service - Order applied:", order);
      }
    }

    console.log("Service - Final order configuration:", order);

    // Handle pagination
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.pagination) || 10;
    const offset = (page - 1) * limit;

    console.log("Service - Pagination:", { page, limit, offset });

    const entities = await Imovel.findAll({
      where: where,
      include: include,
      order: order.length > 0 ? order : undefined,
      limit: limit,
      offset: offset,
    });

    // Return pagination metadata only if requested
    if (includeMetadata) {
      // Count only unique imóveis, not JOIN results
      console.log("Count include:", JSON.stringify(include, null, 2));

      const totalCount = await Imovel.count({
        where: where,
        // Don't include related models in count to avoid inflated numbers
        
        include: include.length > 0 ? include : undefined,
        distinct: true,
        col: 'id'
      });
      
      const totalPages = Math.ceil(totalCount / limit);
      return {
        entities,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    }

    // Return just the entities array (current implementation)
    return entities;
  } catch (error) {
    throw new Error(`Erro ao buscar entidades filtradas: ${error.message}`);
  }
};
