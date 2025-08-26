import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

// Configurações de path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

// Rota padrão → cliente
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cliente.html"));
});

const wss = new WebSocketServer({ server });

let agents = {};   // { agentId: ws }
let users = {};    // { userId: ws }
let history = {};  // { userId: [ { userId, text } ] }
let nextUserId = 1;

function send(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastAgents(data) {
  for (const id in agents) send(agents[id], data);
}

wss.on("connection", (ws) => {
  let role = null;
  let currentId = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === "connect") {
        role = data.role;

        if (role === "user") {
          currentId = `User ${nextUserId++}`;
          users[currentId] = ws;
          history[currentId] = [];

          send(ws, { type: "status", msg: `Conectado como ${currentId}` });
          send(ws, { type: "history", messages: history[currentId] });
          broadcastAgents({ type: "history", userId: currentId, messages: history[currentId] });

        } else if (role === "agent") {
          currentId = data.userId;
          agents[currentId] = ws;
          send(ws, { type: "status", msg: "Conectado como atendente." });
        }

        broadcastAgents({ type: "users", users: Object.keys(users) });
      }

      if (data.type === "message") {
        let newMsg;

        if (role === "user") {
          newMsg = { userId: currentId, text: data.text };
          history[currentId].push(newMsg);
          if (history[currentId].length > 100) history[currentId].shift();

          broadcastAgents({ type: "message", userId: currentId, msg: newMsg });
        }

        if (role === "agent") {
          const targetUser = data.to;
          if (!users[targetUser]) {
            send(ws, { type: "status", msg: `Usuário ${targetUser} não está online.` });
            return;
          }
          newMsg = { userId: currentId, text: data.text };
          history[targetUser].push(newMsg);
          if (history[targetUser].length > 100) history[targetUser].shift();

          send(users[targetUser], { type: "message", msg: newMsg });
          broadcastAgents({ type: "message", userId: targetUser, msg: newMsg });
        }
      }

      if (data.type === "end") {
        const targetUser = role === "user" ? currentId : data.userId;

        // 🔹 Apaga histórico
        if (history[targetUser]) delete history[targetUser];

        if (users[targetUser]) {
          send(users[targetUser], { type: "end", msg: "Atendimento finalizado." });
          delete users[targetUser];
        }

        broadcastAgents({ type: "end", userId: targetUser });
        broadcastAgents({ type: "users", users: Object.keys(users) });
      }

    } catch (err) {
      console.error("Erro:", err);
    }
  });

  ws.on("close", () => {
    if (role === "agent") delete agents[currentId];
    if (role === "user") {
      delete users[currentId];
      delete history[currentId];
      broadcastAgents({ type: "users", users: Object.keys(users) });
      broadcastAgents({ type: "end", userId: currentId });
    }
  });
});

server.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
