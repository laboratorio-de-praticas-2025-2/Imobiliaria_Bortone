import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

class SocketManager {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
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
                    return next(new Error('Token não fornecido'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.id;
                socket.userRole = decoded.role || 'user';
                
                next();
            } catch (error) {
                console.error('Erro na autenticação Socket.IO:', error.message);
                next(new Error('Token inválido'));
            }
        });
    }

    // Configurar manipuladores de eventos
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`Usuário conectado: ${socket.userId} (${socket.userRole})`);
            
            // Registrar usuário conectado
            this.connectedUsers.set(socket.userId, socket);
            this.userRooms.set(socket.userId, new Set());

            // Juntar-se a sala do usuário
            socket.join(`user_${socket.userId}`);

            // Juntar-se a salas baseadas no papel do usuário
            if (socket.userRole === 'admin' || socket.userRole === 'corretor') {
                socket.join('staff');
            }
            socket.join(`role_${socket.userRole}`);

            // Eventos personalizados
            socket.on('join_room', (roomName) => {
                socket.join(roomName);
                this.userRooms.get(socket.userId).add(roomName);
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
                this.userRooms.get(socket.userId).delete(roomName);
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
                const userRooms = this.userRooms.get(socket.userId) || new Set();
                userRooms.forEach(room => {
                    socket.to(room).emit('user_disconnected', {
                        userId: socket.userId,
                        reason,
                        timestamp: new Date().toISOString()
                    });
                });
                
                this.connectedUsers.delete(socket.userId);
                this.userRooms.delete(socket.userId);
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
        const socket = this.connectedUsers.get(userId);
        if (socket && socket.connected) {
            socket.emit(event, {
                ...data,
                timestamp: new Date().toISOString()
            });
            return true;
        }
        
        // Tentar enviar para a sala do usuário caso não esteja na lista de conectados
        const sent = this.io.to(`user_${userId}`).emit(event, {
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

    // Broadcast para todos os usuários conectados
    broadcast(event, data) {
        this.io.emit(event, {
            ...data,
            timestamp: new Date().toISOString()
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