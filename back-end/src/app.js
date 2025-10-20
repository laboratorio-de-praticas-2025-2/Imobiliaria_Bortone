import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { createServer } from 'http';
import initWebSocket from './config/websocket.js';

// Configurações e serviços
import connection from "./config/sequelize-config.js";
import SocketManager from './services/socketManager.js';
import { setSocketManager } from './utils/socketHelper.js';
import { errorHandler } from "./middlewares/errorHandler.js";
import "./models/Associations.js";

// Importar todas as rotas
import healthRouter from "./routes/healthRouter.js";
import socketRoutes from './routes/socketRoutes.js';
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from './routes/userRoutes.js';
import searchRouter from "./routes/imovelSearchRoutes.js";
import agendamentoRouter from "./routes/agendamentoRoute.js";
import recomendacaoRouter from "./routes/recomendacaoImovelRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import relatorioRouter from './routes/reportsRoute.js';
import mapaRoutes from "./routes/mapaRoutes.js";
import imoveisRouter from "./routes/ImoveisRouter.js";
import imagemImovelRoutes from "./routes/imagemImovelRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import bannerRoutes from './routes/bannerRoutes.js';
import publicidadeRoutes from "./routes/publicidadeRoutes.js";
import simuladorRoutes from "./routes/simuladorRoutes.js";

const app = express();

// ----------------------
// Middlewares
// ----------------------
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Servir arquivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar servidor HTTP
const server = createServer(app);

// Inicializar SocketManager
const socketManager = new SocketManager(server);
// Inicializar WebSocket
initWebSocket(server);

// Tornar socketManager disponível globalmente
app.set('socketManager', socketManager);
setSocketManager(socketManager);

socketManager.io.on("connection_error", (err) => {
  console.log("🚨 Socket connection error:", err.req?.url || 'URL não disponível');
  console.log("🚨 Socket error code:", err.code);
  console.log("🚨 Socket error message:", err.message);
  console.log("🚨 Socket error context:", err.context);
});





// Rotas

app.use("/api/socket", socketRoutes);
app.use('/banner', bannerRoutes);
app.use('/user', userRoutes);
app.use("/search", searchRouter);
app.use("/agendamentos", agendamentoRouter);
app.use("/health", healthRouter);
app.use("/faq", faqRoutes);
app.use("/relatorios", relatorioRouter)
app.use("/mapa", mapaRoutes);
app.use('/dashboard', dashboardRouter);
app.use("/publicacoes", blogRoutes);
app.use('/imoveis', imoveisRouter);
app.use('/imagemImovel', imagemImovelRoutes);
app.use('/publicidade', publicidadeRoutes);
app.use('/simulador', simuladorRoutes);

app.use(express.static(path.join(__dirname, "../public")));
app.use('/images', express.static(path.join(__dirname, '../../front-end/public/images')));

app.use('/', recomendacaoRouter);

app.use(errorHandler);


// ----------------------
// Banco de dados
// ----------------------
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.log("Erro ao conectar com banco de dados:", error);
  });

// ----------------------
// Inicializar servidor
// ----------------------
const PORT = process.env.PORT || 4000;

server.listen(PORT, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}!`);
    console.log(`Socket.IO habilitado para comunicação em tempo real`);
  }
});