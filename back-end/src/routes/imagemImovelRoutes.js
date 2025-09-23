import express from 'express';
import * as ImagemImovelController from '../controllers/ImagemImovelController.js';

const router = express.Router();

router.post('/upload', ImagemImovelController.uploadImage);

router.delete('/:id', ImagemImovelController.deleteImage);

router.get('/:id', ImagemImovelController.getImageById);

router.get('/imovel/:imovelId', ImagemImovelController.getImagesByImovelId);

export default router;
