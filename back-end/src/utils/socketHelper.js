/**
 * Helper para usar o SocketManager em qualquer lugar da aplicação
 * Fornece uma interface simplificada para envio de notificações
 */

let socketManagerInstance = null;

/**
 * Configura a instância global do SocketManager
 * @param {SocketManager} socketManager - Instância do SocketManager
 */
export const setSocketManager = (socketManager) => {
    socketManagerInstance = socketManager;
    console.log('SocketManager configurado globalmente');
};

/**
 * Obtém a instância atual do SocketManager
 * @returns {SocketManager|null}
 */
export const getSocketManager = () => {
    return socketManagerInstance;
};

/**
 * Verifica se o SocketManager está disponível
 * @returns {boolean}
 */
export const isSocketManagerAvailable = () => {
    return socketManagerInstance !== null;
};

/**
 * Envia notificação para um usuário específico
 * @param {number} userId - ID do usuário
 * @param {Object} notification - Dados da notificação
 * @returns {boolean} - True se enviado com sucesso
 */
export const sendNotificationToUser = (userId, notification) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para envio de notificação');
        return false;
    }
    
    try {
        return socketManagerInstance.sendNotification(userId, notification);
    } catch (error) {
        console.error('Erro ao enviar notificação para usuário:', error);
        return false;
    }
};

/**
 * Envia recomendação de propriedade para um usuário
 * @param {number} userId - ID do usuário
 * @param {Object} recommendation - Dados da recomendação
 * @returns {boolean} - True se enviado com sucesso
 */
export const sendPropertyRecommendation = (userId, recommendation) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para envio de recomendação');
        return false;
    }
    
    try {
        return socketManagerInstance.sendPropertyRecommendation(userId, recommendation);
    } catch (error) {
        console.error('Erro ao enviar recomendação de propriedade:', error);
        return false;
    }
};

/**
 * Envia broadcast para todos os usuários conectados
 * @param {string} event - Nome do evento
 * @param {Object} data - Dados a serem enviados
 * @returns {boolean} - True se enviado com sucesso
 */
export const broadcastNotification = (event, data) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para broadcast');
        return false;
    }
    
    try {
        socketManagerInstance.broadcast(event, data);
        return true;
    } catch (error) {
        console.error('Erro ao fazer broadcast:', error);
        return false;
    }
};

/**
 * Envia notificação para usuários de um papel específico
 * @param {string} role - Papel dos usuários (admin, corretor, user, etc.)
 * @param {string} event - Nome do evento
 * @param {Object} data - Dados a serem enviados
 * @returns {boolean} - True se enviado com sucesso
 */
export const sendToRole = (role, event, data) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para envio por papel');
        return false;
    }
    
    try {
        socketManagerInstance.sendToRole(role, event, data);
        return true;
    } catch (error) {
        console.error('Erro ao enviar para papel:', error);
        return false;
    }
};

/**
 * Envia notificação para múltiplos usuários
 * @param {number[]} userIds - Array de IDs dos usuários
 * @param {string} event - Nome do evento
 * @param {Object} data - Dados a serem enviados
 * @returns {Array} - Array com resultado para cada usuário
 */
export const sendToMultipleUsers = (userIds, event, data) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para envio múltiplo');
        return [];
    }
    
    try {
        return socketManagerInstance.sendToUsers(userIds, event, data);
    } catch (error) {
        console.error('Erro ao enviar para múltiplos usuários:', error);
        return [];
    }
};

/**
 * Envia notificação para uma sala específica
 * @param {string} roomName - Nome da sala
 * @param {string} event - Nome do evento
 * @param {Object} data - Dados a serem enviados
 * @returns {boolean} - True se enviado com sucesso
 */
export const sendToRoom = (roomName, event, data) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para envio para sala');
        return false;
    }
    
    try {
        socketManagerInstance.sendToRoom(roomName, event, data);
        return true;
    } catch (error) {
        console.error('Erro ao enviar para sala:', error);
        return false;
    }
};

/**
 * Verifica se um usuário está conectado
 * @param {number} userId - ID do usuário
 * @returns {boolean} - True se o usuário está conectado
 */
export const isUserConnected = (userId) => {
    if (!socketManagerInstance) {
        return false;
    }
    
    try {
        return socketManagerInstance.isUserConnected(userId);
    } catch (error) {
        console.error('Erro ao verificar conexão do usuário:', error);
        return false;
    }
};

/**
 * Obtém lista de usuários conectados
 * @returns {number[]} - Array de IDs dos usuários conectados
 */
export const getConnectedUsers = () => {
    if (!socketManagerInstance) {
        return [];
    }
    
    try {
        return socketManagerInstance.getConnectedUsers();
    } catch (error) {
        console.error('Erro ao obter usuários conectados:', error);
        return [];
    }
};

/**
 * Envia notificação de sistema (alta prioridade)
 * @param {Object} notification - Dados da notificação do sistema
 * @returns {boolean} - True se enviado com sucesso
 */
export const sendSystemNotification = (notification) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para notificação de sistema');
        return false;
    }
    
    try {
        return socketManagerInstance.sendSystemNotification(notification);
    } catch (error) {
        console.error('Erro ao enviar notificação de sistema:', error);
        return false;
    }
};

/**
 * Desconecta um usuário específico
 * @param {number} userId - ID do usuário
 * @param {string} reason - Motivo da desconexão
 * @returns {boolean} - True se desconectado com sucesso
 */
export const disconnectUser = (userId, reason = 'Desconectado pelo sistema') => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para desconexão');
        return false;
    }
    
    try {
        return socketManagerInstance.disconnectUser(userId, reason);
    } catch (error) {
        console.error('Erro ao desconectar usuário:', error);
        return false;
    }
};

// Funções de conveniência para tipos específicos de notificação

/**
 * Envia notificação de novo imóvel disponível
 */
export const notifyNewProperty = (userIds, propertyData) => {
    return sendToMultipleUsers(userIds, 'new_property', {
        type: 'new_property',
        title: 'Novo Imóvel Disponível',
        message: 'Um novo imóvel foi adicionado ao nosso catálogo!',
        property: propertyData
    });
};

/**
 * Envia notificação de alteração de preço
 */
export const notifyPriceChange = (userIds, propertyId, oldPrice, newPrice) => {
    return sendToMultipleUsers(userIds, 'price_change', {
        type: 'price_change',
        title: 'Alteração de Preço',
        message: 'O preço de um imóvel de seu interesse foi alterado',
        propertyId,
        oldPrice,
        newPrice
    });
};

/**
 * Envia notificação de agendamento
 */
export const notifyAppointment = (userId, appointmentData) => {
    return sendNotificationToUser(userId, {
        type: 'appointment',
        title: 'Novo Agendamento',
        message: 'Você tem um novo agendamento de visita',
        appointment: appointmentData
    });
};

/**
 * Envia notificação de mensagem do chat
 */
export const notifyNewMessage = (userId, messageData) => {
    return sendNotificationToUser(userId, {
        type: 'new_message',
        title: 'Nova Mensagem',
        message: 'Você recebeu uma nova mensagem',
        messageData
    });
};