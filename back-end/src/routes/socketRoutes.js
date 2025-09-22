import express from 'express';
import { 
    getConnectionStats, 
    getUserConnectionStatus, 
    sendNotification,
    getRoomInfo,
    disconnectUser,
    sendPropertyRecommendation,
    cleanupRooms
} from '../controllers/socketController.js';

const router = express.Router();

// Rotas públicas para estatísticas e status
router.get('/stats', getConnectionStats);
router.get('/user/:userId/status', getUserConnectionStatus);
router.get('/room/:roomName/info', getRoomInfo);

// Rotas para envio de notificações
router.post('/notify', sendNotification);
router.post('/property-recommendation', sendPropertyRecommendation);

// Rotas administrativas
router.post('/user/:userId/disconnect', disconnectUser);
router.post('/cleanup', cleanupRooms);

export default router;