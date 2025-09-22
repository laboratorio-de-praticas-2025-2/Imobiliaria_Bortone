import express from "express";
import router from './routes/recomendacaoImovelRoutes.js';
import cors from "cors";
import connection from "./config/sequelize-config.js";
import { createServer } from 'http';
import SocketManager from './services/socketManager.js';
import { setSocketManager } from './utils/socketHelper.js';
import socketRoutes from './routes/socketRoutes.js';
// Exemplo de como importar rotas
import healthRouter from "./routes/route.js"; 

const app = express();

// Criar servidor HTTP
const server = createServer(app);

// Inicializar SocketManager
const socketManager = new SocketManager(server);

// Tornar socketManager disponível globalmente
app.set('socketManager', socketManager);
setSocketManager(socketManager);

// Middlewares
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: false }));

// Rotas
// Exemplo de como usar as rotas
app.use("/", router, healthRouter);
app.use("/api/socket", socketRoutes);

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT || 4000;

server.listen(PORT, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}!`);
    console.log(`Socket.IO habilitado para comunicação em tempo real`);
  }
});

// // Exemplo para produção
// Para um ambiente de produção, é uma boa prática restringir as origens permitidas, como no exemplo abaixo:
// const corsOptions = {
//   origin: 'https://imobiliaria-bortone.vercel.app' // Substitua pelo domínio do seu frontend
// };

// app.use(cors(corsOptions));
