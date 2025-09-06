// utils/chatService.js
export async function sendMessageMock(message) {
  // simula atraso de resposta (1.5s)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        sender: "support",
        text: `Recebi sua mensagem: "${message}" 👍`,
      });
    }, 1500);
  });
}
