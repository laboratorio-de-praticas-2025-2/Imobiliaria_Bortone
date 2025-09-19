// Lógica de negócio (ex: regras para cadastro, login, agendamento)
import { randomUUID } from "crypto";

// Estado em memória
let agents = {}; // { agentId: ws }
let users = {}; // { userId: { ws, nome, lastActivity } }
let history = {}; // { userId: [ { userId, nome, text } ] }
let timeouts = {}; // { userId: timeout }

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

// Enviar dados para um socket
function send(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// Broadcast para todos atendentes
function broadcastAgents(data, options = {}) {
  const { excludeAgentId } = options;
  Object.entries(agents).forEach(([agentId, ws]) => {
    if (excludeAgentId && agentId === excludeAgentId) return;
    send(ws, data);
  });
}

// Atualiza lista de usuários e agentes
function broadcastAgentsList() {
  const userList = Object.entries(users).map(([userId, userData]) => ({
    userId,
    nome: userData.nome,
  }));
  broadcastAgents({ type: "users", users: userList });
  broadcastAgents({ type: "agents", agents: Object.keys(agents) });
}

// Atualizar atividade do usuário e resetar timeout
function updateUserActivity(userId) {
  if (users[userId]) {
    users[userId].lastActivity = Date.now();

    // Resetar timeout
    if (timeouts[userId]) {
      clearTimeout(timeouts[userId]);
    }

    timeouts[userId] = setTimeout(() => {
      endUserSession(userId, "timeout");
    }, INACTIVITY_TIMEOUT);
  }
}

// Encerrar sessão de usuário por timeout ou desconexão
function endUserSession(userId, reason = "disconnect") {
  if (users[userId]) {
    const userData = users[userId];

    // Notificar agentes sobre desconexão
    broadcastAgents({
      type: "userDisconnected",
      userId: userId,
      nome: userData.nome,
      reason: reason,
    });

    // Fechar conexão se ainda estiver aberta
    if (userData.ws && userData.ws.readyState === userData.ws.OPEN) {
      userData.ws.close();
    }

    // Limpar dados
    delete users[userId];
    delete history[userId];
    delete timeouts[userId];

    // Atualizar lista de usuários para agentes
    broadcastAgentsList();

    console.log(`Usuário ${userData.nome} (${userId}) desconectado: ${reason}`);
  }
}

// Limpar timeout de usuário
function clearUserTimeout(userId) {
  if (timeouts[userId]) {
    clearTimeout(timeouts[userId]);
    delete timeouts[userId];
  }
}

// Adicionar mensagem ao histórico com limite de 100
function addMessageToHistory(userId, message) {
  if (!history[userId]) {
    history[userId] = [];
  }
  
  history[userId].push(message);
  
  // Manter apenas as últimas 100 mensagens
  if (history[userId].length > 100) {
    history[userId] = history[userId].slice(-100);
  }
}

export default {
  agents,
  users,
  history,
  timeouts,
  getNextUserId: () => `user-${randomUUID().slice(0, 8)}`,
  send,
  broadcastAgents,
  broadcastAgentsList,
  updateUserActivity,
  endUserSession,
  clearUserTimeout,
  addMessageToHistory,
};
