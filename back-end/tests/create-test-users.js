/*
  Script para criar usuários de teste no banco de dados
  Execute com: node create-test-users.js
*/
import bcrypt from "bcrypt";
import User from "../src/models/Usuario.js";
import connection from "../src/config/sequelize-config.js";

async function createTestUsers() {
  try {
    console.log("🔗 Conectando ao banco de dados...");
    await connection.authenticate();
    
    // Sincronizar modelo (criar tabela se não existir)
    await User.sync();
    
    // Usuários de teste
    const testUsers = [
      {
        nome: "Admin User",
        email: "admin@test.com",
        senha: "admin123",
        nivel: 0, // Administrador/Agente
        celular: "(11) 99999-0000"
      },
      {
        nome: "User Normal",
        email: "user@test.com", 
        senha: "user123",
        nivel: 1, // Usuário normal
        celular: "(11) 99999-1111"
      }
    ];
    
    console.log("👥 Criando usuários de teste...");
    
    for (const userData of testUsers) {
      // Verificar se usuário já existe
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`⚠️  Usuário ${userData.email} já existe`);
        continue;
      }
      
      // Criptografar senha
      const hashedPassword = await bcrypt.hash(userData.senha, 10);
      
      // Criar usuário
      await User.create({
        nome: userData.nome,
        email: userData.email,
        senha: hashedPassword,
        nivel: userData.nivel,
        celular: userData.celular
      });
      
      console.log(`✅ Usuário criado: ${userData.email} (nível ${userData.nivel})`);
    }
    
    console.log("🎉 Usuários de teste criados com sucesso!");
    console.log("");
    console.log("📋 Credenciais para teste:");
    console.log("Admin (nível 0): admin@test.com / admin123");
    console.log("User (nível 1): user@test.com / user123");
    
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await connection.close();
    process.exit(0);
  }
}

createTestUsers();