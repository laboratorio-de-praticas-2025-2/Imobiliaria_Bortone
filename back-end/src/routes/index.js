// Definição das rotas da API (REST: /users, /imoveis, /agendamentos)

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public", "cliente.html"));
});

export default router;