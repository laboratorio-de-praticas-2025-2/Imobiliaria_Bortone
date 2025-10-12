import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

class SocketManager {
    constructor() {
        console.log("🔧 Inicializando SocketManager...");
        console.log("🌐 FRONTEND_URL:", process.env.FRONTEND_URL || "http://localhost:3000");
        console.log("🔍 JWT_SECRET carregado:", process.env.JWT_SECRET ? 'SIM' : 'NÃO');
        console.log("🔍 Valor JWT_SECRET:", process.env.JWT_SECRET?.substring(0, 10) + '...');

        this.httpServer = createServer();

        this.io = new Server(this.httpServer, {
            // path: '/notifications/',
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        console.log("✅ SocketManager criado com path: /notifications/");

        const SOCKET_PORT = process.env.SOCKET_PORT || 4001;
        this.httpServer.listen(SOCKET_PORT, () => {
            console.log(`🔌 Socket.IO Server iniciado na porta ${SOCKET_PORT}`);
        });

        this.connectedUsers = new Map(); // userId -> socket
        this.userRooms = new Map(); // userId -> Set of rooms

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    // Middleware para autenticação JWT
    setupMiddleware() {
        this.io.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

                if (!token) {
                    socket.userId = 'anonymous_' + socket.id;
                    socket.userRole = 'guest';
                    socket.isAuthenticated = false;
                    console.log(`🔓 Usuário anônimo conectado: ${socket.userId}`);
                    return next();
                }

                // ✅ ADICIONAR logs de debug do token:
                console.log('🔍 Token recebido (primeiros 50 chars):', token.substring(0, 50));
                console.log('🔍 Token completo:', token);
                console.log('🔍 Tamanho do token:', token.length);
                console.log('🔍 JWT_SECRET usado:', process.env.JWT_SECRET);


                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // const decoded = jwt.decode(token);
                //  console.log('✅ Token válido decodificado:', { id: decoded.id, role: decoded.role });

                socket.userId = String(decoded.id);
                socket.userRole = decoded.role || 'user';
                socket.isAuthenticated = true;
                console.log(`🔐 Usuário autenticado conectado: ${socket.userId}`);

                next();
            } catch (error) {
                console.error('Token inválido, conectando como anônimo:', error.message);
                console.error('❌ Tipo do erro:', error.name);
                socket.userId = 'anonymous_' + socket.id;
                socket.userRole = 'guest';
                socket.isAuthenticated = false;
                next();
            }
        });
    }

