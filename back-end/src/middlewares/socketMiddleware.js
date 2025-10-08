/**
 * Middleware para injetar o SocketManager nos requests
 * Permite que controllers e rotas tenham acesso ao sistema de Socket.IO
 */
const socketMiddleware = (req, res, next) => {
    // Obter o SocketManager da aplicação
    req.socketManager = req.app.get('socketManager');
    
    // Adicionar métodos de conveniência ao request
    req.sendSocketNotification = (userId, notification) => {
        if (req.socketManager) {
            return req.socketManager.sendNotification(userId, notification);
        }
        return false;
    };

    req.sendPropertyRecommendation = (userId, recommendation) => {
        if (req.socketManager) {
            return req.socketManager.sendPropertyRecommendation(userId, recommendation);
        }
        return false;
    };

    req.broadcastNotification = (event, data) => {
        if (req.socketManager) {
            return req.socketManager.broadcast(event, data);
        }
        return false;
    };

    next();
};

export default socketMiddleware;