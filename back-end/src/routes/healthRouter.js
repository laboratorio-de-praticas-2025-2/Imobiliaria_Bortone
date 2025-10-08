import express from "express";
const healthRouter = express.Router();

// --- Rota de Verificação de Saúde ---
// GET /api/health
// Uma rota simples para verificar se a API está online e funcional.
healthRouter.get("/", (req, res) => {
  // Retorna um status 200 (OK) e uma mensagem JSON
  res.status(200).json({ status: "ok", message: "API está saudável" });
});

// Exporta o roteador para ser usado pelo servidor
export default healthRouter;
