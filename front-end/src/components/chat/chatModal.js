"use client";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./chatMessage.js";
import { IoIosCloseCircle } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { BsEmojiSmileFill } from "react-icons/bs";

// Helper movido para fora do componente para evitar recriação a cada renderização
const getUserData = () => {
  // Verificação para Server-Side Rendering (SSR) onde o localStorage não existe
  if (typeof window === "undefined") {
    return { token: null, info: {}, nome: "Usuário", userId: null, nivel: 1, isAgent: false };
  }
  
  try {
    const token = localStorage.getItem("authToken");
    const userInfoString = localStorage.getItem("userInfo") || "{}";
    const info = JSON.parse(userInfoString);
    
    // Usa o operador "nullish coalescing" (??) para um fallback mais seguro
    let nivel = info?.nivel ?? 1;
    
    const nivelNumerico = typeof nivel === 'string' ? parseInt(nivel, 10) : nivel;
    const isAgent = nivelNumerico === 0;
    
    return {
      token,
      info,
      nome: info?.nome || "Usuário",
      userId: info?.id || null,
      nivel: nivelNumerico,
      isAgent
    };
  } catch (error) {
    console.error("Erro ao ler dados do usuário:", error);
    return { token: null, info: {}, nome: "Usuário", userId: null, nivel: 1, isAgent: false };
  }
};

