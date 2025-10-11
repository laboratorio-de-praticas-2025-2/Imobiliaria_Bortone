"use client";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./chatMessage.js";
import { IoIosCloseCircle } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { BsEmojiSmileFill } from "react-icons/bs";
import infoContato from "@/utils/infoContato.json";

// Helper movido para fora do componente para evitar recriação a cada renderização
const getUserData = () => {
  // Verificação para Server-Side Rendering (SSR) onde o localStorage não existe
  if (typeof window === "undefined") {
    return {
      token: null,
      info: {},
      nome: "Usuário",
      userId: null,
      nivel: 1,
      isAgent: false,
    };
  }

  try {
    const token = localStorage.getItem("authToken");
    const userInfoString = localStorage.getItem("userInfo") || "{}";
    const info = JSON.parse(userInfoString);

    // Usa o operador "nullish coalescing" (??) para um fallback mais seguro
    let nivel = info?.nivel ?? 1;

    const nivelNumerico =
      typeof nivel === "string" ? parseInt(nivel, 10) : nivel;
    const isAgent = nivelNumerico === 0;

    return {
      token,
      info,
      nome: info?.nome || "Usuário",
      userId: info?.id || null,
      nivel: nivelNumerico,
      isAgent,
    };
  } catch (error) {
    console.error("Erro ao ler dados do usuário:", error);
    return {
      token: null,
      info: {},
      nome: "Usuário",
      userId: null,
      nivel: 1,
      isAgent: false,
    };
  }
};

// --- Helpers para som e notificações ---
// Toca um som "pop-ding" curto usando Web Audio API (pop rápido + ding)
const playPopDing = (opts = {}) => {
  const {
    popGain = 0.08,
    dingGain = 0.18,
    popFreq = 120,
    dingFreq = 1000,
    popTime = 0.03,
    dingTime = 0.18,
  } = opts;
  try {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Pop: ruído curto usando oscillator com frequência baixa e envelope rápido
    const popOsc = ctx.createOscillator();
    const popGainNode = ctx.createGain();
    popOsc.type = "square";
    popOsc.frequency.value = popFreq;
    popGainNode.gain.setValueAtTime(popGain, now);
    popGainNode.gain.exponentialRampToValueAtTime(0.0001, now + popTime);
    popOsc.connect(popGainNode);
    popGainNode.connect(ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + popTime + 0.01);

    // Ding: sinusoidal com decaimento
    const dingOsc = ctx.createOscillator();
    const dingGainNode = ctx.createGain();
    dingOsc.type = "sine";
    dingOsc.frequency.setValueAtTime(dingFreq, now + popTime * 0.7);
    dingGainNode.gain.setValueAtTime(dingGain, now + popTime * 0.7);
    dingGainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + popTime * 0.7 + dingTime
    );
    dingOsc.connect(dingGainNode);
    dingGainNode.connect(ctx.destination);
    dingOsc.start(now + popTime * 0.7);
    dingOsc.stop(now + popTime * 0.7 + dingTime + 0.02);

    // Fechar contexto após sons terminarem
    setTimeout(() => {
      try {
        ctx.close();
      } catch (e) {}
    }, (popTime + dingTime + 0.1) * 1000);
  } catch (e) {
    console.warn("Não foi possível tocar pop-ding:", e);
  }
};

// Pede permissão de Notificação se necessário e retorna estado
const ensureNotificationPermission = async () => {
  try {
    if (typeof window === "undefined" || !("Notification" in window))
      return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (e) {
    console.warn("Falha ao requisitar permissão de notificação:", e);
    return false;
  }
};

const showBrowserNotification = (title, options = {}) => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const notif = new Notification(title, options);
    // Fechar automaticamente após 6 segundos
    setTimeout(() => notif.close(), 6000);
    return notif;
  } catch (e) {
    console.warn("Não foi possível exibir notificação:", e);
  }
};

