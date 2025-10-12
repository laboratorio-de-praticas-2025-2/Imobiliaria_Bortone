/**
 * Helper para usar o SocketManager em qualquer lugar da aplicação
 * Versão simplificada - apenas funções essenciais SEM REDUNDÂNCIA
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

// ===== FUNÇÕES CORE - SEM REDUNDÂNCIA =====

/**
 * Envia notificação para um usuário específico
 * @param {number} userId - ID do usuário
 * @param {string} event - Nome do evento
 * @param {Object} data - Dados da notificação
 * @returns {boolean} - True se enviado com sucesso
 */
export const sendToUser = (userId, event, data) => {
    if (!socketManagerInstance) {
        console.warn('SocketManager não está disponível para envio de notificação');
        return false;
    }

    try {
        return socketManagerInstance.sendToUser(String(userId), event, data);
    } catch (error) {
        console.error('Erro ao enviar notificação para usuário:', error);
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
        const userIdsStr = userIds.map(String);
        return socketManagerInstance.sendToUsers(userIdsStr, event, data);
    } catch (error) {
        console.error('Erro ao enviar para múltiplos usuários:', error);
        return [];
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
        socketManagerInstance.broadcastPublic(event, data);
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

// ===== FUNÇÕES DE UTILIDADE =====

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
        return socketManagerInstance.isUserConnected(String(userId));
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