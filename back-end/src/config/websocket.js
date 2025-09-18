// Configurações globais (ex: conexão MySQL, variáveis de ambiente)

import { WebSocketServer } from "ws";
import { handleConnection } from "../controllers/chatController.js";

export default function initWebSocket(server) {
  const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    // Adicionar outras origens permitidas
  ];

  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const origin = req.headers.origin;
    if (!ALLOWED_ORIGINS.includes(origin)) {
      ws.close(1008, "Origin não permitida");
      return;
    }
    handleConnection(ws);
  });
  console.log("✅ WebSocket inicializado");
}
