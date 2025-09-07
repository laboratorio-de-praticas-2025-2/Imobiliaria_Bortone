import 'dotenv/config';
import express from "express";
import agendamentoRouter from './routes/agendamentoRouter.js';

const app = express();

import connection from "./config/sequelize-config.js";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => res.send('API rodando 🚀'));
app.use('/agendamentos', agendamentoRouter);

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log("Servidor iniciado com sucesso!");
  }
});
