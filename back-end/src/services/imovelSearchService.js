import Imovel from "../models/Imovel.js";
import Casa from "../models/Casa.js";
import Terreno from "../models/Terreno.js";
import ImagemImovel from "../models/ImagemImovel.js";
import {
  organizarImoveisCarrossel,
  organizarImoveisMapView,
} from "./organizarImoveisMapaService.js";
import { Op } from "sequelize";

export const buscarHome = async (endereco) => {
  try {
    const PropriedadesHome = await Imovel.findAll({
      where: {
        endereco: {
          [Op.like]: `%${endereco}%`, // Busca parcial
        },
      },
    });
    return PropriedadesHome;
  } catch (error) {
    throw new Error(
      "Não foi possível buscar as propriedades com o local, erro: " +
        error.message
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
      ...(data.endereco && { endereco: { [Op.like]: `%${data.endereco}%` } }),
      ...(cidade && { cidade: { [Op.like]: `%${cidade}%` } }),
      ...(estado && { estado: { [Op.like]: `%${estado}%` } }),
      ...(data.status && { status: { [Op.like]: `%${data.status}%` } }),
      ...(data.tipo && { tipo: { [Op.like]: `%${data.tipo}%` } }),
      ...(data.tipo_negociacao && {
        tipo_negociacao: { [Op.like]: `%${data.tipo_negociacao}%` },
      }),
      ...(data.precoMin && data.precoMax
        ? { preco: { [Op.between]: [data.precoMin, data.precoMax] } }
        : data.precoMin
        ? { preco: { [Op.gte]: data.precoMin } }
        : data.precoMax
        ? { preco: { [Op.lte]: data.precoMax } }
        : {}),
      ...(data.areaMin && data.areaMax
        ? { area: { [Op.between]: [data.areaMin, data.areaMax] } }
        : data.areaMin
        ? { area: { [Op.gte]: data.areaMin } }
        : data.areaMax
        ? { area: { [Op.lte]: data.areaMax } }
        : {}),
    };

    // where condicional para Casa
    const whereCasa = {};
    if (data.quartos === "1-3") whereCasa.quartos = { [Op.between]: [1, 3] };
    if (data.quartos === "4+") whereCasa.quartos = { [Op.gte]: 4 };

    if (data.banheiros === "1-3")
      whereCasa.banheiros = { [Op.between]: [1, 3] };
    if (data.banheiros === "4+") whereCasa.banheiros = { [Op.gte]: 4 };

    if (data.vagas === "0-2") whereCasa.vagas = { [Op.between]: [0, 2] };
    if (data.vagas === "3+") whereCasa.vagas = { [Op.gte]: 3 };

    const PropriedadesImoveis = await Imovel.findAll({
      where: whereImovel,
      include: [
        {
          model: Casa,
          as: "casa",
          attributes: ["quartos", "banheiros", "vagas"],
          where: {
            ...(data.quartos && { quartos: data.quartos }),
            ...(data.banheiros && { banheiros: data.banheiros }),
          },
        },
        {
          model: Terreno,
          as: "terreno",
          required: false,
        },
        // {
        //   model: ImagemImovel,
        //   as: "imagem_imovel",
        //   attributes: ["url_imagem", "descricao"],
        //   required: false,
        // },
      ],
    });

    return PropriedadesImoveis;
  } catch (error) {
    throw new Error("Erro ao buscar imóveis: " + error.message);
  }
};

