// Configurações globais (ex: conexão MySQL, variáveis de ambiente)

import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { handleConnection } from "../controllers/chatController.js";

export default function initWebSocket(server) {
  const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://imobiliaria-bortone.vercel.app",
    // Adicionar outras origens permitidas em produção
  ];

  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const origin = req.headers.origin;
    
    // Em desenvolvimento, permitir qualquer origem local
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isOriginAllowed = isDevelopment || 
      !origin || 
      ALLOWED_ORIGINS.some(allowedOrigin => origin.startsWith(allowedOrigin));
    
    if (!isOriginAllowed) {
      ws.close(1008, "Origin não permitida");
      return;
    }

    // Heartbeat: marcar como vivo ao receber pong
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Para teste: permitir conexão sem JWT se for modo de desenvolvimento
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const token = urlParams.get('token');
    const testUserId = urlParams.get('testUserId');

    // Modo de teste com usuários fixos (apenas em desenvolvimento)
    if (testUserId && process.env.NODE_ENV === 'development') {
      ws.userData = {
        id: parseInt(testUserId),
        nivel: testUserId === '1' ? 0 : 1, // User 1 = admin/agent, outros = user
        nome: `Usuário ${testUserId}`
      };
      handleConnection(ws);
      return;
    }

    // Autenticação JWT obrigatória
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
