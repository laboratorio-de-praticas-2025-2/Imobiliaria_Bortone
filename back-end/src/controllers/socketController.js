import { getSocketManager } from '../utils/socketHelper.js';

/**
 * Controller para gerenciar operações do Socket.IO
 * Fornece endpoints REST para administrar conexões e enviar notificações
 */

// Obter estatísticas de conexão
export const getConnectionStats = (req, res) => {
    try {
        const socketManager = getSocketManager();
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        const stats = socketManager.getConnectionStats();
        const detailedUsers = socketManager.getConnectedUsersDetails();
        
        res.json({
            success: true,
            data: {
                ...stats,
                connectedUsersDetails: detailedUsers
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter estatísticas',
            error: error.message
        });
    }
};

// Verificar status de conexão do usuário
export const getUserConnectionStatus = (req, res) => {
    try {
        const { userId } = req.params;
        const socketManager = getSocketManager();
        
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário inválido',
                error: 'INVALID_USER_ID'
            });
        }

        const userIdInt = parseInt(userId);
        const isConnected = socketManager.isUserConnected(userIdInt);
        
        res.json({
            success: true,
            data: {
                userId: userIdInt,
                connected: isConnected,
                checkedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erro ao verificar status do usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar status do usuário',
            error: error.message
        });
    }
};

// Enviar notificação
export const sendNotification = (req, res) => {
    try {
        const { userId, userIds, room, role, event, data, type = 'notification' } = req.body;
        const socketManager = getSocketManager();
        
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        if (!event) {
            return res.status(400).json({
                success: false,
                message: 'Campo "event" é obrigatório',
                error: 'MISSING_EVENT'
            });
        }

        let result;
        const notificationData = {
            type,
            data,
            sentAt: new Date().toISOString()
        };

        if (userId) {
            result = socketManager.sendToUser(userId, event, notificationData);
        } else if (userIds && Array.isArray(userIds)) {
            result = socketManager.sendToUsers(userIds, event, notificationData);
        } else if (room) {
            socketManager.sendToRoom(room, event, notificationData);
            result = true;
        } else if (role) {
            socketManager.sendToRole(role, event, notificationData);
            result = true;
        } else {
            socketManager.broadcast(event, notificationData);
            result = true;
        }

        res.json({
            success: true,
            message: 'Notificação enviada com sucesso',
            data: {
                event,
                type,
                result,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar notificação',
            error: error.message
        });
    }
};

// Obter informações de uma sala
export const getRoomInfo = (req, res) => {
    try {
        const { roomName } = req.params;
        const socketManager = getSocketManager();
        
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        const roomInfo = socketManager.getRoomInfo(roomName);
        
        if (!roomInfo) {
            return res.status(404).json({
                success: false,
                message: 'Sala não encontrada',
                error: 'ROOM_NOT_FOUND'
            });
        }

        res.json({
            success: true,
            data: roomInfo
        });
    } catch (error) {
        console.error('Erro ao obter informações da sala:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter informações da sala',
            error: error.message
        });
    }
};

// Desconectar usuário específico
export const disconnectUser = (req, res) => {
    try {
        const { userId } = req.params;
        const { reason = 'Desconectado pelo administrador' } = req.body;
        const socketManager = getSocketManager();
        
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                success: false,
                message: 'ID do usuário inválido',
                error: 'INVALID_USER_ID'
            });
        }

        const userIdInt = parseInt(userId);
        const result = socketManager.disconnectUser(userIdInt, reason);
        
        if (result) {
            res.json({
                success: true,
                message: 'Usuário desconectado com sucesso',
                data: {
                    userId: userIdInt,
                    reason,
                    disconnectedAt: new Date().toISOString()
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Usuário não encontrado ou não está conectado',
                error: 'USER_NOT_CONNECTED'
            });
        }
    } catch (error) {
        console.error('Erro ao desconectar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao desconectar usuário',
            error: error.message
        });
    }
};

// Enviar recomendação de propriedade
export const sendPropertyRecommendation = (req, res) => {
    try {
        const { userId, propertyData } = req.body;
        const socketManager = getSocketManager();
        
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        if (!userId || !propertyData) {
            return res.status(400).json({
                success: false,
                message: 'userId e propertyData são obrigatórios',
                error: 'MISSING_REQUIRED_FIELDS'
            });
        }

        const result = socketManager.sendPropertyRecommendation(userId, propertyData);
        
        res.json({
            success: true,
            message: 'Recomendação de propriedade enviada com sucesso',
            data: {
                userId,
                sent: result,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erro ao enviar recomendação de propriedade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao enviar recomendação de propriedade',
            error: error.message
        });
    }
};

// Limpar salas vazias (manutenção)
export const cleanupRooms = (req, res) => {
    try {
        const socketManager = getSocketManager();
        
        if (!socketManager) {
            return res.status(500).json({
                success: false,
                message: 'Socket Manager não está disponível',
                error: 'SERVICE_UNAVAILABLE'
            });
        }

        const cleaned = socketManager.cleanupEmptyRooms();
        
        res.json({
            success: true,
            message: 'Limpeza de salas concluída',
            data: {
                roomsCleaned: cleaned,
                cleanedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erro ao limpar salas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao limpar salas',
            error: error.message
        });
    }
};