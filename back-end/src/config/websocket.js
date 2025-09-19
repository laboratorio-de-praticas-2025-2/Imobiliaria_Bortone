// Configurações globais (ex: conexão MySQL, variáveis de ambiente)

import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
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

    // Autenticação JWT
    const token = req.url.split("token=")[1];
    if (!token) {
      ws.close(4001, "Token JWT obrigatório");
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userData = decoded;
      handleConnection(ws);
    } catch (error) {
      ws.close(4002, "Token inválido");
    }
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
};
