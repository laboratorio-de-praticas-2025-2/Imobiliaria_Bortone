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
router.get("/publicidade", getAllPublicidades);

// Busca uma publicidade pelo ID
router.get("/publicidade/:id", getPublicidadeById);

// Cria uma nova publicidade
router.post("/publicidade", createPublicidade);

// Atualiza uma publicidade existente
router.put("/publicidade/:id", updatePublicidade);

// Remove uma publicidade
router.delete("/publicidade/:id", deletePublicidade);

export default router;
