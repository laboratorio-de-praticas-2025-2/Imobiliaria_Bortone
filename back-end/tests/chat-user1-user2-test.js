/*
  Teste para conectar user1 (nível 1) com user2 (nível 0)
  User1 é um usuário normal que precisa de suporte
  User2 é um agente/atendente que vai fornecer suporte

  Execute com: node chat-user1-user2-test.js
*/
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

const SERVER = process.env.WS_URL || 'ws://localhost:4000';
const SECRET = process.env.JWT_SECRET || 'fatec2024';

// User1: usuário normal (nível 1)
const tokenUser1 = jwt.sign({ 
  id: 1, 
  nivel: 1, 
  nome: 'User1 Cliente',
  email: 'user1@test.com'
}, SECRET);

// User2: agente/atendente (nível 0) 
const tokenUser2 = jwt.sign({ 
  id: 2, 
  nivel: 0, 
  nome: 'User2 Agente',
  email: 'user2@test.com'
}, SECRET);

console.log('🔗 Conectando User1 (cliente) e User2 (agente)...');
console.log('User1 Token:', tokenUser1);
console.log('User2 Token:', tokenUser2);

// Conectar User1 (cliente)
const wsUser1 = new WebSocket(`${SERVER}?token=${tokenUser1}`);
wsUser1.on('open', () => {
  console.log('✅ User1 (cliente) conectado');
  
  // Enviar mensagem de conexão
  wsUser1.send(JSON.stringify({
    type: 'connect',
    token: tokenUser1,
    nome: 'User1 Cliente'
  }));
  
  // Enviar uma mensagem após conectar
  setTimeout(() => {
    wsUser1.send(JSON.stringify({
      type: 'message',
      text: 'Olá! Preciso de ajuda com um imóvel.'
    }));
  }, 1000);
});

wsUser1.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log('📨 User1 recebeu:', msg);
});

wsUser1.on('error', (error) => {
  console.error('❌ Erro User1:', error);
});

// Conectar User2 (agente) após 2 segundos
setTimeout(() => {
  const wsUser2 = new WebSocket(`${SERVER}?token=${tokenUser2}`);
  
  wsUser2.on('open', () => {
    console.log('✅ User2 (agente) conectado');
    
    // Enviar mensagem de conexão como agente
    wsUser2.send(JSON.stringify({
      type: 'connect',
      token: tokenUser2,
      userId: 2 // ID do agente
    }));
    
    // Agente responde ao cliente após 3 segundos
    setTimeout(() => {
      wsUser2.send(JSON.stringify({
        type: 'message',
        text: 'Olá! Sou o User2, como posso ajudar você?',
        to: 1 // Enviar para User1
      }));
    }, 3000);
  });
  
  wsUser2.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('📨 User2 recebeu:', msg);
  });
  
  wsUser2.on('error', (error) => {
    console.error('❌ Erro User2:', error);
  });
  
}, 2000);

// Manter o processo ativo
setTimeout(() => {
  console.log('🏁 Teste finalizado');
  process.exit(0);
}, 10000);