export const buscarMapa = async (data) => {
  console.log(data); // Verifique os dados recebidos

  try {
    console.log("Dados recebidos:", data); // Verifique no console o que foi recebido

    // 🔹 Filtros principais de Imóvel
    let tipoFilter = {};
    let includeModels = [];

    // Se for Terreno, inclui apenas o filtro de tipo Terreno
    if (data.tipo === "Terreno") {
      tipoFilter = { tipo: "Terreno" };
      includeModels.push({
        model: Terreno, // Apenas Terreno
        as: "terreno",
      });
    } else if (
      data.tipo === "Casa" ||
      data.tipo === "Apartamento" ||
      data.tipo !== "Terreno"
    ) {
      tipoFilter = {
        tipo: { [Op.or]: ["Casa", "Apartamento"] }, // Filtra por 'Casa' ou 'Apartamento'
      };
      includeModels.push({
        model: Casa,
        as: "casa",
        attributes: [
          "quartos",
          "banheiros",
          "vagas",
          "possui_piscina",
          "possui_jardim",
        ],
        where: {
          ...(data.quartos &&
            data.quartos !== null && {
              quartos:
                data.quartos === "1"
                  ? { [Op.eq]: 1 }
                  : data.quartos === "2"
                  ? { [Op.eq]: 2 }
                  : data.quartos === "3"
                  ? { [Op.eq]: 3 }
                  : data.quartos === "4"
                  ? { [Op.eq]: 4 }
                  : data.quartos === "5+"
                  ? { [Op.gte]: 5 }
                  : undefined,
            }),
          ...(data.banheiros &&
            data.banheiros !== null && {
              banheiros:
                data.banheiros === "1"
                  ? { [Op.eq]: 1 }
                  : data.banheiros === "2"
                  ? { [Op.eq]: 2 }
                  : data.banheiros === "3"
                  ? { [Op.eq]: 3 }
                  : data.banheiros === "4"
                  ? { [Op.eq]: 4 }
                  : data.banheiros === "5+"
                  ? { [Op.gte]: 5 }
                  : undefined,
            }),
          ...(data.vagas &&
            data.vagas !== null && {
              vagas:
                data.vagas === "1"
                  ? { [Op.eq]: 1 }
                  : data.vagas === "2"
                  ? { [Op.eq]: 2 }
                  : data.vagas === "3"
                  ? { [Op.eq]: 3 }
                  : data.vagas === "4"
                  ? { [Op.eq]: 4 }
                  : data.vagas === "5+"
                  ? { [Op.gte]: 5 }
                  : undefined,
            }),
          ...(data.possui_piscina !== undefined &&
            data.possui_piscina !== null && {
              possui_piscina: data.possui_piscina === true ? 1 : 0,
            }),
          ...(data.possui_jardim !== undefined &&
            data.possui_jardim !== null && {
              possui_jardim: data.possui_jardim === true ? 1 : 0,
            }),
        },
      });
    }

    // 🔹 Filtros para o whereImovel
    let whereImovel = {
      ...tipoFilter,
      ...(data.endereco &&
        data.endereco !== null && {
          endereco: { [Op.like]: `%${data.endereco}%` },
        }),
      ...(data.murado !== undefined &&
        data.murado !== null && { murado: data.murado === true ? 1 : 0 }), // Converte murado para 1/0
      preco: data.preco
        ? { [Op.between]: data.preco }
        : { [Op.between]: [25000, 1000000] }, // faixa fixa ou a passada
      area: data.area
        ? { [Op.between]: data.area }
        : { [Op.between]: [0, 1000] }, // faixa fixa ou a passada
      status: "disponivel", // Status fixo para "disponivel"
    };

    // Se apenas o endereço for fornecido (sem outros filtros), ajusta a query para pesquisar somente pelo endereço
    if (Object.keys(data).length === 1 && data.endereco) {
      whereImovel = { endereco: { [Op.like]: `%${data.endereco}%` } }; // Filtro apenas para o endereço
    }

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
        "murado",
        "status",
        "descricao",
        "data_cadastro",
      ],
      include: [
        ...includeModels, // Inclui dinamicamente os modelos com base no tipo
        {
          model: ImagemImovel, // Inclui as imagens,
          as: "imagem_imovel",
          attributes: ["url_imagem", "descricao"],
          required: false, // Permite que imóveis sem imagem também sejam retornados
        },
      ],
    });

    // Verifique se PropriedadesMapa é um array e contém elementos
    if (!Array.isArray(PropriedadesMapa) || PropriedadesMapa.length === 0) {
      throw new Error("Imóveis não encontrados ou dados inválidos.");
    }

    console.log(
      "Imóveis retornados do banco:",
      JSON.stringify(PropriedadesMapa, null, 2)
    );

    // Organiza os imóveis para o CarrosselMapa
    const imoveisParaCarrossel = organizarImoveisCarrossel(PropriedadesMapa);

    // Organiza os imóveis para o MapView
    const imoveisParaMapView = organizarImoveisMapView(PropriedadesMapa);

    console.log(JSON.stringify(imoveisParaCarrossel, null, 2));
    console.log(JSON.stringify(imoveisParaMapView, null, 2));

    // Retorna as duas listas organizadas
    return {
      carrossel: imoveisParaCarrossel,
      mapa: imoveisParaMapView,
    };
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error.message);
    throw new Error(
      "Não foi possível buscar as propriedades com o local, erro: " +
        error.message
    );
  }
};
