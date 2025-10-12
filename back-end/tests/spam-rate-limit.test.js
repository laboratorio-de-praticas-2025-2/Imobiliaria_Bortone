/*
  Teste manual: verifica que mensagens enviadas em intervalo menor que 3s são bloqueadas.
  Executar com: node spam-rate-limit.test.js
  Requer que o backend esteja rodando em NODE_ENV=development (para aceitar testUserId)
*/
import WebSocket from "ws";

const SERVER = process.env.WS_URL || "ws://localhost:4000";

function connectTestUser(id) {
  return new Promise((resolve) => {
    const ws = new WebSocket(`${SERVER}?testUserId=${id}`);
    ws.on("open", () => {
      resolve(ws);
    });
    ws.on("error", (e) => console.error("WS error", e));
    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());
        console.log(`[TestUser ${id}] <-`, data);
      } catch (err) {
        console.log("Mensagem não-JSON:", msg.toString());
      }
    });
  });
}

(async () => {
  const ws = await connectTestUser(999);
  // enviar primeira mensagem (deve passar)
  ws.send(JSON.stringify({ type: "connect", nome: "Tester 999" }));
  await new Promise((r) => setTimeout(r, 200));
  ws.send(JSON.stringify({ type: "message", text: "Primeira mensagem" }));

  // enviar segunda mensagem quase imediatamente (deve ser bloqueada)
  await new Promise((r) => setTimeout(r, 500));
  ws.send(JSON.stringify({ type: "message", text: "Segunda mensagem rápida" }));

  // esperar um pouco e então enviar após 3s para confirmar liberação
  await new Promise((r) => setTimeout(r, 3500));
  ws.send(JSON.stringify({ type: "message", text: "Terceira após 3s" }));

  await new Promise((r) => setTimeout(r, 1000));
  ws.close();
})();
