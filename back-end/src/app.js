import express from "express";
// Exemplo de como importar rotas
// import publicidadeRoutes from "./routes/publicidadeRoutes.js"; 

const app = express();

import connection from "./config/sequelize-config.js";

// Middlewares
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: false }));

// Rotas
// Exemplo de como usar as rotas
// app.use("/api", publicidadeRoutes); 


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


