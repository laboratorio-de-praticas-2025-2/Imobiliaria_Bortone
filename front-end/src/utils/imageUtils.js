// Utilitário para construção unificada de URLs de imagens no CMS
// Este arquivo centraliza toda a lógica de construção de URLs de imagens

import { useState, useEffect, useCallback } from 'react';

// Importar o novo sistema Cloudinary
import { buildImageUrl as buildCloudinaryImageUrl, useCloudinaryImage } from './cloudinaryImageUtils';

/**
 * Constrói URL da imagem com prioridade para Cloudinary
 * @param {string} imageUrl - URL da imagem vinda do banco de dados
 * @param {string} type - Tipo de conteúdo ('banner', 'publicidade', 'publicacao', 'imovel')
 * @param {string} fallback - Imagem de fallback (opcional)
 * @returns {string} URL completa da imagem
 */
export function buildImageUrl(imageUrl, type = 'default', fallback = '/404.png') {
  // Usar o novo sistema Cloudinary
  return buildCloudinaryImageUrl(imageUrl, type, { fallback });
}

/**
 * Obtém a URL base da API
 * @returns {string} URL base da API sem trailing slash
 */
function getApiBaseUrl() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : '');
  
  if (!rawApiUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ NEXT_PUBLIC_API_URL não definida!');
    }
    return '';
  }
  
  const cleanUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🌐 API Base URL:', { raw: rawApiUrl, clean: cleanUrl });
  }
  
  return cleanUrl;
}

/**
 * Determina a pasta da imagem baseada no tipo
 * @param {string} type - Tipo de conteúdo
 * @returns {string} Nome da pasta
 */
function getImageFolder(type) {
  const folders = {
    'banner': 'bannerImages',
    'publicidade': 'publicidadeImages', 
    'publicacao': 'blogImages',
    'blog': 'blogImages',
    'imovel': 'imovelImages',
    'default': 'uploads'
  };
  
  const folder = folders[type] || folders.default;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📁 Pasta determinada:', { type, folder });
  }
  
  return folder;
}

/**
 * Constrói URL da imagem com proxy para evitar ad blockers
 * @param {string} imageUrl - URL da imagem
 * @param {string} type - Tipo de conteúdo
 * @returns {string} URL da imagem ou proxy se necessário
 */
export function buildImageUrlWithProxy(imageUrl, type = 'default') {
  const url = buildImageUrl(imageUrl, type);
  
  // Se contém "publicidade" e é do Cloudinary, usar proxy para evitar ad blockers
  if (url.includes('publicidade') && url.includes('res.cloudinary.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

/**
 * Valida se uma URL de imagem é válida
 * @param {string} imageUrl - URL para validar
 * @returns {boolean} true se válida
 */
export function isValidImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }
  
  // URLs absolutas válidas
  if (imageUrl.startsWith('http://') || 
      imageUrl.startsWith('https://') || 
      imageUrl.startsWith('data:')) {
    return true;
  }
  
  // URLs relativas válidas
  if (imageUrl.startsWith('/') || imageUrl.length > 0) {
    return true;
  }
  
  return false;
}

/**
 * Hook para gerenciar estado de erro de imagem com sistema Cloudinary
 * @param {string} imageUrl - URL da imagem
 * @param {string} type - Tipo de conteúdo
 * @returns {object} { src, error, handleError, resetError }
 */
export function useImageWithFallback(imageUrl, type = 'default') {
  // Usar o hook Cloudinary mais robusto
  return useCloudinaryImage(imageUrl, type);
}

// Para compatibilidade, manter exports das funções antigas
export const getImageUrl = buildImageUrl;
export const getImageUrlWithProxy = buildImageUrlWithProxy;