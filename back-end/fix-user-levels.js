import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const fixUserLevels = async () => {
  try {
    console.log("🔧 Iniciando correção dos níveis de usuário...");
    
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.USERPASSWORD,
      database: process.env.BANCO
    });

    // 1. Verificar usuários atuais
    console.log("\n📊 Verificando usuários atuais:");
    const [currentUsers] = await connection.execute(
      'SELECT id, nome, email, nivel FROM usuarios WHERE email IN (?, ?)',
      ['admin@test.com', 'user@test.com']
    );

    currentUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.nome} (nível: ${user.nivel})`);
    });

    // 2. Corrigir ou criar usuário admin (nível 0)
    const adminExists = currentUsers.find(u => u.email === 'admin@test.com');
    if (adminExists) {
      if (adminExists.nivel !== 0) {
        await connection.execute(
          'UPDATE usuarios SET nivel = 0 WHERE email = ?',
          ['admin@test.com']
        );
        console.log("✅ Nível do admin@test.com corrigido para 0");
      } else {
        console.log("ℹ️ admin@test.com já tem nível 0");
      }
    } else {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await connection.execute(
        'INSERT INTO usuarios (nome, email, senha, nivel, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        ['Admin User', 'admin@test.com', hashedPassword, 0]
      );
      console.log("✅ Usuário admin@test.com criado com nível 0");
    }

    // 3. Corrigir ou criar usuário comum (nível 1)
    const userExists = currentUsers.find(u => u.email === 'user@test.com');
    if (userExists) {
      if (userExists.nivel !== 1) {
        await connection.execute(
          'UPDATE usuarios SET nivel = 1 WHERE email = ?',
          ['user@test.com']
        );
        console.log("✅ Nível do user@test.com corrigido para 1");
      } else {
        console.log("ℹ️ user@test.com já tem nível 1");
      }
    } else {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await connection.execute(
        'INSERT INTO usuarios (nome, email, senha, nivel, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        ['User Test', 'user@test.com', hashedPassword, 1]
      );
      console.log("✅ Usuário user@test.com criado com nível 1");
    }

    // 4. Verificar resultado final
    console.log("\n📊 Estado final dos usuários:");
    const [finalUsers] = await connection.execute(
      'SELECT id, nome, email, nivel FROM usuarios WHERE email IN (?, ?)',
      ['admin@test.com', 'user@test.com']
    );

    finalUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.nome} (nível: ${user.nivel}) ${user.nivel === 0 ? '🔧 AGENTE' : '👤 USUÁRIO'}`);
    });

    await connection.end();
    console.log("\n✅ Correção concluída!");

  } catch (error) {
    console.error("❌ Erro na correção:", error.message);
    
    // Se falhar, vamos tentar uma abordagem alternativa
    console.log("\n🔄 Tentando via API local...");
    await testViaAPI();
  }
};

const testViaAPI = async () => {
  try {
    // Fazer login para verificar o que está sendo retornado
    const response = await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        senha: '123456'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🔍 Resposta do login:", data);
      console.log("🔍 Nível retornado:", data.user?.nivel, typeof data.user?.nivel);
    } else {
      console.log("❌ Erro no login:", response.status, response.statusText);
    }
  } catch (error) {
    console.log("❌ Erro na conexão com API:", error.message);
    console.log("\n💡 Solução: Certifique-se de que o backend está rodando na porta 4000");
  }
};

fixUserLevels();