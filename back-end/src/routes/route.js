import express from "express";

const router = express.Router();

// --- Rota de Verificação de Saúde ---
// GET /api/health
// Uma rota simples para verificar se a API está online e funcional.
router.get("/health", (req, res) => {
  // Retorna um status 200 (OK) e uma mensagem JSON
  res.status(200).json({ status: "ok", message: "API está saudável" });
});

// Exporta o roteador para ser usado pelo servidor
export default router;