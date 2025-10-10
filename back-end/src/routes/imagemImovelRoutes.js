import express from 'express';
import * as ImagemImovelController from '../controllers/ImagemImovelController.js';

const router = express.Router();

// Nova rota para criar referência de imagem (sem upload)
router.post('/', ImagemImovelController.createImageReference);

// Manter compatibilidade com o upload antigo (agora deprecado)
router.post('/upload', ImagemImovelController.createImageReference);

router.delete('/:id', ImagemImovelController.deleteImage);

router.get('/:id', ImagemImovelController.getImageById);

router.get('/imovel/:imovelId', ImagemImovelController.getImagesByImovelId);

export default router;
