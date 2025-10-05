import { Router } from "express";

import {
getAllPublicidades,
getPublicidadeById,
createPublicidade,
updatePublicidade,
deletePublicidade
} from "../controllers/publicidadeController.js";

const router = Router();

// Lista todas as publicidades
router.get("/", getAllPublicidades);

// Busca uma publicidade pelo ID
router.get("/:id", getPublicidadeById);

// Cria uma nova publicidade
router.post("/", createPublicidade);

// Atualiza uma publicidade existente
router.put("/:id", updatePublicidade);

// Remove uma publicidade
router.delete("/:id", deletePublicidade);

export default router;