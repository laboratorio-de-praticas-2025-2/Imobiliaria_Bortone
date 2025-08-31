// Lógica de negócio (ex: regras para cadastro, login, agendamento)

// Estado em memória
let agents = {};   // { agentId: ws }
let users = {};    // { userId: ws }
let history = {};  // { userId: [ { userId, text } ] }
let nextUserId = 1;

// Enviar dados para um socket
function send(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// Broadcast para todos atendentes
function broadcastAgents(data) {
  Object.values(agents).forEach((ws) => send(ws, data));
}

// Atualiza lista de usuários e agentes
function broadcastAgentsList() {
  broadcastAgents({ type: "users", users: Object.keys(users) });
  broadcastAgents({ type: "agents", agents: Object.keys(agents) });
}

export default {
  agents,
  users,
  history,
  getNextUserId: () => `Usuário ${nextUserId++}`,
  send,
  broadcastAgents,
  broadcastAgentsList
};