export default function ChatModal({ onClose, isLoggedIn }) {
  // Estados básicos
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // "connecting", "connected", "reconnecting", "disconnected"

  // Estados do usuário inicializados com lazy initialization
  const [userData, setUserData] = useState(() => getUserData());
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Refs
  const inputRef = useRef();
  const listRef = useRef();

  // Pedir permissão de notificação ao montar para agentes (melhora UX)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        if (!userData || !userData.isAgent) return;
        // Solicita permissão, mas não força popup se já negado
        await ensureNotificationPermission();
      } catch (e) {
        console.warn("Erro ao solicitar permissão de notificação no mount:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userData?.isAgent]);

  const getWebSocketUrl = () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) return apiUrl.replace(/^http/, "ws");

      if (typeof window !== "undefined") {
        const { protocol, hostname, port } = window.location;
        const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
        if (hostname === "localhost" || hostname === "127.0.0.1")
          return `${wsProtocol}//${hostname}:4000`;
        if (hostname.includes(".vercel.app")) {
          const backendUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "https://imobiliaria-bortone.onrender.com";
          return backendUrl.replace(/^http/, "ws");
        }
        if (hostname.includes(".onrender.com"))
          return `${wsProtocol}//${hostname}`;
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
    setMessages((prev) => prev.filter((msg) => msg.id === 1));

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
      timestamp: timestamp instanceof Date ? timestamp : new Date(timestamp),
    };
  };

  // Conexão WebSocket - corrigida para incluir dependências necessárias
  useEffect(() => {
    if (!userData.token || !userData.userId) {
      console.warn("⚠️ Dados de autenticação não encontrados ou inválidos.");
      setMessages([
        createMessage(
          1,
          "support",
          "❌ Você precisa fazer login para usar o chat."
        ),
      ]);
      return;
    }

    console.log("✅ Dados de usuário para conexão:", {
      userId: userData.userId,
      nome: userData.nome,
      nivel: userData.nivel,
      isAgent: userData.isAgent,
    });

    // Mensagem inicial baseada no tipo de usuário
    const initialText = userData.isAgent
      ? "Bem-vindo ao painel de atendimento! Selecione um usuário para conversar."
      : "Olá! Como posso ajudar você hoje?";

    setMessages([createMessage(1, "support", initialText)]);

    let socket;
    let reconnectTimer;
    let heartbeatTimer;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;

    const startHeartbeat = (socket) => {
      // Limpar heartbeat anterior se existir
      if (heartbeatTimer) clearInterval(heartbeatTimer);

      let lastPongTime = Date.now();

      // Enviar ping a cada 30 segundos e verificar se recebemos pong
      heartbeatTimer = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          const now = Date.now();

          // Se não recebemos pong há mais de 60 segundos, considerar conexão morta
          if (now - lastPongTime > 60000) {
            console.log("❌ Conexão considerada morta - não recebeu pong");
            socket.close(1000, "Heartbeat timeout");
            return;
          }

          socket.send(JSON.stringify({ type: "ping", timestamp: now }));
        }
      }, 30000);

      // Atualizar tempo do último pong quando recebermos resposta
      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "pong") {
            lastPongTime = Date.now();
          }
        } catch (e) {
          // Ignorar erros de parsing neste listener específico
        }
      });
    };

    const stopHeartbeat = () => {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    };

    const connect = () => {
      const wsUrl = `${getWebSocketUrl()}?token=${userData.token}`;
      console.log(
        `🔌 Tentando conectar WebSocket (tentativa ${
          reconnectAttempts + 1
        }): ${wsUrl}`
      );

      setConnectionStatus("connecting");

      try {
        socket = new WebSocket(wsUrl);
        setWs(socket);

        socket.onopen = () => {
          console.log("✅ WebSocket conectado com sucesso");
          setIsConnected(true);
          setConnectionStatus("connected");
          reconnectAttempts = 0;
          setMessages((prev) =>
            prev.filter(
              (msg) =>
                !msg.text.includes("Erro de conexão") &&
                !msg.text.includes("Reconectando") &&
                !msg.text.includes("Conexão perdida")
            )
          );

          // Iniciar heartbeat
          startHeartbeat(socket);

          const connectMessage = {
            type: "connect",
            token: userData.token,
            userId: userData.userId,
            nome: userData.nome,
            nivel: userData.nivel,
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
              const text = (
                payload?.text ??
                payload?.content ??
                payload?.body ??
                ""
              ).toString();

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

              // --- Alertas: tocar som e notificação ---
              try {
                // Se o usuário for agente, ele deve ouvir notificações de novas mensagens de usuários
                const isMessageFromUser =
                  !fromMe && (!fromId || fromId !== userData.userId);

                // Tocar som para qualquer mensagem nova que não seja enviada por este usuário (evita tocar para mensagens que eu enviei)
                if (!fromMe) playPopDing();

                // Mostrar notificação para agentes quando receberem mensagem de usuário (e não estiver com a janela do chat em foco)
                if (userData.isAgent && isMessageFromUser) {
                  ensureNotificationPermission().then((granted) => {
                    if (!granted) return;
                    showBrowserNotification(
                      `Nova mensagem de ${
                        payload?.fromName || payload?.nome || "usuário"
                      }`,
                      {
                        body: text.trim().slice(0, 120),
                        tag: `chat-${fromId || ts}`,
                        renotify: true,
                      }
                    );
                  });
                }

                // Se for usuário final e receber resposta do suporte enquanto a aba não estiver visível
                if (!userData.isAgent && !fromMe) {
                  ensureNotificationPermission().then((granted) => {
                    if (!granted) return;
                    showBrowserNotification("Resposta do suporte", {
                      body: text.trim().slice(0, 120),
                      tag: `chat-support-${ts}`,
                    });
                  });
                }
              } catch (e) {
                console.warn("Erro ao disparar alertas:", e);
              }
            }

            if (["history", "messages", "chatHistory"].includes(type)) {
              const listRaw = data.messages ?? data.history ?? data.data ?? [];

              const list = Array.isArray(listRaw) ? listRaw : [];

              const mapped = list
                .map((m, idx) => getPayload(m))
                .filter((m) => {
                  const t = (m?.text ?? m?.content ?? m?.body ?? "").toString();
                  return t.trim() !== "";
                })
                .map((m, idx) => {
                  const text = (m?.text ?? m?.content ?? m?.body ?? "")
                    .toString()
                    .trim();
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
              const msg = (data.msg ?? data.message ?? "").toString().trim();
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

            // Responder a pings do servidor
            if (type === "ping") {
              socket.send(JSON.stringify({ type: "pong" }));
            }

            // Confirmar recebimento de pong
            if (type === "pong") {
              const latency = data.timestamp
                ? Date.now() - data.timestamp
                : null;
              console.log(
                `🏓 Pong recebido do servidor${
                  latency ? ` (latência: ${latency}ms)` : ""
                }`
              );
            }
          } catch (e) {
            console.error("❌ Falha ao processar mensagem WS:", e, event.data);
          }
        };

        socket.onclose = (event) => {

          console.log("❌ WebSocket fechado:", { code: event.code, reason: event.reason });
          console.log("🔍 Estado da conexão antes do fechamento:", {
            readyState: socket.readyState,
            isConnected: isConnected,
            reconnectAttempts: reconnectAttempts,
            userData: userData
          });
          setIsConnected(false);
          stopHeartbeat();

          // Códigos específicos que não devem reconectar
          const noReconnectCodes = [1000, 1001, 4001, 4002]; // Normal closure, going away, auth errors

          if (
            !noReconnectCodes.includes(event.code) &&
            reconnectAttempts < maxReconnectAttempts
          ) {

            reconnectAttempts++;
            setConnectionStatus("reconnecting");
            const delay = Math.min(
              1000 * Math.pow(2, reconnectAttempts - 1),
              10000
            );
            console.log(
              `🔄 Tentando reconectar em ${delay}ms (código: ${event.code})`
            );

            setMessages((prev) => [
              ...prev,
              createMessage(
                Date.now(),
                "support",
                `🔄 Conexão perdida (código: ${
                  event.code
                }). Reconectando em ${Math.round(delay / 1000)}s...`
              ),
            ]);

            reconnectTimer = setTimeout(connect, delay);
          } else {
            setConnectionStatus("disconnected");
            const errorMsg =
              event.code === 4001
                ? "❌ Token de autenticação obrigatório."
                : event.code === 4002
                ? "❌ Token de autenticação inválido."
                : event.code === 1008
                ? "❌ Origem não permitida."
                : reconnectAttempts >= maxReconnectAttempts
                ? "❌ Não foi possível conectar ao servidor após várias tentativas."
                : "❌ Conexão encerrada.";

            setMessages((prev) => [
              ...prev,
              createMessage(Date.now(), "support", errorMsg),
            ]);
          }
        };

        socket.onerror = (error) => {
          console.error("🚨 Erro no WebSocket:", error);
          setIsConnected(false);
          setConnectionStatus("disconnected");
          stopHeartbeat();
        };
      } catch (connectionError) {
        console.error("❌ Erro ao criar WebSocket:", connectionError);
      }
    };

    connect();
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      stopHeartbeat();
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "Component unmounting");
      }
    };
    // Incluindo dependências necessárias para resolver o warning do ESLint
  }, [
    userData.token,
    userData.userId,
    userData.isAgent,
    userData.nome,
    userData.nivel,
    selectedUser,
  ]);

  const handleSend = () => {
    const messageText = newMessage.trim();
    if (!messageText || !ws || !isConnected) return;

    let payload = { type: "message", text: messageText };

    // Validação para agentes
    if (userData.isAgent) {
      if (!selectedUser) {
        setMessages((prev) => [
          ...prev,
          createMessage(
            Date.now(),
            "support",
            "⚠️ Selecione um usuário para enviar mensagem."
          ),
        ]);
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
      setMessages((prev) => [
        ...prev,
        createMessage(
          Date.now(),
          "support",
          "❌ Falha ao enviar. Tente novamente."
        ),
      ]);
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

  // Função para redirecionar para login
  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  // Se o usuário não estiver logado, mostra tela de login
  if (!isLoggedIn || !userData.token) {
    return (
      <div className="fixed z-[9999] inset-0 w-full h-full rounded-none md:inset-auto md:bottom-4 md:right-4 md:w-[90%] md:max-w-sm md:h-[70vh] md:rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden animate-slideUpFade">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-[#4C62AE]">
          <div className="flex items-center gap-2">
            <RxAvatar className="w-8 h-8 md:w-10 md:h-10" color="white" />
            <div>
              <h2 className="text-sm md:text-base text-white font-semibold">
                Suporte Imobiliária Bortone
              </h2>
              <p className="text-xs text-white/80">Faça login para conversar</p>
            </div>
          </div>
          <button onClick={onClose}>
            <IoIosCloseCircle
              className="w-8 h-8 md:w-10 md:h-10 transition-transform hover:scale-110"
              color="white"
            />
          </button>
        </div>

        {/* Conteúdo de login necessário */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50">
          <div className="mb-6">
            <div className="w-16 h-16 bg-[#4C62AE] rounded-full flex items-center justify-center mb-4 mx-auto">
              <RxAvatar className="w-8 h-8" color="white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Entre em contato conosco!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Para usar o chat de suporte, você precisa fazer login em sua
              conta.
            </p>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-[#4C62AE] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#3d4f8a] transition-colors"
            >
              Fazer Login
            </button>
            <button
              onClick={() => (window.location.href = "/cadastro")}
              className="w-full border border-[#4C62AE] text-[#4C62AE] py-3 px-4 rounded-lg font-semibold hover:bg-[#4C62AE] hover:text-white transition-colors"
            >
              Criar Conta
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Ou entre em contato por:</p>
            <p className="mt-1">📞 {infoContato.telefoneWhats.telefone}</p>
            <p>📧 {infoContato.contato.email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed z-[9999] inset-0 w-full h-full rounded-none md:inset-auto md:bottom-4 md:right-4 md:w-[90%] md:max-w-sm md:h-[70vh] md:rounded-2xl bg-white shadow-lg flex flex-col overflow-hidden animate-slideUpFade">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-[#4C62AE]">
        <div className="flex items-center gap-2">
          <RxAvatar className="w-8 h-8 md:w-10 md:h-10" color="white" />
          <div>
            <h2 className="text-sm md:text-base text-white font-semibold">
              {userData.isAgent
                ? "Painel de Atendimento"
                : "Suporte Imobiliária Bortone"}
            </h2>
            <p className="text-xs text-white/80">
              {connectionStatus === "connected" && "🟢 Online"}
              {connectionStatus === "connecting" && "� Conectando..."}
              {connectionStatus === "reconnecting" && "🟡 Reconectando..."}
              {connectionStatus === "disconnected" && "🔴 Desconectado"}
              {" • " + userData.nome}
              {userData.isAgent && ` (Agente)`}
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
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {connectedUsers.length > 0 ? (
                connectedUsers.map((user) => (
                  <div
                    key={user.userId}
                    onClick={() => selectUser(user.userId)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-200 transition-colors ${
                      selectedUser === user.userId
                        ? "bg-blue-100 border-blue-300"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-800 flex items-center">
                          🟢 {user.nome || `Usuário ${user.userId}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user.userId}
                        </div>
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
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Aguardando usuários
                  </div>
                  <div className="text-xs text-gray-500">
                    Usuários online aparecerão aqui.
                  </div>
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-50 border-t text-xs text-gray-500 text-center">
              {connectionStatus === "connected" && (
                <span className="text-green-600">🟢 Painel Ativo</span>
              )}
              {connectionStatus === "connecting" && (
                <span className="text-yellow-600">🟡 Conectando...</span>
              )}
              {connectionStatus === "reconnecting" && (
                <span className="text-yellow-600">� Reconectando...</span>
              )}
              {connectionStatus === "disconnected" && (
                <span className="text-red-600">🔴 Desconectado</span>
              )}
            </div>
          </div>
        )}

        {/* Área de mensagens */}
        <div
          className={`flex flex-col ${userData.isAgent ? "flex-1" : "w-full"}`}
        >
          {userData.isAgent && selectedUser && (
            <div className="p-2 bg-blue-50 text-sm text-blue-700 border-b">
              Conversando com:{" "}
              {connectedUsers.find((u) => u.userId === selectedUser)?.nome ||
                `Usuário ${selectedUser}`}
            </div>
          )}
          <div
            ref={listRef}
            className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50"
          >
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
            <div className="text-white text-sm text-center">
              Selecione um usuário para conversar
            </div>
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
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            userData.isAgent && !selectedUser
              ? "Selecione um usuário..."
              : "Digite sua mensagem..."
          }
          className="flex-1 bg-white rounded-3xl px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          disabled={!isConnected || (userData.isAgent && !selectedUser)}
        />
        <button
          onClick={handleSend}
          disabled={!isConnected || (userData.isAgent && !selectedUser)}
          className={`flex w-10 h-10 rounded-full items-center justify-center hover:scale-110 transition ${
            isConnected && (!userData.isAgent || selectedUser)
              ? "opacity-100"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <IoSend color="white" className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
