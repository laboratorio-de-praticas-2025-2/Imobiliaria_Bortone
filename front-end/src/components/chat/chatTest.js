// components/chat/ChatTest.js
"use client";
import { useState } from "react";
import ChatModal from "./chatModal.js";

export default function ChatTest() {
  const [activeChat, setActiveChat] = useState(null);

  const handleOpenChat = (userId) => {
    setActiveChat(userId);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Teste de Chat WebSocket</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Usuário 1 - Admin/Agente */}
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Usuário 1 - Agente</h2>
          <p className="text-gray-600 mb-4">
            Este usuário será tratado como agente de suporte (nível 0).
          </p>
          <button
            onClick={() => handleOpenChat(1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Abrir Chat - Usuário 1
          </button>
        </div>

        {/* Usuário 2 - Cliente */}
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Usuário 2 - Cliente</h2>
          <p className="text-gray-600 mb-4">
            Este usuário será tratado como cliente normal (nível 1).
          </p>
          <button
            onClick={() => handleOpenChat(2)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Abrir Chat - Usuário 2
          </button>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">Instruções para Teste:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Abra o chat do Usuário 1 em uma aba/janela</li>
          <li>Abra o chat do Usuário 2 em outra aba/janela (ou use modo incógnito)</li>
          <li>Envie mensagens de um usuário para o outro</li>
          <li>Verifique se as mensagens aparecem em tempo real nos dois chats</li>
          <li>Observe o status de conexão no header de cada chat</li>
        </ol>
      </div>

      {/* Modal do Chat */}
      {activeChat && (
        <ChatModal 
          testUserId={activeChat} 
          onClose={handleCloseChat} 
        />
      )}
    </div>
  );
}