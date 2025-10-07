import express from "express";
const searchRouter = express.Router();

import {
  getHome,
  getImoveis,
  getMapa,
} from "../controllers/imovelSearchController.js";

searchRouter.get("/simples", getHome); // simples
searchRouter.post("/avancada", getImoveis); // avançada
searchRouter.post("/mapa", getMapa); // Busca-Mapa
export default searchRouter;
