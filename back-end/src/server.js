import http from "http";
import app from "./app.js";
import initWebSocket from "./config/websocket.js";

const server = http.createServer(app);
initWebSocket(server);

server.listen(4000, () => {
  console.log("🚀 Servidor rodando em http://localhost:4000");
});