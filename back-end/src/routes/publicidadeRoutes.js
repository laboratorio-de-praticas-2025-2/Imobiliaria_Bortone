import { Router } from "express";
import Auth from "../middlewares/Auth.js";

import {
getAllPublicidades,
getPublicidadeById,
createPublicidade,
updatePublicidade,
deletePublicidade
} from "../controllers/publicidadeController.js";

const router = Router();

// Lista todas as publicidades (público)
router.get("/", getAllPublicidades);

// Busca uma publicidade pelo ID (público)
router.get("/:id", getPublicidadeById);

// Cria uma nova publicidade (requer autenticação)
router.post("/", Auth.Authorization, createPublicidade);

// Atualiza uma publicidade existente (requer autenticação)
router.put("/:id", Auth.Authorization, updatePublicidade);
router.patch("/:id", Auth.Authorization, updatePublicidade);

// Remove uma publicidade (requer autenticação)
router.delete("/:id", Auth.Authorization, deletePublicidade);

export default router;
