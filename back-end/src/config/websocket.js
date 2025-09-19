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

    // Heartbeat: marcar como vivo ao receber pong
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    handleConnection(ws);
  });

  // Heartbeat: enviar ping a cada 15 minutos
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 900000); // 15 minutos

  console.log("✅ WebSocket inicializado");
}
