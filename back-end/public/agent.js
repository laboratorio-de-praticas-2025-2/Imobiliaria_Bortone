const agentId = "atendente01";
const ws = new WebSocket("ws://localhost:3000");

const chat = document.getElementById("chat");
const usersDiv = document.getElementById("users");

let activeUser = null;
let localHistory = {};

ws.onopen = () => ws.send(JSON.stringify({ type: "connect", role: "agent", userId: agentId }));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "status") addMessage("Sistema", data.msg);
  if (data.type === "users") renderUserTabs(data.users);

  if (data.type === "history") {
    localHistory[data.userId] = data.messages;
    if (activeUser === data.userId) renderChat(activeUser);
  }

  if (data.type === "message") {
    if (!localHistory[data.userId]) localHistory[data.userId] = [];
    localHistory[data.userId].push(data.msg);
    if (localHistory[data.userId].length > 100) localHistory[data.userId].shift(); // 🔹 Limite de 100

    if (data.msg.userId !== agentId) {
      if (activeUser === data.userId) addMessage("Cliente " + data.userId, data.msg.text);
      showNotification(`Cliente ${data.userId} te enviou uma mensagem!`);
    }
  }

  if (data.type === "end") {
    addMessage("Sistema", `Atendimento com usuário ${data.userId} finalizado.`);
    delete localHistory[data.userId]; // 🔹 Limpa histórico local
    if (activeUser === data.userId) {
      chat.innerHTML = "";
      activeUser = null;
    }
    renderUserTabs(Object.keys(localHistory));
  }
};

function renderUserTabs(users) {
  usersDiv.innerHTML = "Usuários online: ";
  users.forEach(u => {
    const btn = document.createElement("button");
    btn.textContent = u;
    btn.style.background = u === activeUser ? "#555" : "#eee";
    btn.style.color = u === activeUser ? "#fff" : "#000";
    btn.onclick = () => {
      activeUser = u;
      renderChat(u);
      renderUserTabs(users);
    };
    usersDiv.appendChild(btn);
  });
}

function renderChat(userId) {
  chat.innerHTML = "";
  if (localHistory[userId]) {
    localHistory[userId].forEach(m => {
      addMessage(m.userId === agentId ? "Você" : "Cliente " + m.userId, m.text);
    });
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.textContent = `${sender}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("msg");
  if (input.value.trim() !== "" && activeUser) {
    ws.send(JSON.stringify({ type: "message", to: activeUser, text: input.value }));

    if (!localHistory[activeUser]) localHistory[activeUser] = [];
    localHistory[activeUser].push({ userId: agentId, text: input.value });
    if (localHistory[activeUser].length > 100) localHistory[activeUser].shift(); // 🔹 Limite de 100

    addMessage("Você", input.value);
    input.value = "";
  }
}

// 🔹 Enviar com Enter
document.getElementById("msg").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function endChat() {
  if (activeUser) {
    ws.send(JSON.stringify({ type: "end", userId: activeUser }));
    addMessage("Sistema", `Você encerrou atendimento com cliente ${activeUser}.`);
    delete localHistory[activeUser];
    chat.innerHTML = "";
    activeUser = null;
    renderUserTabs(Object.keys(localHistory));
  }
}

function showNotification(text) {
  let notif = document.getElementById("notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "notification";
    notif.style.position = "fixed";
    notif.style.top = "10px";
    notif.style.right = "10px";
    notif.style.background = "yellow";
    notif.style.padding = "10px";
    notif.style.borderRadius = "5px";
    notif.style.boxShadow = "0 0 5px #333";
    notif.style.fontWeight = "bold";
    document.body.appendChild(notif);
  }

  notif.textContent = text;
  notif.style.display = "block";
  setTimeout(() => { notif.style.display = "none"; }, 3000);
}
