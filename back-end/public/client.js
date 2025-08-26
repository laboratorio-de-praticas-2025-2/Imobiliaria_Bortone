const ws = new WebSocket("ws://localhost:3000");
const chat = document.getElementById("chat");
let userId = null;

ws.onopen = () => ws.send(JSON.stringify({ type: "connect", role: "user" }));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "status") {
    addMessage("Sistema", data.msg);
    if (!userId && data.msg.includes("Conectado como")) {
      userId = data.msg.split("Conectado como ")[1];
    }
  }

  if (data.type === "history") data.messages.forEach(m => addMessage("Você", m.text));
  if (data.type === "message") addMessage("Atendente", data.msg.text);
  if (data.type === "end") {
    addMessage("Sistema", data.msg);
    chat.innerHTML = ""; // 🔹 limpa histórico local ao encerrar
  }
};

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.textContent = `${sender}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("msg");
  if (input.value.trim() !== "") {
    ws.send(JSON.stringify({ type: "message", text: input.value }));
    addMessage("Você", input.value);
    input.value = "";
  }
}

function endChat() {
  ws.send(JSON.stringify({ type: "end" }));
  chat.innerHTML = ""; // 🔹 limpa histórico local
}

// 🔹 Enviar com Enter
document.getElementById("msg").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// 🔹 Enviar "end" ao fechar aba
window.addEventListener("beforeunload", () => {
  ws.send(JSON.stringify({ type: "end" }));
});
