// Definição dos modelos de dados (ex: Usuario, Imovel, Agendamento)

import chatService from "../services/chatService.js";
import { dentroHorario } from "../utils/timeUtils.js";

export function handleConnection(ws) {
  let role = null;
  let currentId = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // Conexão inicial
      if (data.type === "connect") {
        role = data.role;

        // Usuário
        if (role === "user") {
          currentId = chatService.getNextUserId();
          const nomeUsuario = data.nome || `Usuário ${currentId}`;

          if (
            !dentroHorario() ||
            Object.keys(chatService.agents).length === 0
          ) {
            chatService.send(ws, {
              type: "status",
              msg: "Atendimento indisponível, tente novamente mais tarde.",
            });
            ws.close();
            return;
          }

          if (Object.keys(chatService.users).length >= 3) {
            chatService.send(ws, {
              type: "status",
              msg: "Limite de usuários simultâneos atingido. Tente novamente mais tarde.",
            });
            ws.close();
            return;
          }

          chatService.users[currentId] = { 
            ws, 
            nome: nomeUsuario, 
            lastActivity: Date.now() 
          };
          chatService.history[currentId] = [];
          
          // Configurar timeout de inatividade
          chatService.updateUserActivity(currentId);

          chatService.send(ws, {
            type: "status",
            msg: `Conectado como ${nomeUsuario}`,
          });
          chatService.send(ws, {
            type: "history",
            messages: chatService.history[currentId],
          });

          if (Object.keys(chatService.agents).length === 0) {
            chatService.send(ws, {
              type: "status",
              msg: "Nenhum atendente disponível no momento, aguarde...",
            });
          }

          chatService.broadcastAgents({
            type: "history",
            userId: currentId,
            nome: nomeUsuario,
            messages: chatService.history[currentId],
          });
          chatService.broadcastAgents({
            type: "status",
            msg: `${nomeUsuario} entrou no chat.`,
          });
          chatService.broadcastAgentsList();
        }

        // Atendente
        else if (role === "agent") {
          currentId = data.userId;
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

      // Mensagens
      if (data.type === "message") {
        let newMsg;

        if (role === "user") {
          const nomeUsuario = chatService.users[currentId].nome;
          newMsg = { userId: currentId, nome: nomeUsuario, text: data.text };
          
          // Adicionar mensagem ao histórico com limite de 100
          chatService.addMessageToHistory(currentId, newMsg);

          // Atualizar atividade do usuário
          chatService.updateUserActivity(currentId);

          chatService.broadcastAgents({
            type: "message",
            userId: currentId,
            nome: nomeUsuario,
            msg: newMsg,
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

          newMsg = { userId: currentId, nome: "Atendente", text: data.text };
          
          // Adicionar mensagem ao histórico com limite de 100
          chatService.addMessageToHistory(targetUser, newMsg);

          chatService.send(chatService.users[targetUser].ws, {
            type: "message",
            msg: newMsg,
          });
          // Broadcast para demais atendentes, mas não ecoar para o remetente
          chatService.broadcastAgents(
            { type: "message", userId: targetUser, nome: chatService.users[targetUser].nome, msg: newMsg },
            { excludeAgentId: currentId }
          );
        }
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
      console.error("Erro:", err);
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
