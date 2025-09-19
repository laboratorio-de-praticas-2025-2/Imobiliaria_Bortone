import "dotenv/config";
import express from "express";
import cors from "cors";
import connection from "./config/sequelize-config.js";
import userRoutes from './routes/userRoutes.js'
import "./models/Associations.js";
import searchRouter from "./routes/imovelSearchRoutes.js";
import agendamentoRouter from "./routes/agendamentoRoute.js";
import recomendacaoRouter from "./routes/recomendacaoImovelRoutes.js";
import healthRouter from "./routes/healthRouter.js";
import faqRoutes from "./routes/faqRoutes.js";
import mapaRoutes from "./routes/mapaRoutes.js";
import imoveisRouter from "./routes/ImoveisRouter.js";
import imagemImovelRoutes from "./routes/imagemImovelRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import initWebSocket from "./config/websocket.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rotas

app.use('/', recomendacaoRouter);
app.use('/user', userRoutes );
app.use("/search", searchRouter);
app.use("/agendamentos", agendamentoRouter);
app.use("/health", healthRouter);
app.use("/faq", faqRoutes);
app.use("/mapa", mapaRoutes);
app.use('/dashboard', dashboardRouter);
app.use('/imoveis', imoveisRouter);
app.use('/imagensimoveis', imagemImovelRoutes);

app.use(express.static(path.join(__dirname, "../public")));
app.use(errorHandler);

const server = http.createServer(app);
initWebSocket(server);

// Banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.log("Erro ao conectar com banco de dados:", error);
  });

// Porta
const PORT = process.env.PORT || 4000;
app.listen(PORT, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}! 🚀`);
  }
});
