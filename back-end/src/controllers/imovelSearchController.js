import {
  buscarHome,
  buscarImoveis,
  buscarMapa,
} from "../services/imovelSearchService.js";

// Busca simples somente por endereço informado
export const getHome = async (req, res) => {
  try {
    const { endereco } = req.query;
    const propriedades = await buscarHome(endereco || ""); // Tratamento caso endereco seja undefined
    res.status(200).json({ propriedades: propriedades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// Busca avançada por filtros
export const getImoveis = async (req, res) => {
  try {
    const filtros = req.body;
    const propriedades = await buscarImoveis(filtros);
    res.status(200).json({ propriedades: propriedades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// Busca avançada por filtros
export const getMapa = async (req, res) => {
  try {
    const filtros = req.body;
    const propriedades = await buscarMapa(filtros);
    res.status(200).json({ propriedades: propriedades });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
