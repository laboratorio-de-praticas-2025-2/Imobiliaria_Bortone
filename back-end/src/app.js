import express from "express";
const app = express();
import cors from "cors";

import connection from "./config/sequelize-config.js";

import faqRoutes from "./routes/faqRoutes.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/faq", faqRoutes);

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