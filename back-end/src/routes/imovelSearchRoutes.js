import express from "express";
const searchRouter = express.Router();

import { getHome, getImoveis, getMapa } from "../controllers/imovelSearchController.js";

searchRouter.get("/imoveis/home", getHome); // simples
searchRouter.post("/imoveis/busca", getImoveis); // avançada
searchRouter.post("/imoveis/mapa", getMapa) // Busca-Mapa
export default searchRouter;
