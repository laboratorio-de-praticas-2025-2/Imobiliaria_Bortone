// components/chat/ChatModal.js
"use client";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./chatMessage.js";
import { IoIosCloseCircle, IoIosSend, IoIosMic } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "support", text: "Olá! Como posso ajudar você hoje?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const inputRef = useRef();
  
  // Dados do usuário autenticado
  const userToken = localStorage.getItem("authToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = userInfo?.nome || "Usuário";
  const currentUserId = userInfo?.id || null;

  // Conexão WebSocket
  useEffect(() => {
    // Verificar se usuário está autenticado
    if (!userToken || !currentUserId) {
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(), 
          sender: "support", 
          text: "❌ Você precisa fazer login para usar o chat.", 
          timestamp: new Date() 
        },
      ]);
      return;
    }

    const socketUrl = `ws://localhost:4000?token=${userToken}`;
    const socket = new WebSocket(socketUrl);
    setWs(socket);

    socket.onopen = () => {
      console.log("Conectado ao servidor WebSocket");
      setIsConnected(true);
      
      // Envia mensagem de conexão
      socket.send(
        JSON.stringify({
          type: "connect",
          token: userToken,
          nome: userName,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensagem recebida:", data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, {
          id: Date.now(),
          sender: data.fromUserId === currentUserId ? "user" : "support",
          text: data.text,
          timestamp: new Date()
        }]);
      }

      if (data.type === "history") {
        setMessages(data.messages || []);
      }

      if (data.type === "status") {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: "support", text: data.msg, timestamp: new Date() },
        ]);
      }

      if (data.error) {
        console.error("Erro do WebSocket:", data.error);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: "support", text: `Erro: ${data.error}`, timestamp: new Date() },
        ]);
      }
    };

    socket.onclose = (event) => {
      console.log("Conexão WebSocket encerrada", event.code, event.reason);
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("Erro WebSocket:", error);
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [userToken, userName, currentUserId]);

  const handleSend = () => {
    if (!newMessage.trim() || !ws || !isConnected) return;
  
    const messageObj = { 
      type: "message", 
      text: newMessage.trim(),
      fromUserId: currentUserId
    };
    
    console.log("Enviando mensagem:", messageObj);
    ws.send(JSON.stringify(messageObj));

    // Adiciona a mensagem localmente para feedback imediato
    const userMessage = { 
      id: Date.now(), 
      sender: "user", 
      text: newMessage.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
  
    setNewMessage("");
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="
      fixed z-[9999]
      inset-0 w-full h-full rounded-none
      md:inset-auto md:bottom-4 md:right-4 md:w-[90%] md:max-w-sm md:h-[70vh] md:rounded-2xl
      bg-white shadow-lg flex flex-col overflow-hidden
      animate-slideUpFade
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-[#4C62AE]">
        <div className="flex items-center gap-2">
          <RxAvatar className="w-8 h-8 md:w-10 md:h-10" color="white" />
          <div>
            <h2 className="text-sm md:text-base text-white font-semibold">
              Suporte Imobiliária Bortone
            </h2>
            <p className="text-xs text-white/80">
              {isConnected ? "🟢 Online" : "🔴 Conectando..."} • {userName}
            </p>
          </div>
        </div>

        <button onClick={onClose}>
          <IoIosCloseCircle 
            className="w-8 h-8 md:w-10 md:h-10 transition-transform hover:scale-110"
            color="white"
          />
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <ChatMessage key={msg.id ? msg.id : `msg-${idx}`} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      {/* Input */}
      <div className="relative flex items-center border-t p-2 gap-2 bg-[#4C62AE]">
        {/* Emoji */}
        <div className="relative">
          <BsEmojiSmileFill 
            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
            color="white"
            onClick={() => setShowEmojis(!showEmojis)}
          />
          {showEmojis && (
            <div
              className="absolute bottom-10 left-0 w-48 bg-white rounded-lg shadow-lg p-2 
                         flex flex-wrap gap-2 z-50 animate-emojiOpen"
            >
              {["😀", "😂", "😍", "👍", "🔥", "🎉", "🙌", "🤔", "😢", "👏"].map(
                (emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Campo texto */}
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-white rounded-3xl px-3 py-2 text-sm focus:outline-none 
                     focus:ring focus:ring-blue-300"
          disabled={!isConnected}
        />

        {/* Botão enviar */}
        <button
          onClick={handleSend}
          disabled={!isConnected}
          className={`flex w-10 h-10 rounded-full items-center justify-center 
                     hover:scale-110 transition ${
                       isConnected ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
                     }`}
        >
          <IoSend color="white" className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}