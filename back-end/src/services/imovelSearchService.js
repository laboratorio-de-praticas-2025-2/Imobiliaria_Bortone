import Imovel from '../models/ImovelModel.js';
import Casa from '../models/CasaModel.js';
import Terreno from '../models/TerrenoModel.js';
import { Op } from 'sequelize';

export const buscarHome = async (endereco) => {
  try {
    const PropriedadesHome = await Imovel.findAll({
      where: {
        endereco: {
          [Op.like]: `%${endereco}%`  // Busca parcial
        }
      }
    });
    return PropriedadesHome;
  } catch (error) {
    throw new Error(
      'Não foi possível buscar as propriedades com o local, erro: ' + error.message
    );
  }
};

export const buscarImoveis = async (data) => {
  try {
    // Quebra "Cidade, Estado, País"
    const [cidade, estado] = data.localizacao
      ? data.localizacao.split(",").map((x) => x.trim())
      : [null, null];

    const whereImovel = {
      // filtro por cidade e estado se existirem
      ...(cidade && { cidade: { [Op.like]: `%${cidade}%` } }),
      ...(estado && { estado: { [Op.like]: `%${estado}%` } }),

      status: data.status ? { [Op.like]: `%${data.status}%` } : undefined,
      tipo: data.tipo ? { [Op.like]: `%${data.tipo}%` } : undefined,
      preco:
        data.precoMin && data.precoMax
          ? { [Op.between]: [data.precoMin, data.precoMax] }
          : data.precoMin
          ? { [Op.gte]: data.precoMin }
          : data.precoMax
          ? { [Op.lte]: data.precoMax }
          : undefined,
      area:
        data.areaMin && data.areaMax
          ? { [Op.between]: [data.areaMin, data.areaMax] }
          : data.areaMin
          ? { [Op.gte]: data.areaMin }
          : data.areaMax
          ? { [Op.lte]: data.areaMax }
          : undefined,
    };

    // where condicional para Casa
    const whereCasa = {};
    if (data.quartos === "1-3") whereCasa.quartos = { [Op.between]: [1, 3] };
    if (data.quartos === "4+") whereCasa.quartos = { [Op.gte]: 4 };

    if (data.banheiros === "1-3") whereCasa.banheiros = { [Op.between]: [1, 3] };
    if (data.banheiros === "4+") whereCasa.banheiros = { [Op.gte]: 4 };

    if (data.vagas === "0-2") whereCasa.vagas = { [Op.between]: [0, 2] };
    if (data.vagas === "3+") whereCasa.vagas = { [Op.gte]: 3 };

    const PropriedadesImoveis = await Imovel.findAll({
      where: whereImovel,
      include: [
        {
          model: Casa,
          attributes: ["quartos", "banheiros", "vagas"],
          ...(Object.keys(whereCasa).length > 0 && { where: whereCasa }),
        },
        {
          model: Terreno,
          attributes: ["tipo_terreno"],
        },
      ],
    });

    return PropriedadesImoveis;
  } catch (error) {
    throw new Error("Erro ao buscar imóveis: " + error.message);
  }
};

export const buscarMapa = async (data) => {
  try {
    // 🔹 filtros principais de Imóvel
    const whereImovel = {
      endereco: data.endereco ? { [Op.like]: `%${data.endereco}%` } : undefined,
      tipo: data.tipo ? { [Op.like]: `%${data.tipo}%` } : undefined,
      murado: data.murado !== undefined ? data.murado : undefined,
      preco: { [Op.between]: [25000, 1000000] }, // faixa fixa
      area: { [Op.between]: [0, 1000] } // faixa fixa
    };

    // 🔹 filtros opcionais de Casa
    const whereCasa = {};
    if (data.quartos === "1") whereCasa.quartos = 1;
    if (data.quartos === "2") whereCasa.quartos = 2;
    if (data.quartos === "3") whereCasa.quartos = 3;
    if (data.quartos === "4") whereCasa.quartos = 4;
    if (data.quartos === "5+") whereCasa.quartos = { [Op.gte]: 5 };

    if (data.banheiros === "1") whereCasa.banheiros = 1;
    if (data.banheiros === "2") whereCasa.banheiros = 2;
    if (data.banheiros === "3") whereCasa.banheiros = 3;
    if (data.banheiros === "4") whereCasa.banheiros = 4;
    if (data.banheiros === "5+") whereCasa.banheiros = { [Op.gte]: 5 };

    if (data.vagas === "1") whereCasa.vagas = 1;
    if (data.vagas === "2") whereCasa.vagas = 2;
    if (data.vagas === "3") whereCasa.vagas = 3;
    if (data.vagas === "4") whereCasa.vagas = 4;
    if (data.vagas === "5+") whereCasa.vagas = { [Op.gte]: 5 };

    if (data.piscina !== undefined) whereCasa.possui_piscina = data.piscina;
    if (data.jardim !== undefined) whereCasa.possui_jardim = data.jardim;

    // 🔹 Monta a query
    const PropriedadesMapa = await Imovel.findAll({
      where: whereImovel,
      attributes: [
        "id",
        "endereco",
        "cidade",
        "estado",
        "latitude",
        "longitude",
        "tipo",
        "preco",
        "area",
        "murado"
      ],
      include: [
        {
          model: Casa,
          attributes: ["quartos", "banheiros", "vagas", "possui_piscina", "possui_jardim"],
          ...(Object.keys(whereCasa).length > 0 && { where: whereCasa })
        },
        {
          model: Terreno,
          attributes: ["tipo_terreno"]
        }
      ]
    });

    return PropriedadesMapa;
  } catch (error) {
    throw new Error("Não foi possível buscar as propriedades com o local, erro: " + error.message);
  }
};