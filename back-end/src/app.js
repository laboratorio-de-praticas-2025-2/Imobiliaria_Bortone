import express from "express";

const app = express();

import userRoutes from './routes/userRoutes.js'

import connection from "./config/sequelize-config.js";

app.use(express.urlencoded({ extended: false }));

app.use('/', userRoutes)

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3306, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log("Servidor iniciado com sucesso!");
  }
});
