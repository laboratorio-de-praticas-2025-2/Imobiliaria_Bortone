// Configurações globais (ex: conexão MySQL, variáveis de ambiente)

import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { handleConnection } from "../controllers/chatController.js";

export default function initWebSocket(server) {
  const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://imobiliaria-bortone.vercel.app",
    // Padrões Vercel para branches
    "https://imobiliaria-bortone-git-",
    "https://imobiliaria-bortone-",
  ];

  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const origin = req.headers.origin;
    console.log(`🔌 Nova conexão WebSocket - Origin: ${origin}`);
    
    // Em desenvolvimento, permitir qualquer origem local
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isOriginAllowed = isDevelopment || 
      !origin || 
      ALLOWED_ORIGINS.some(allowedOrigin => {
        // Permitir exata ou que comece com (para URLs do Vercel)
        return origin === allowedOrigin || origin.startsWith(allowedOrigin);
      });
    
    if (!isOriginAllowed) {
      console.log(`❌ Origin não permitida: ${origin}`);
      ws.close(1008, "Origin não permitida");
      return;
    }

    // Heartbeat: marcar como vivo ao receber pong
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Log de fechamento para debug
    ws.on("close", (code, reason) => {
      console.log(`🔌 WebSocket fechado - Código: ${code}, Razão: ${reason}, Usuário: ${ws.userData?.id || 'desconhecido'}`);
    });

    // Log de erros para debug
    ws.on("error", (error) => {
      console.log(`🚨 Erro no WebSocket - Usuário: ${ws.userData?.id || 'desconhecido'}, Erro: ${error.message}`);
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
      console.log("❌ Token não fornecido na URL");
      ws.close(4001, "Token JWT obrigatório");
      return;
    }

    // Debug: verificar se JWT_SECRET está definido
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERRO CRÍTICO: JWT_SECRET não está definido no ambiente!");
      ws.close(4002, "Configuração inválida do servidor");
      return;
    }

    console.log(`🔍 Tentando verificar token (primeiros 30 chars): ${token.substring(0, 30)}...`);
    console.log(`🔍 JWT_SECRET definido: ${!!process.env.JWT_SECRET}`);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`✅ Token válido para usuário ID: ${decoded.id}, Email: ${decoded.email}, Nível: ${decoded.nivel}`);
      ws.userData = decoded;
      handleConnection(ws);
    } catch (error) {
      console.log(`❌ Erro na verificação do token: ${error.message}`);
      console.log(`🔍 Tipo de erro: ${error.name}`);
      if (error.name === 'TokenExpiredError') {
        console.log(`⏰ Token expirou em: ${error.expiredAt}`);
        ws.close(4002, "Token expirado");
      } else if (error.name === 'JsonWebTokenError') {
        console.log(`🔍 Mensagem de erro JWT: ${error.message}`);
        ws.close(4002, "Token inválido");
      } else {
        console.log(`🔍 Erro desconhecido: ${error.stack}`);
        ws.close(4002, "Erro ao validar token");
      }
    }
  });

  // Heartbeat: enviar ping a cada 30 segundos
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("🔌 Terminando conexão WebSocket inativa");
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // 30 segundos

  console.log("✅ WebSocket inicializado");
};
