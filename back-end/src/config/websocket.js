// Configurações globais (ex: conexão MySQL, variáveis de ambiente)

import { WebSocketServer } from "ws";
import { handleConnection } from "../controllers/chatController.js";

export default function initWebSocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => handleConnection(ws));
  console.log("✅ WebSocket inicializado");
}