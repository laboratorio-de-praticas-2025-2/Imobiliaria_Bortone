import express from "express";
import cors from "cors";
import connection from "./config/sequelize-config.js";
 import blogRoutes from "./routes/blogRoutes.js"; 

const app = express();


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


app.use("/", blogRoutes);


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

