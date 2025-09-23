/*
  Teste manual: simular dois clientes WebSocket com tokens de usuário (nivel=1)
  Configure JWT_SECRET no .env do backend. Gere dois tokens dummy para teste local:

  const jwt = require('jsonwebtoken');
  const s = 'secret';
  const t1 = jwt.sign({ id: 101, nivel: 1, nome: 'User 101' }, s);
  const t2 = jwt.sign({ id: 102, nivel: 1, nome: 'User 102' }, s);

  Execute com: node ws-two-clients.test.js
*/
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

const SERVER = process.env.WS_URL || 'ws://localhost:4000';
const SECRET = process.env.JWT_SECRET || 'secret';

const tokenA = jwt.sign({ id: 101, nivel: 1, nome: 'User 101' }, SECRET);
const tokenB = jwt.sign({ id: 102, nivel: 1, nome: 'User 102' }, SECRET);

function connect(token, nome) {
  return new Promise((resolve) => {
    const ws = new WebSocket(`${SERVER}?token=${token}`);
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'connect', token, nome }));
      resolve(ws);
    });
    ws.on('error', (e) => console.error('WS error', nome, e));
    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg.toString());
        console.log(`[${nome}] <-`, data);
      } catch {}
    });
  });
}

(async () => {
  const a = await connect(tokenA, 'User 101');
  const b = await connect(tokenB, 'User 102');

  // Aguarda um pouco para histórico/status
  await new Promise((r) => setTimeout(r, 500));

  // A envia para todos (em dev backend também broadcasta para outros users)
  a.send(JSON.stringify({ type: 'message', text: 'Olá do A', fromUserId: 101 }));

  await new Promise((r) => setTimeout(r, 500));

  // B responde
  b.send(JSON.stringify({ type: 'message', text: 'Oi A, aqui é B', fromUserId: 102 }));

  await new Promise((r) => setTimeout(r, 1000));
  a.close();
  b.close();
})();
