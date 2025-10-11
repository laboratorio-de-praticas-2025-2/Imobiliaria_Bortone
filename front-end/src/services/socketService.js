// src/services/socketService.js - SUBSTITUIR TUDO por:
"use client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.eventHandlers = new Map();
    }

    async connect() {
        if (typeof window === 'undefined') {
            console.log('🚫 SSR detectado - não conectando socket');
            return;
        }
        if (this.socket && this.socket.connected) return;

        try {
            console.log("🔗 Conectando no navegador:", SOCKET_URL);

            const token = typeof window !== 'undefined'
                ? localStorage.getItem('token') || sessionStorage.getItem('token')
                : null;
            console.log("🔍 Token encontrado:", !!token);

            const { io } = await import("socket.io-client");

            this.socket = io(SOCKET_URL, {
                auth: token ? { token } : {},
                transports: ["polling", "websocket"],
                timeout: 20000,
                reconnection: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 2000,
                autoConnect: true,
                forceNew: false,
            });

            this.socket.on("connect", () => {
                this.isConnected = true;
                console.log("🔗 Conectado ao back-end via Socket.IO", this.socket.id);

                this.socket.onAny((eventName, ...args) => {
                    console.log(`📨 Evento recebido: ${eventName}`, args);
                });
            });

            this.socket.on("disconnect", () => {
                this.isConnected = false;
                console.log("❌ Desconectado do back-end");
            });

            this.socket.on("connect_error", (error) => {
                console.error("⚠️ Erro de conexão com o back-end via Socket.IO:", error.message);
            });

        } catch (error) {
            console.error("⚠️ Falha ao conectar:", error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    on(event, handler) {
        if (this.socket) {
            this.socket.on(event, handler);
            this.eventHandlers.set(event, handler);
        }
    }

    off(event, handler) {
        if (this.socket) {
            this.socket.off(event, handler);
            this.eventHandlers.delete(event);
        }
    }

    emit(event, data) {
        if (this.socket && this.isConnected) {
            this.socket.emit(event, data);
        }
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

// ✅ ÚNICA INSTÂNCIA:
const socketServiceInstance = new SocketService();

// ✅ Expor globalmente para debug:
if (typeof window !== 'undefined') {
    window.socketService = socketServiceInstance;
}

export default socketServiceInstance;