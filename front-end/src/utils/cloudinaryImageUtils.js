"use client";
// Sistema de URL de imagens com prioridade para Cloudinary
// Este arquivo centraliza toda a lógica de URLs de imagens com fallback adequado

/**
 * Configurações do Cloudinary
 */
const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dajy4w5wi',
  baseUrl: 'https://res.cloudinary.com'
};

/**
 * Mapeamento de tipos para pastas do Cloudinary
 */
const CLOUDINARY_FOLDERS = {
  'banner': 'imobiliaria/banners',
  'banners': 'imobiliaria/banners',
  'blog': 'imobiliaria/blog',
  'publicacao': 'imobiliaria/blog',
  'publicidade': 'imobiliaria/promo', // Usar 'promo' para evitar ad blockers
  'imovel': 'imobiliaria/imoveis',
  'imoveis': 'imobiliaria/imoveis',
  'default': 'imobiliaria/imoveis'
};

/**
 * Verifica se uma URL é do Cloudinary
 * @param {string} url - URL para verificar
 * @returns {boolean}
 */
function isCloudinaryUrl(url) {
  return url && (
    url.includes('res.cloudinary.com') ||
    url.includes('cloudinary.com')
  );
}

/**
 * Constrói URL otimizada do Cloudinary
 * @param {string} publicId - Public ID da imagem no Cloudinary
 * @param {Object} options - Opções de transformação
 * @returns {string}
 */
function buildCloudinaryUrl(publicId, options = {}) {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`
  ].join(',');

  return `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Extrai public_id de uma URL do Cloudinary
 * @param {string} url - URL do Cloudinary
 * @returns {string|null}
 */
function extractCloudinaryPublicId(url) {
  if (!isCloudinaryUrl(url)) return null;

  try {
    // Padrão: https://res.cloudinary.com/cloudname/image/upload/v123456/folder/subfolder/filename.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match) {
      // Remove extensão do arquivo
      return match[1].replace(/\.[^/.]+$/, '');
    }
  } catch (error) {
    console.warn('Erro ao extrair public_id:', error);
  }

  return null;
}

/**
 * Sistema principal para construir URLs de imagens
 * Prioriza Cloudiary > Backend > Fallback
 * @param {string} imageUrl - URL da imagem do banco de dados
 * @param {string} type - Tipo de conteúdo
 * @param {Object} options - Opções adicionais
 * @returns {string}
 */
export function buildImageUrl(imageUrl, type = 'default', options = {}) {
  const { fallback = '/404.png', cloudinaryOptions = {} } = options;

  // Log para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log('🖼️ buildImageUrl:', { imageUrl, type, options });
  }

  // Se não há imagem, retorna fallback
  if (!imageUrl || imageUrl.trim() === '') {
    console.warn('⚠️ Imagem vazia ou nula, usando fallback:', fallback);
    return fallback;
  }

  const cleanImageUrl = imageUrl.trim();

  // 1. PRIORIDADE: URLs do Cloudinary - retorna diretamente (já otimizadas)
  if (isCloudinaryUrl(cleanImageUrl)) {
    console.log('✅ URL do Cloudinary detectada:', cleanImageUrl);
    return cleanImageUrl;
  }

  // 2. URLs absolutas externas (http/https/data:) - retorna diretamente
  if (cleanImageUrl.startsWith('http://') || 
      cleanImageUrl.startsWith('https://') || 
      cleanImageUrl.startsWith('data:')) {
    console.log('✅ URL absoluta externa:', cleanImageUrl);
    return cleanImageUrl;
  }

  // 3. URLs relativas - tenta construir URL do Cloudinary primeiro
  if (cleanImageUrl.startsWith('/') || !cleanImageUrl.includes('/')) {
    // Extrair nome do arquivo
    const fileName = cleanImageUrl.startsWith('/') ? 
      cleanImageUrl.split('/').pop() : 
      cleanImageUrl;

    // Construir public_id baseado no tipo
    const folder = CLOUDINARY_FOLDERS[type] || CLOUDINARY_FOLDERS.default;
    const publicId = `${folder}/${fileName.replace(/\.[^/.]+$/, '')}`; // Remove extensão

    // Construir URL do Cloudinary
    const cloudinaryUrl = buildCloudinaryUrl(publicId, cloudinaryOptions);
    
    console.log('🌟 URL do Cloudinary construída:', {
      original: cleanImageUrl,
      publicId,
      cloudinaryUrl
    });

    return cloudinaryUrl;
  }

  // 4. FALLBACK: URLs do backend local (para desenvolvimento)
  const apiUrl = getApiBaseUrl();
  if (apiUrl) {
    const backendUrl = `${apiUrl}/images/${getImageFolder(type)}/${cleanImageUrl}`;
    console.log('🔄 Fallback para backend:', backendUrl);
    return backendUrl;
  }

  // 5. ÚLTIMO RECURSO: Fallback
  console.warn('⚠️ Não foi possível construir URL, usando fallback:', fallback);
  return fallback;
}

/**
 * Obtém a URL base da API (mantido para compatibilidade)
 */
function getApiBaseUrl() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : '');
  
  if (!rawApiUrl) return '';
  
  return rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

/**
 * Determina a pasta da imagem (mantido para compatibilidade)
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
  
  return folders[type] || folders.default;
}

/**
 * Sistema de fallback robusto para componentes de imagem
 * @param {string} imageUrl - URL original da imagem
 * @param {string} type - Tipo de conteúdo
 * @returns {Object} { src, handleError }
 */
export function useCloudinaryImage(imageUrl, type = 'default') {
  // Primeira tentativa: URL do Cloudinary ou construída
  const primarySrc = buildImageUrl(imageUrl, type, {
    cloudinaryOptions: {
      width: 800,
      height: 600,
      quality: 'auto',
      format: 'auto'
    }
  });

  const handleError = (event) => {
    const img = event.target;
    
    // Evitar loops infinitos
    if (img.dataset.fallbackAttempted) {
      console.error('❌ Fallback também falhou, escondendo imagem');
      img.style.display = 'none';
      return;
    }

    console.warn('⚠️ Erro ao carregar imagem, aplicando fallback:', {
      original: img.src,
      fallback: '/404.png'
    });

    // Marcar que fallback foi tentado
    img.dataset.fallbackAttempted = 'true';
    
    // Aplicar fallback
    img.src = '/404.png';
  };

  return {
    src: primarySrc,
    handleError
  };
}

// Exports para compatibilidade
export const getImageUrl = buildImageUrl;
export const buildImageUrlWithProxy = buildImageUrl; // Cloudinary não precisa de proxy
export { isCloudinaryUrl, buildCloudinaryUrl, extractCloudinaryPublicId };