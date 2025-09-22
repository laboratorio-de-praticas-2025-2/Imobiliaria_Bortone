import express from 'express';
import * as ImoveisController from "../controllers/ImoveisController.js";

const router = express.Router();



router.post("/", ImoveisController.create);

router.get("/", ImoveisController.getFilteredImoveis);

router.get("/status/:status", ImoveisController.getByStatus);

router.get("/negociacao/:tipo", ImoveisController.getByNegociacao);

router.get("/:id", ImoveisController.getById);


router.put("/:id", ImoveisController.update);

router.patch("/:id/status", ImoveisController.updateStatus);

router.delete("/:id", ImoveisController.deleteImovel);

export default router;
