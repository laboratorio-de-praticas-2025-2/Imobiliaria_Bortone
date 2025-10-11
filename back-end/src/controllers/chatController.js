// Definição dos modelos de dados (ex: Usuario, Imovel, Agendamento)

import chatService from "../services/chatService.js";
import { dentroHorario } from "../utils/timeUtils.js";
import { logError, logInfo } from "../utils/logger.js";

export function handleConnection(ws) {
  let role = null;
  let currentId = null;

  // Debug inicial
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔑 JWT_SECRET definido:', !!process.env.JWT_SECRET);
  console.log('👥 Usuários conectados:', Object.keys(chatService.users).length);
  console.log('🤖 Agentes conectados:', Object.keys(chatService.agents).length);

  ws.on("message", (msg) => {
    let data;
    try {
      try {
        data = JSON.parse(msg);
      } catch (parseErr) {
        logError({
          message: "Mensagem JSON malformada recebida.",
          userId: currentId,
          chatId: null,
          stack: parseErr.stack,
        });
        chatService.send(ws, { error: "Mensagem inválida" });
        return;
      }

      // Se por algum motivo a primeira mensagem não for 'connect', tentar inferir role/id do ws.userData para evitar condição de corrida
      if (!role && ws.userData) {
        const decoded = ws.userData;
        const roleMap = { 0: "agent", 1: "user" };
        role = roleMap[decoded.nivel];
        currentId = decoded.id;
      }      // Conexão inicial
      if (data.type === "connect") {
        let decoded;

        // Modo de teste com usuários fixos
        if (ws.userData) {
          decoded = ws.userData;
        } else {
          // Se já temos userData do websocket.js, usar ao invés de verificar novamente
          if (ws.userData) {
            decoded = ws.userData;
          } else {
            decoded = chatService.verifyToken(data.token);
            if (!decoded) {
              console.log("❌ Token inválido na conexão:", data.token?.substring(0, 20) + "...");
              ws.close(4002, "Token inválido");
              return;
            }
          }
        }

        const roleMap = {
          0: "agent", // admin → atendente
          1: "user"   // user → usuário normal
        };
        
        role = roleMap[decoded.nivel];
        currentId = decoded.id;
        
        // Priorizar nome do token, depois o nome enviado pelo cliente
        const nomeUsuario = decoded.nome || data.nome || decoded.email || `Usuario ${currentId}`;
        
        // Log detalhado para debug
        console.log(`🔍 Conexão chat - ID: ${currentId}, Nome: "${nomeUsuario}", Nível: ${decoded.nivel}, Role: ${role}`, {
          tokenNome: decoded.nome,
          dataNome: data.nome,
          email: decoded.email,
          nomeEscolhido: nomeUsuario
        });

        // Usuário
        if (role === "user") {
          // No modo de desenvolvimento, permitir conexão mesmo sem agentes online
          const isDevelopment = process.env.NODE_ENV === 'development';
          
          // Verificar limite de usuários ANTES de outras verificações
          const maxUsers = isDevelopment ? 10 : 20;
          if (Object.keys(chatService.users).length >= maxUsers) {
            console.log(`❌ Limite de usuários atingido: ${Object.keys(chatService.users).length}/${maxUsers}`);
            chatService.send(ws, {
              type: "error",
              msg: "Limite de usuários simultâneos atingido. Tente novamente mais tarde.",
            });
            setTimeout(() => ws.close(4003, "Limite de usuários atingido"), 1000);
            return;
          }
          
          if (!isDevelopment) {
            const horarioResultado = dentroHorario();
            const temAgentes = Object.keys(chatService.agents).length > 0;
            
            if (horarioResultado !== true) {
              chatService.send(ws, {
                type: "status",
                msg: "⏰ Nosso atendimento funciona de 8h às 18h. Deixe sua mensagem que responderemos em breve!",
              });
              // Não fechar conexão, permitir deixar mensagem
            } else if (!temAgentes) {
              chatService.send(ws, {
                type: "status", 
                msg: "📝 Nossos atendentes estão ocupados no momento. Deixe sua mensagem que responderemos em breve!",
              });
              // Não fechar conexão, permitir deixar mensagem
            }
          }

          chatService.users[currentId] = {
            ws,
            nome: nomeUsuario,
            lastActivity: Date.now(),
          };
          
          if (!chatService.history[currentId]) {
            chatService.history[currentId] = [];
          }

          // Configurar timeout de inatividade
          chatService.updateUserActivity(currentId);

          chatService.send(ws, {
            type: "status",
            msg: `✅ Conectado como ${nomeUsuario}`,
          });
          
          chatService.send(ws, {
            type: "history",
            messages: chatService.history[currentId],
          });

          // Mensagem de boas-vindas personalizada
          if (!isDevelopment) {
            const agentesOnline = Object.keys(chatService.agents).length;
            if (agentesOnline > 0) {
              chatService.send(ws, {
                type: "status",
                msg: `👋 Olá ${nomeUsuario}! Como posso ajudar você hoje? (${agentesOnline} atendente${agentesOnline > 1 ? 's' : ''} disponível${agentesOnline > 1 ? 'is' : ''})`,
              });
            } else {
              chatService.send(ws, {
                type: "status",
                msg: `👋 Olá ${nomeUsuario}! Deixe sua mensagem que responderemos em breve. Seu atendimento é importante para nós!`,
              });
            }
          }

          // Notificar outros usuários sobre entrada (apenas em desenvolvimento)
          if (isDevelopment) {
            Object.entries(chatService.users).forEach(([otherId, otherData]) => {
              if (otherId !== currentId.toString()) {
                chatService.send(otherData.ws, {
                  type: "status",
                  msg: `${nomeUsuario} entrou no chat.`,
                });
              }
            });
          }
          
          chatService.broadcastAgents({
            type: "status",
            msg: `${nomeUsuario} entrou no chat.`,
          });
          chatService.broadcastAgentsList();
        }

        // Atendente
        else if (role === "agent") {
          // Para agentes, usar SEMPRE o id do token para registrar o socket
          currentId = decoded.id;
          chatService.agents[currentId] = ws;

          chatService.send(ws, {
            type: "status",
            msg: "Conectado como atendente.",
          });

          Object.entries(chatService.users).forEach(([userId, userData]) => {
            chatService.send(ws, {
              type: "history",
              userId: userId,
              nome: userData.nome,
              messages: chatService.history[userId],
            });
          });

          chatService.broadcastAgentsList();
        }
      }

      // Ping/Pong para manter conexão ativa
      if (data.type === "ping") {
        chatService.send(ws, { 
          type: "pong", 
          timestamp: data.timestamp || Date.now() 
        });
        return;
      }

      // Mensagens
      if (data.type === "message") {
        //Garantir que a mensagem é uma string e não vazia
        if (typeof data.text !== "string" || data.text.trim() === "") {
          chatService.send(ws, { type: "error", msg: "Mensagem Inválida." });
          return;
        }

        //Limitar o tamanho da mensagem no servidor
        const max_length = 500;
        if (data.text.length > max_length) {
          chatService.send(ws, {
            type: "error",
            msg: "A mensagem é muito longa.",
          });
          return;
        }

        // Bloquear caracteres especiais não permitidos
        const caracPermitido = /^[a-zA-Z0-9À-ú\s.,!?@#-]+$/;
        if (!caracPermitido.test(data.text)) {
          chatService.send(ws, {
            type: "error",
            msg: "A mensagem contém caracteres inválidos.",
          });
          return;
        }

        let newMsg;

        if (role === "user") {
          const nomeUsuario = chatService.users[currentId].nome;
          newMsg = { 
            userId: currentId, 
            fromUserId: currentId,
            nome: nomeUsuario, 
            text: data.text,
            timestamp: new Date().toISOString()
          };

          // Adicionar mensagem ao histórico com limite de 100
          chatService.addMessageToHistory(currentId, newMsg);

          // Atualizar atividade do usuário
          chatService.updateUserActivity(currentId);

          // No modo de desenvolvimento, enviar mensagem para todos os outros usuários conectados
          const isDevelopment = process.env.NODE_ENV === 'development';
          if (isDevelopment) {
            Object.entries(chatService.users).forEach(([otherId, otherData]) => {
              if (otherId !== currentId.toString()) {
                chatService.send(otherData.ws, {
                  type: "message",
                  fromUserId: currentId,
                  text: data.text,
                  nome: nomeUsuario,
                  timestamp: newMsg.timestamp
                });
              }
            });
          }

          // Enviar para agentes também (normalizado com campos no topo)
          chatService.broadcastAgents({
            type: "message",
            userId: currentId,
            fromUserId: currentId,
            nome: nomeUsuario,
            msg: newMsg,
            text: newMsg.text,
            timestamp: newMsg.timestamp,
          });
        }

        if (role === "agent") {
          const targetUser = data.to;
          if (!chatService.users[targetUser]) {
            chatService.send(ws, {
              type: "status",
              msg: `Usuário ${targetUser} não está online.`,
            });
            return;
          }

          newMsg = { 
            userId: currentId, 
            fromUserId: currentId,
            nome: "Atendente", 
            text: data.text,
            timestamp: new Date().toISOString()
          };

          // Adicionar mensagem ao histórico com limite de 100
          chatService.addMessageToHistory(targetUser, newMsg);

          // Enviar para o usuário alvo
          chatService.send(chatService.users[targetUser].ws, {
            type: "message",
            msg: newMsg,
            text: newMsg.text,
            fromUserId: currentId,
            userId: targetUser,
            timestamp: newMsg.timestamp,
          });
          
          // Broadcast para demais atendentes, EXCLUINDO o remetente para evitar duplicação
          chatService.broadcastAgents(
            {
              type: "message",
              userId: targetUser,
              nome: chatService.users[targetUser].nome,
              msg: newMsg,
              text: newMsg.text,
              fromUserId: currentId,
              timestamp: newMsg.timestamp,
            },
            { excludeAgentId: currentId.toString() }
          );
        }
      }

      // Solicitação explícita de histórico (suportar front ao selecionar usuário)
      if (data.type === "getHistory") {
        // Apenas agentes devem solicitar histórico de um usuário específico
        if (role !== "agent") {
          chatService.send(ws, { type: "error", msg: "Apenas agentes podem solicitar histórico." });
          return;
        }

        const userId = data.userId;
        if (!userId) {
          chatService.send(ws, { type: "error", msg: "Parâmetro userId é obrigatório." });
          return;
        }

        const messages = chatService.history[userId] || [];
        chatService.send(ws, {
          type: "history",
          userId,
          messages,
        });
      }

      // Encerrar chat
      if (data.type === "end") {
        const targetUser = role === "user" ? currentId : data.userId;

        if (role === "user") {
          // Usuário encerrando sua própria sessão
          chatService.endUserSession(currentId, "manual");
        } else if (role === "agent") {
          // Agente encerrando sessão de usuário
          if (chatService.users[targetUser]) {
            chatService.send(chatService.users[targetUser].ws, {
              type: "end",
              msg: "Atendimento finalizado pelo agente.",
            });
            chatService.endUserSession(targetUser, "agent_ended");
          }
        }
      }
    } catch (err) {
      logError({
        message: "Erro no processamento da mensagem.",
        userId: currentId,
        chatId: null,
        stack: err.stack,
      });
      try {
        chatService.send(ws, {
          error: "Ocorreu um erro ao processar sua mensagem.",
        });
      } catch (sendErr) {
        logError({
          message: "Falha ao enviar mensagem de erro ao cliente.",
          userId: currentId,
          chatId: null,
          stack: sendErr.stack,
        });
      }
    }
  });

  ws.on("close", () => {
    if (role === "agent") {
      delete chatService.agents[currentId];
      chatService.broadcastAgentsList();
    }

    if (role === "user") {
      // Limpar timeout e encerrar sessão
      chatService.clearUserTimeout(currentId);
      chatService.endUserSession(currentId, "disconnect");
    }
  });
}
