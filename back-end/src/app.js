import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from 'http';

// Configurações e serviços
import connection from "./config/sequelize-config.js";
import SocketManager from './services/socketManager.js';
import { setSocketManager } from './utils/socketHelper.js';
import { errorHandler } from "./middlewares/errorHandler.js";
import "./models/Associations.js";

// Importar todas as rotas
import healthRouter from "./routes/route.js";
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

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar servidor HTTP
const server = createServer(app);

// Inicializar SocketManager
const socketManager = new SocketManager(server);

// Tornar socketManager disponível globalmente
app.set('socketManager', socketManager);
setSocketManager(socketManager);

// ----------------------
// Middlewares
// ----------------------
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir arquivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rotas

app.use('/', recomendacaoRouter);
app.use("/api/socket", socketRoutes);
app.use('/banner', bannerRoutes);
app.use('/user', userRoutes );
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
app.use("/publicacoes", blogRoutes);
app.use('/publicidade', publicidadeRoutes);

app.use(express.static(path.join(__dirname, "../public")));
app.use('/images', express.static(path.join(__dirname, '../../front-end/public/images')));
app.use(errorHandler);

const server = http.createServer(app);
initWebSocket(server);


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