import express from "express";
const searchRouter = express.Router();

import { getHome, getImoveis } from "../controllers/imovelSearchController.js";

searchRouter.get("/imoveis/home", getHome); // simples
searchRouter.post("/imoveis/busca", getImoveis); // avançada

export default searchRouter;
