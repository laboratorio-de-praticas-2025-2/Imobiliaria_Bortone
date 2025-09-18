import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Debug para garantir que as variáveis foram carregadas
console.log("🔎 Variáveis do .env:");
console.log("HOST:", process.env.HOST);
console.log("BANCO:", process.env.BANCO);
console.log("USER:", process.env.USER);
console.log("USERPASSWORD:", process.env.USERPASSWORD ? "********" : "NÃO DEFINIDA");

const sequelize = new Sequelize(
  process.env.BANCO,            // Nome do banco
  process.env.USER,             // Usuário
  process.env.USERPASSWORD,     // Senha
  {
    host: process.env.HOST,     // Servidor AlwaysData
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

export default sequelize;
