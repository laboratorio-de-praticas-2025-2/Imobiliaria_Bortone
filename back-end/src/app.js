import express from "express";

const app = express();

import connection from "./config/sequelize-config.js";

import faqRoutes from "./routes/faqRoutes.js";

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

app.listen(3306, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro! Erro: ", erro);
  } else {
    console.log("Servidor iniciado com sucesso!");
  }
});