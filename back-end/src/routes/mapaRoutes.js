import express from 'express';
import mapaController from '../controllers/mapaController.js';

const router = express.Router();

/**
 * @route   GET /mapa
 * @desc    Lista todos os imóveis com filtros opcionais
 * @access  Public
 * @query   tipo, precoMin, precoMax, areaMin, areaMax, tipoNegociacao, cidade, estado, murado, latitude, longitude, raio
 */
router.get('/', mapaController.listarImoveis);

/**
 * @route   GET /mapa/busca
 * @desc    Busca imóveis para a tela do mapa com filtros específicos
 * @access  Public
 * @query   tipo, precoMin, precoMax, areaMin, areaMax, quartos, banheiros, possuiPiscina, possuiJardim, murado
 */
router.get('/busca', mapaController.buscarImoveisParaMapa);

/**
 * @route   GET /mapa/coordenadas
 * @desc    Busca imóveis por coordenadas geográficas
 * @access  Public
 * @query   lat, lng, raio
 */
router.get('/coordenadas', mapaController.buscarImoveisPorCoordenadas);

/**
 * @route   GET /mapa/tipos
 * @desc    Lista todos os tipos de imóveis disponíveis
 * @access  Public
 */
router.get('/tipos', mapaController.listarTiposImoveis);

/**
 * @route   GET /mapa/cidades
 * @desc    Lista todas as cidades disponíveis
 * @access  Public
 */
router.get('/cidades', mapaController.listarCidades);

/**
 * @route   GET /mapa/:id
 * @desc    Busca imóvel específico por ID
 * @access  Public
 * @param   id - ID do imóvel
 */
router.get('/:id', mapaController.buscarImovelPorId);

export default router;
