import 'dotenv/config';
import express from "express";
import cors from "cors";
import connection from "./config/sequelize-config.js";
import agendamentoRouter from './routes/agendamentoRoute.js';
import recomendacaoRouter from './routes/recomendacaoImovelRoutes.js';
import healthRouter from "./routes/healthRouter.js";
import faqRoutes from "./routes/faqRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();



// Middlewares
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rotas
app.use('/', recomendacaoRouter);
app.use('/agendamentos', agendamentoRouter );
app.use('/health', healthRouter);
app.use("/faq", faqRoutes);
app.use('/dashboard', dashboardRouter);

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
