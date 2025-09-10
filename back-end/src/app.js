// Configuração principal do Express (carrega rotas, middlewares, DB)

import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import initWebSocket from "./config/websocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", routes);
app.use(errorHandler);

const server = http.createServer(app);
initWebSocket(server);

server.listen(4000, () => {
  console.log("🚀 Servidor rodando em http://localhost:4000");
});

export default app;
