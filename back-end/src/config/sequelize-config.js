import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Debug para garantir que as variáveis foram carregadas
console.log("🔎 Variáveis do .env:");
console.log("HOST:", process.env.DB_HOST);
console.log("BANCO:", process.env.DB_DATABASE);
console.log("USER:", process.env.DB_USER);
console.log("USERPASSWORD:", process.env.DB_PASS ? "********" : "NÃO DEFINIDA");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,            // Nome do banco
  process.env.DB_USER,             // Usuário
  process.env.DB_PASS,     // Senha
  {
    host: process.env.DB_HOST,     // Servidor AlwaysData
    port: 3306,                 // Porta padrão MySQL
    dialect: "mysql",           // Dialeto
    logging: false,             // Oculta logs SQL no console
  }
);

// Teste de conexão (opcional, mas recomendado)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error.message);
  }
})();

export default connection;