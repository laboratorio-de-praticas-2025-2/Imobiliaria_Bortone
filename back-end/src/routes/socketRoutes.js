import express from 'express';
import { 
    getConnectionStats, 
    getUserConnectionStatus, 
    getRoomInfo,
    disconnectUser,
    cleanupRooms
} from '../controllers/socketController.js';

const router = express.Router();

// Rotas públicas para estatísticas e status
router.get('/stats', getConnectionStats);
router.get('/user/:userId/status', getUserConnectionStatus);
router.get('/room/:roomName/info', getRoomInfo);

// Rotas administrativas
router.post('/user/:userId/disconnect', disconnectUser);
router.post('/cleanup', cleanupRooms);

export default router;