import express from "express";
import router from './routes/recomendacaoImovelRoutes.js';
import connection from "./config/sequelize-config.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/', router);

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
