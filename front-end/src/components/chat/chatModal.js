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
  const listRef = useRef();

  // Helper para montar URL do WS a partir da URL da API
  const getWebSocketUrl = () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      if (apiUrl) {
        // Substitui http/https por ws/wss
        return apiUrl.replace(/^http/, "ws");
      }
      // Fallback local
      const proto = typeof window !== "undefined" && window.location?.protocol === "https:" ? "wss" : "ws";
      const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
      return `${proto}://${host}:4000`;
    } catch {
      return "ws://localhost:4000";
    }
  };

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  // Conexão WebSocket
  useEffect(() => {
    // Ler dados do usuário dentro do efeito (evita divergência de hidratação)
    const token = localStorage.getItem("authToken");
    const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const nome = info?.nome || "Usuário";
    const userId = info?.id || null;

    if (!token || !userId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "support",
          text: "❌ Você precisa fazer login para usar o chat.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    let socket;
    let reconnectTimer;
    const connect = () => {
      const baseWsUrl = getWebSocketUrl();
      const wsUrl = `${baseWsUrl}?token=${token}`;
      socket = new WebSocket(wsUrl);
      setWs(socket);

      socket.onopen = () => {
        setIsConnected(true);
        // Envia mensagem de conexão
        socket.send(
          JSON.stringify({ type: "connect", token, nome })
        );
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Mensagem comum (pode vir em dois formatos do backend)
          if (data.type === "message") {
            // Formato quando vem de agente: { type, msg: { userId, text } }
            if (data.msg) {
              const fromMe = data.msg.fromUserId === userId || data.msg.userId === userId;
              setMessages((prev) => [
                ...prev,
                {
                  id: data.msg.timestamp || Date.now(),
                  sender: fromMe ? "user" : "support",
                  text: data.msg.text,
                  timestamp: data.msg.timestamp ? new Date(data.msg.timestamp) : new Date(),
                },
              ]);
            } else {
              // Formato broadcast em desenvolvimento entre usuários
              const fromMe = data.fromUserId === userId;
              setMessages((prev) => [
                ...prev,
                {
                  id: data.timestamp || Date.now(),
                  sender: fromMe ? "user" : "support",
                  text: data.text,
                  timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
                },
              ]);
            }
          }

          // Histórico
          if (data.type === "history") {
            const list = Array.isArray(data.messages) ? data.messages : [];
            const mapped = list.map((m, idx) => {
              const fromMe = m.fromUserId === userId;
              return {
                id: m.timestamp || `${Date.now()}-${idx}`,
                sender: fromMe ? "user" : "support",
                text: m.text || (m.msg && m.msg.text) || "",
                timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
              };
            });
            setMessages((prev) => {
              // Mantém a saudação inicial, substitui mensagens anteriores por histórico
              const header = prev.length && prev[0]?.id === 1 ? [prev[0]] : [];
              return [...header, ...mapped];
            });
          }

          // Status/informativos
          if (data.type === "status") {
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), sender: "support", text: data.msg, timestamp: new Date() },
            ]);
          }

          // Erros
          if (data.error) {
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), sender: "support", text: `Erro: ${data.error}` },
            ]);
          }
        } catch (e) {
          console.error("Falha ao processar mensagem WS:", e);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        // Reconnect simples após breve atraso
        reconnectTimer = setTimeout(() => connect(), 2000);
      };

      socket.onerror = () => {
        setIsConnected(false);
      };
    };

    connect();
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      try { socket && socket.close(); } catch {}
    };
  }, []);

  // Enviar mensagem
  const handleSend = () => {
    if (!newMessage.trim() || !ws || !isConnected) return;
    const payload = { type: "message", text: newMessage.trim() };
    try {
      ws.send(JSON.stringify(payload));
      // Adiciona localmente para feedback imediato
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "user", text: newMessage.trim(), timestamp: new Date() },
      ]);
      setNewMessage("");
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "support", text: "Falha ao enviar. Tente novamente." },
      ]);
    }
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
      <div ref={listRef} className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
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