export default function ChatModal({ onClose }) {
  // Estados básicos
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Estados do usuário inicializados com lazy initialization
  const [userData, setUserData] = useState(() => getUserData());
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Refs
  const inputRef = useRef();
  const listRef = useRef();

  const getWebSocketUrl = () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) return apiUrl.replace(/^http/, "ws");
      
      if (typeof window !== "undefined") {
        const { protocol, hostname, port } = window.location;
        const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
        if (hostname === "localhost" || hostname === "127.0.0.1") return `${wsProtocol}//${hostname}:4000`;
        if (hostname.includes('.vercel.app')) return "wss://imobiliaria-bortone.onrender.com";
        if (hostname.includes('.onrender.com')) return `${wsProtocol}//${hostname}`;
        return `${wsProtocol}//${hostname}${port ? `:${port}` : ""}`;
      }
      return "ws://localhost:4000";
    } catch (error) {
      console.error("❌ Erro ao construir URL do WebSocket:", error);
      return "ws://localhost:4000";
    }
  };

  // Auto scroll para as mensagens
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  // Atualização periódica para agentes
  useEffect(() => {
    if (!userData.isAgent) return;
    const interval = setInterval(() => setLastUpdate(new Date()), 60000);
    return () => clearInterval(interval);
  }, [userData.isAgent]);

  // Função para selecionar usuário e solicitar histórico
  const selectUser = (userId) => {
    console.log("🎯 Selecionando usuário:", userId);
    setSelectedUser(userId);
    
    // Limpar mensagens antigas exceto a inicial
    setMessages(prev => prev.filter(msg => msg.id === 1));
    
    // Solicitar histórico do usuário selecionado
    if (ws && isConnected) {
      const payload = { type: "getHistory", userId: userId };
      console.log("📤 Solicitando histórico:", payload);
      ws.send(JSON.stringify(payload));
    }
  };

  // Função helper para criar mensagem padronizada
  const createMessage = (id, sender, text, timestamp = new Date()) => {
    return {
      id: id || Date.now(),
      sender: sender || "support",
      text: text || "",
      timestamp: timestamp instanceof Date ? timestamp : new Date(timestamp)
    };
  };

  // Conexão WebSocket - corrigida para incluir dependências necessárias
  useEffect(() => {
    if (!userData.token || !userData.userId) {
      console.warn("⚠️ Dados de autenticação não encontrados ou inválidos.");
      setMessages([createMessage(1, "support", "❌ Você precisa fazer login para usar o chat.")]);
      return;
    }

    console.log("✅ Dados de usuário para conexão:", {
      userId: userData.userId,
      nome: userData.nome,
      nivel: userData.nivel,
      isAgent: userData.isAgent
    });
    
    // Mensagem inicial baseada no tipo de usuário
    const initialText = userData.isAgent
      ? "Bem-vindo ao painel de atendimento! Selecione um usuário para conversar."
      : "Olá! Como posso ajudar você hoje?";
    
    setMessages([createMessage(1, "support", initialText)]);

    let socket;
    let reconnectTimer;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    
    const connect = () => {
      const wsUrl = `${getWebSocketUrl()}?token=${userData.token}`;
      console.log(`🔌 Tentando conectar WebSocket: ${wsUrl}`);
      
      try {
        socket = new WebSocket(wsUrl);
        setWs(socket);

        socket.onopen = () => {
          console.log("✅ WebSocket conectado com sucesso");
          setIsConnected(true);
          reconnectAttempts = 0;
          setMessages((prev) => prev.filter(msg => !msg.text.includes("Erro de conexão")));

          const connectMessage = {
            type: "connect",
            token: userData.token,
            userId: userData.userId,
            nome: userData.nome,
            nivel: userData.nivel
          };
          console.log("📤 Enviando mensagem de conexão:", connectMessage);
          socket.send(JSON.stringify(connectMessage));
        };

        socket.onmessage = (event) => {
          try {
            const raw = event.data;
            const data = JSON.parse(raw);
            console.log("📨 Mensagem recebida (raw):", raw);
            console.log("📨 Mensagem recebida (obj):", data);

            const type = data.type || data.event || data.action;

            // Normaliza um possível "payload" aninhado
            const getPayload = (obj) => obj?.message ?? obj?.data ?? obj;

            if (["message", "chatMessage", "newMessage"].includes(type)) {
              const payload = getPayload(data);

              // Extrai campos com tolerância a diferentes chaves
              const text =
                (payload?.text ??
                 payload?.content ??
                 payload?.body ??
                 "").toString();

              if (!text.trim()) {
                console.warn("⚠️ Mensagem recebida sem texto útil:", payload);
                return;
              }

              const fromId =
                payload?.fromUserId ??
                payload?.from ??
                payload?.senderId ??
                data?.fromUserId ??
                null;

              const ts = payload?.timestamp ?? data?.timestamp ?? Date.now();
              const fromMe = fromId && fromId === userData.userId;

              const newMsg = createMessage(
                ts,
                fromMe ? "user" : "support",
                text.trim(),
                ts
              );

              console.log("➕ Adicionando mensagem normalizada:", newMsg);
              setMessages((prev) => [...prev, newMsg]);
            }

            if (["history", "messages", "chatHistory"].includes(type)) {
              const listRaw =
                data.messages ??
                data.history ??
                data.data ??
                [];

              const list = Array.isArray(listRaw) ? listRaw : [];

              const mapped = list
                .map((m, idx) => getPayload(m))
                .filter((m) => {
                  const t = (m?.text ?? m?.content ?? m?.body ?? "").toString();
                  return t.trim() !== "";
                })
                .map((m, idx) => {
                  const text =
                    (m?.text ?? m?.content ?? m?.body ?? "").toString().trim();
                  const fromId =
                    m?.fromUserId ?? m?.from ?? m?.senderId ?? null;
                  const ts = m?.timestamp ?? Date.now() + idx;
                  const fromMe = fromId && fromId === userData.userId;

                  return createMessage(
                    ts,
                    fromMe ? "user" : "support",
                    text,
                    ts
                  );
                });

              console.log("📜 Histórico normalizado:", mapped);

              setMessages((prev) => {
                const header = prev.filter((msg) => msg.id === 1);
                return [...header, ...mapped];
              });
            }

            if (type === "users" && userData.isAgent) {
              setConnectedUsers(data.users || []);
              setLastUpdate(new Date());
              if (!selectedUser && data.users?.length > 0) {
                setSelectedUser(data.users[0].userId);
              }
            }

            if (type === "status") {
              const msg =
                (data.msg ?? data.message ?? "").toString().trim();
              if (msg) {
                setMessages((prev) => [
                  ...prev,
                  createMessage(Date.now(), "support", msg),
                ]);
              }
            }

            if (data.error) {
              const errorMsg = `Erro: ${data.error}`;
              setMessages((prev) => [
                ...prev,
                createMessage(Date.now(), "support", errorMsg),
              ]);
            }
          } catch (e) {
            console.error("❌ Falha ao processar mensagem WS:", e, event.data);
          }
        };

        socket.onclose = (event) => {
          console.log("❌ WebSocket fechado:", { code: event.code, reason: event.reason });
          setIsConnected(false);
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
            console.log(`🔄 Tentando reconectar em ${delay}ms`);
            reconnectTimer = setTimeout(connect, delay);
          } else {
            setMessages((prev) => [...prev, createMessage(Date.now(), "support", "❌ Não foi possível conectar ao servidor.")]);
          }
        };

        socket.onerror = (error) => {
          console.error("🚨 Erro no WebSocket:", error);
          setIsConnected(false);
        };
      } catch (connectionError) {
        console.error("❌ Erro ao criar WebSocket:", connectionError);
      }
    };

    connect();
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket) socket.close();
    };
    // Incluindo dependências necessárias para resolver o warning do ESLint
  }, [userData.token, userData.userId, userData.isAgent, userData.nome, userData.nivel, selectedUser]);

  const handleSend = () => {
    const messageText = newMessage.trim();
    if (!messageText || !ws || !isConnected) return;
    
    let payload = { type: "message", text: messageText };
    
    // Validação para agentes
    if (userData.isAgent) {
      if (!selectedUser) {
        setMessages((prev) => [...prev, createMessage(Date.now(), "support", "⚠️ Selecione um usuário para enviar mensagem.")]);
        return;
      }
      payload.to = selectedUser;
      console.log("📤 AGENTE enviando para usuário:", selectedUser);
    }
    
    try {
      console.log("📤 Enviando payload:", payload);
      ws.send(JSON.stringify(payload));
      
      // Adicionar mensagem enviada imediatamente
      const sentMessage = createMessage(Date.now(), "user", messageText);
      console.log("➕ Adicionando mensagem enviada:", sentMessage);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (e) {
      console.error("❌ Erro ao enviar:", e);
      setMessages((prev) => [...prev, createMessage(Date.now(), "support", "❌ Falha ao enviar. Tente novamente.")]);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };
  
  // Debug: Adicionar logs para monitorar mensagens
  useEffect(() => {
    console.log("🔍 Estado atual das mensagens:", messages);
  }, [messages]);
  
  return (
    <div className="fixed z-[9999] inset-0 w-full h-full rounded-none md:inset-auto md:bottom-4 md:right-4 md:w-[90%] md:max-w-sm md:h-[70vh] md:rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden animate-slideUpFade">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-[#4C62AE]">
        <div className="flex items-center gap-2">
          <RxAvatar className="w-8 h-8 md:w-10 md:h-10" color="white" />
          <div>
            <h2 className="text-sm md:text-base text-white font-semibold">
              {userData.isAgent ? "Painel de Atendimento" : "Suporte Imobiliária Bortone"}
            </h2>
            <p className="text-xs text-white/80">
              {isConnected ? "🟢 Online" : "🔴 Conectando..."} • {userData.nome}
              {userData.isAgent && ` (Agente)`}
            </p>
          </div>
        </div>
        <button onClick={onClose}>
          <IoIosCloseCircle className="w-8 h-8 md:w-10 md:h-10 transition-transform hover:scale-110" color="white" />
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex flex-1 overflow-hidden">
        {/* Painel lateral de usuários para agentes */}
        {userData.isAgent && (
          <div className="w-1/3 border-r bg-gray-100 flex flex-col">
            <div className="p-2 bg-gray-200 text-sm font-semibold text-gray-700 border-b">
              <div className="flex items-center justify-between">
                <span>👥 Usuários Online</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {connectedUsers.length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {connectedUsers.length > 0 ? (
                connectedUsers.map((user) => (
                  <div 
                    key={user.userId} 
                    onClick={() => selectUser(user.userId)} 
                    className={`p-3 border-b cursor-pointer hover:bg-gray-200 transition-colors ${
                      selectedUser === user.userId ? 'bg-blue-100 border-blue-300' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-800 flex items-center">
                          🟢 {user.nome || `Usuário ${user.userId}`}
                        </div>
                        <div className="text-xs text-gray-500">ID: {user.userId}</div>
                      </div>
                      {selectedUser === user.userId && (
                        <div className="text-blue-500 text-xs">💬 Ativo</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-4xl mb-3">👨‍💼</div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Aguardando usuários</div>
                  <div className="text-xs text-gray-500">Usuários online aparecerão aqui.</div>
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-50 border-t text-xs text-gray-500 text-center">
              {isConnected ? (
                <span className="text-green-600">🟢 Painel Ativo</span>
              ) : (
                <span className="text-red-600">🔴 Reconectando...</span>
              )}
            </div>
          </div>
        )}

        {/* Área de mensagens */}
        <div className={`flex flex-col ${userData.isAgent ? 'flex-1' : 'w-full'}`}>
          {userData.isAgent && selectedUser && (
            <div className="p-2 bg-blue-50 text-sm text-blue-700 border-b">
              Conversando com: {connectedUsers.find(u => u.userId === selectedUser)?.nome || `Usuário ${selectedUser}`}
            </div>
          )}
          <div ref={listRef} className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg, idx) => {
                if (!msg || !msg.text || msg.text.trim() === "") return null;
                return (
                  <ChatMessage
                    key={msg.id || `msg-${idx}`}
                    sender={msg.sender || "support"}
                    text={msg.text}
                    timestamp={msg.timestamp}
                    message={msg} // passa objeto completo como fallback
                  />
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Nenhuma mensagem ainda...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="relative flex items-center border-t p-2 gap-2 bg-[#4C62AE]">
        {userData.isAgent && !selectedUser && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-sm text-center">Selecione um usuário para conversar</div>
          </div>
        )}
        <div className="relative">
          <BsEmojiSmileFill 
            className="w-8 h-8 cursor-pointer hover:scale-110 transition" 
            color="white" 
            onClick={() => setShowEmojis(!showEmojis)} 
          />
          {showEmojis && (
            <div className="absolute bottom-10 left-0 w-48 bg-white rounded-lg shadow-lg p-2 flex flex-wrap gap-2 z-50 animate-emojiOpen">
              {["😀", "😂", "😍", "👍", "🔥", "🎉", "🙌", "🤔", "😢", "👏"].map((emoji) => (
                <button 
                  key={emoji} 
                  onClick={() => addEmoji(emoji)} 
                  className="text-xl hover:scale-125 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={userData.isAgent && !selectedUser ? "Selecione um usuário..." : "Digite sua mensagem..."}
          className="flex-1 bg-white rounded-3xl px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          disabled={!isConnected || (userData.isAgent && !selectedUser)}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || (userData.isAgent && !selectedUser)}
          className={`flex w-10 h-10 rounded-full items-center justify-center hover:scale-110 transition ${
            isConnected && (!userData.isAgent || selectedUser) ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <IoSend color="white" className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}