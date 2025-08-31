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

          chatService.users[currentId] = ws;
          chatService.history[currentId] = [];

          chatService.send(ws, { type: "status", msg: `Conectado como ${currentId}` });
          chatService.send(ws, { type: "history", messages: chatService.history[currentId] });

          if (Object.keys(chatService.agents).length === 0) {
            chatService.send(ws, {
              type: "status",
              msg: "Nenhum atendente disponível no momento, aguarde...",
            });
          }

          chatService.broadcastAgents({
            type: "history",
            userId: currentId,
            messages: chatService.history[currentId],
          });
          chatService.broadcastAgents({ type: "status", msg: `${currentId} entrou no chat.` });
          chatService.broadcastAgentsList();
        }

        // Atendente
        else if (role === "agent") {
          currentId = data.userId;
          chatService.agents[currentId] = ws;

          chatService.send(ws, { type: "status", msg: "Conectado como atendente." });

          Object.keys(chatService.users).forEach((user) => {
            chatService.send(ws, {
              type: "history",
              userId: user,
              messages: chatService.history[user],
            });
          });

          chatService.broadcastAgentsList();
        }
      }

      // Mensagens
      if (data.type === "message") {
        let newMsg;

        if (role === "user") {
          newMsg = { userId: currentId, text: data.text };
          chatService.history[currentId].push(newMsg);
          if (chatService.history[currentId].length > 100) chatService.history[currentId].shift();

          chatService.broadcastAgents({ type: "message", userId: currentId, msg: newMsg });
        }

        if (role === "agent") {
          const targetUser = data.to;
          if (!chatService.users[targetUser]) {
            chatService.send(ws, { type: "status", msg: `Usuário ${targetUser} não está online.` });
            return;
          }

          newMsg = { userId: currentId, text: data.text };
          chatService.history[targetUser].push(newMsg);
          if (chatService.history[targetUser].length > 100) chatService.history[targetUser].shift();

          chatService.send(chatService.users[targetUser], { type: "message", msg: newMsg });
          chatService.broadcastAgents({ type: "message", userId: targetUser, msg: newMsg });
        }
      }

      // Encerrar chat
      if (data.type === "end") {
        const targetUser = role === "user" ? currentId : data.userId;

        if (chatService.history[targetUser]) delete chatService.history[targetUser];
        if (chatService.users[targetUser]) {
          chatService.send(chatService.users[targetUser], {
            type: "end",
            msg: "Atendimento finalizado.",
          });
          delete chatService.users[targetUser];
        }

        chatService.broadcastAgents({ type: "end", userId: targetUser });
        chatService.broadcastAgentsList();
        chatService.broadcastAgents({ type: "status", msg: `${targetUser} saiu do chat.` });
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
      delete chatService.users[currentId];
      delete chatService.history[currentId];
      chatService.broadcastAgents({ type: "users", users: Object.keys(chatService.users) });
      chatService.broadcastAgents({ type: "end", userId: currentId });
      chatService.broadcastAgents({ type: "status", msg: `${currentId} saiu do chat.` });
    }
  });
}