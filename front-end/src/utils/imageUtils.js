// Utilitário para construção unificada de URLs de imagens no CMS
// Este arquivo centraliza toda a lógica de construção de URLs de imagens

import { useState, useEffect, useCallback } from 'react';

/**
 * Constrói URL da imagem baseada no tipo de conteúdo e URL fornecida
 * @param {string} imageUrl - URL da imagem vinda do banco de dados
 * @param {string} type - Tipo de conteúdo ('banner', 'publicidade', 'publicacao', 'imovel')
 * @param {string} fallback - Imagem de fallback (opcional)
 * @returns {string} URL completa da imagem
 */
export function buildImageUrl(imageUrl, type = 'default', fallback = '/404.png') {
  // Log para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log('🖼️ buildImageUrl:', { imageUrl, type, fallback });
  }

  // Se não há imagem, retorna fallback
  if (!imageUrl || imageUrl.trim() === '') {
    console.warn('⚠️ Imagem vazia ou nula, usando fallback:', fallback);
    return fallback;
  }

  // Limpar espaços em branco
  const cleanImageUrl = imageUrl.trim();

  // URLs absolutas (http/https/data:) - retorna diretamente
  if (cleanImageUrl.startsWith('http://') || 
      cleanImageUrl.startsWith('https://') || 
      cleanImageUrl.startsWith('data:')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ URL absoluta detectada:', cleanImageUrl);
    }
    return cleanImageUrl;
  }

  // URLs que já começam com / - adiciona base URL se necessário
  if (cleanImageUrl.startsWith('/')) {
    const apiUrl = getApiBaseUrl();
    if (apiUrl && cleanImageUrl.startsWith('/images/')) {
      const finalUrl = `${apiUrl}${cleanImageUrl}`;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ URL relativa com API base:', finalUrl);
      }
      return finalUrl;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ URL relativa sem API base:', cleanImageUrl);
    }
    return cleanImageUrl;
  }

  // URLs relativas - determina pasta baseada no tipo
  const folder = getImageFolder(type);
  const apiUrl = getApiBaseUrl();
  
  let finalUrl;
  if (apiUrl) {
    finalUrl = `${apiUrl}/images/${folder}/${cleanImageUrl}`;
  } else {
    finalUrl = `/images/${folder}/${cleanImageUrl}`;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ URL construída:', { folder, finalUrl });
  }
  
  return finalUrl;
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
 * Hook para gerenciar estado de erro de imagem
 * @param {string} imageUrl - URL da imagem
 * @param {string} type - Tipo de conteúdo
 * @returns {object} { src, error, handleError, resetError }
 */
export function useImageWithFallback(imageUrl, type = 'default') {
  const [error, setError] = useState(false);
  
  const src = error ? '/404.png' : buildImageUrlWithProxy(imageUrl, type);
  
  const handleError = useCallback((event) => {
    console.warn(`Erro ao carregar imagem: ${imageUrl}`, {
      src: event?.target?.src,
      naturalWidth: event?.target?.naturalWidth,
      naturalHeight: event?.target?.naturalHeight,
      error: event?.error
    });
    setError(true);
  }, [imageUrl]);
  
  const resetError = useCallback(() => {
    setError(false);
  }, []);
  
  // Reset error when imageUrl changes
  useEffect(() => {
    resetError();
  }, [imageUrl, resetError]);
  
  return {
    src,
    error,
    handleError,
    resetError
  };
}

// Para compatibilidade, manter exports das funções antigas
export const getImageUrl = buildImageUrl;
export const getImageUrlWithProxy = buildImageUrlWithProxy;