    // Configurar manipuladores de eventos
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`🔗 Nova conexão socket: ${socket.id}`);
            console.log(`🔍 Auth recebido na conexão:`, socket.handshake.auth);
            console.log(`🔍 UserId setado pelo middleware:`, socket.userId);
            const authStatus = socket.isAuthenticated ? '🔐 autenticado' : '🔓 anônimo';
            console.log(`Usuário conectado: ${socket.userId} (${socket.userRole}) - ${authStatus}`);

            console.log(`🏠 Juntando socket ${socket.id} à sala 'public_notifications'`);
            socket.join('public_notifications');
            console.log(`✅ Socket ${socket.id} entrou na sala 'public_notifications'`);

            // Registrar usuário conectado
            this.connectedUsers.set(String(socket.userId), socket);
            this.userRooms.set(String(socket.userId), new Set());

            // Juntar-se a sala do usuário (só para autenticados)
            if (socket.isAuthenticated) {
                socket.join(`user_${String(socket.userId)}`);

                // Juntar-se a salas baseadas no papel do usuário
                if (socket.userRole === 'admin' || socket.userRole === 'corretor') {
                    socket.join('staff');
                }
                socket.join(`role_${socket.userRole}`);
            } else {
                // ✅ Anônimos entram na sala geral
                socket.join('anonymous_users');
            }

            // ✅ TODOS entram na sala de broadcasts públicos
            socket.join('public_notifications');


            // Eventos personalizados
            socket.on('join_room', (roomName) => {
                socket.join(roomName);
                this.userRooms.get(String(socket.userId)).add(roomName);
                console.log(`Usuário ${socket.userId} entrou na sala: ${roomName}`);

                // Notificar outros na sala
                socket.to(roomName).emit('user_joined', {
                    userId: socket.userId,
                    userRole: socket.userRole,
                    timestamp: new Date().toISOString()
                });
            });

            socket.on('leave_room', (roomName) => {
                socket.leave(roomName);
                this.userRooms.get(String(socket.userId)).delete(roomName);
                console.log(`Usuário ${socket.userId} saiu da sala: ${roomName}`);

                // Notificar outros na sala
                socket.to(roomName).emit('user_left', {
                    userId: socket.userId,
                    userRole: socket.userRole,
                    timestamp: new Date().toISOString()
                });
            });

            // Evento para marcar como online
            socket.emit('connected', {
                userId: socket.userId,
                message: 'Conectado com sucesso ao sistema de notificações',
                timestamp: new Date().toISOString()
            });

            // Desconexão
            socket.on('disconnect', (reason) => {
                console.log(`Usuário ${socket.userId} desconectado: ${reason}`);

                // Notificar salas que o usuário estava
                const userRooms = this.userRooms.get(String(socket.userId)) || new Set();
                userRooms.forEach(room => {
                    socket.to(room).emit('user_disconnected', {
                        userId: socket.userId,
                        reason,
                        timestamp: new Date().toISOString()
                    });
                });

                this.connectedUsers.delete(String(socket.userId));
                this.userRooms.delete(String(socket.userId));
            });

            // Tratamento de erros
            socket.on('error', (error) => {
                console.error(`Erro no socket ${socket.userId}:`, error);
            });
        });

        // Eventos globais do servidor
        this.io.on('connect_error', (error) => {
            console.error('Erro de conexão Socket.IO:', error);
        });
    }

    // Enviar mensagem para usuário específico
    sendToUser(userId, event, data) {
        const userIdStr = String(userId);
        console.log(`🎯 [sendToUser] Tentando enviar para usuário ${userIdStr}`);
        console.log(`🎯 [sendToUser] Usuários conectados:`, Array.from(this.connectedUsers.keys()));
        console.log(`🎯 [sendToUser] Usuário ${userIdStr} está conectado?`, this.connectedUsers.has(userIdStr));

        const socket = this.connectedUsers.get(userIdStr);
        if (socket && socket.connected) {
            socket.emit(event, {
                ...data,
                timestamp: new Date().toISOString()
            });
            return true;
        }

        // Tentar enviar para a sala do usuário caso não esteja na lista de conectados
        this.io.to(`user_${userIdStr}`).emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
        return false;
    }

    // Enviar mensagem para múltiplos usuários
    sendToUsers(userIds, event, data) {
        const results = [];
        userIds.forEach(userId => {
            results.push({
                userId,
                sent: this.sendToUser(userId, event, data)
            });
        });
        return results;
    }

    // Enviar mensagem para sala específica
    sendToRoom(roomName, event, data) {
        this.io.to(roomName).emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    // Enviar mensagem para todos os usuários de um papel
    sendToRole(role, event, data) {
        this.io.to(`role_${role}`).emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    // Enviar notificação de recomendação de imóvel
    sendPropertyRecommendation(userId, recommendation) {
        return this.sendToUser(userId, 'property_recommendation', {
            type: 'property_recommendation',
            title: 'Nova Recomendação de Imóvel',
            message: 'Encontramos um imóvel que pode interessar você!',
            data: recommendation
        });
    }

    // Enviar notificação geral
    sendNotification(userId, notification) {
        return this.sendToUser(userId, 'notification', {
            type: 'notification',
            data: notification
        });
    }

    // Enviar notificação de sistema
    sendSystemNotification(notification) {
        return this.broadcast('system_notification', {
            type: 'system',
            priority: 'high',
            data: notification
        });
    }

    // ✅ Broadcast para usuários anônimos
    broadcastToAnonymous(event, data) {
        this.io.to('anonymous_users').emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    // ✅ Broadcast público (autenticados + anônimos)
    broadcastPublic(event, data) {
        console.log(`🚀 broadcastPublic CHAMADO: evento=${event}`);
        console.log(`🚀 Dados:`, JSON.stringify(data, null, 2));
        console.log(`🚀 Usuários conectados:`, this.connectedUsers.size);
        this.io.to('public_notifications').emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });
        console.log(`✅ Evento ${event} enviado para sala 'public_notifications'`);
    }

    // ✅ Broadcast só para autenticados
    broadcastToAuthenticated(event, data) {
        this.connectedUsers.forEach((socket, userId) => {
            if (socket.isAuthenticated) {
                socket.emit(event, {
                    ...data,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Obter usuários conectados
    getConnectedUsers() {
        return Array.from(this.connectedUsers.keys());
    }

    // Obter usuários conectados com detalhes
    getConnectedUsersDetails() {
        const users = [];
        this.connectedUsers.forEach((socket, userId) => {
            users.push({
                userId,
                userRole: socket.userRole,
                connectedAt: socket.handshake.time,
                rooms: Array.from(this.userRooms.get(userId) || [])
            });
        });
        return users;
    }

    // Verificar se usuário está conectado
    isUserConnected(userId) {
        const socket = this.connectedUsers.get(userId);
        return socket && socket.connected;
    }

    // Desconectar usuário específico
    disconnectUser(userId, reason = 'Desconectado pelo administrador') {
        const socket = this.connectedUsers.get(userId);
        if (socket) {
            socket.emit('force_disconnect', { reason });
            socket.disconnect(true);
            return true;
        }
        return false;
    }

    // Obter estatísticas de conexão
    getConnectionStats() {
        return {
            totalConnections: this.connectedUsers.size,
            connectedUsers: Array.from(this.connectedUsers.keys()),
            totalRooms: this.io.sockets.adapter.rooms.size,
            serverStartTime: process.uptime(),
            socketEngineVersion: this.io.engine.protocol
        };
    }

    // Obter informações de uma sala específica
    getRoomInfo(roomName) {
        const room = this.io.sockets.adapter.rooms.get(roomName);
        if (!room) {
            return null;
        }

        return {
            roomName,
            memberCount: room.size,
            members: Array.from(room)
        };
    }

    // Limpar salas vazias (manutenção)
    cleanupEmptyRooms() {
        let cleaned = 0;
        this.io.sockets.adapter.rooms.forEach((room, roomName) => {
            if (room.size === 0 && !roomName.startsWith('user_') && !roomName.startsWith('role_')) {
                this.io.sockets.adapter.delAll();
                cleaned++;
            }
        });
        return cleaned;
    }
}

export default SocketManager;