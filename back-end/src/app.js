import express from "express";
import cors from "cors";
import connection from "./config/sequelize-config.js";
// Exemplo de como importar rotas
 import healthRouter from "./routes/route.js"; 

const app = express();


// Middlewares
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: false }));


// Rotas
// Exemplo de como usar as rotas
app.use("/", healthRouter);


connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT || 4000;

app.listen(PORT, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log(`Servidor iniciado com sucesso na porta ${PORT}!`);
  }
});

// // Exemplo para produção
// Para um ambiente de produção, é uma boa prática restringir as origens permitidas, como no exemplo abaixo:
// const corsOptions = {
//   origin: 'https://imobiliaria-bortone.vercel.app' // Substitua pelo domínio do seu frontend
// };

// app.use(cors(corsOptions));
