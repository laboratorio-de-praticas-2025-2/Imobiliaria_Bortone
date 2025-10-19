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
 * Remove transformações inválidas de URLs do Cloudinary
 * Corrige URLs que foram salvas com transformações erradas
 * @param {string} url - URL possivelmente com transformações
 * @returns {string} URL limpa
 */
function cleanCloudinaryUrl(url) {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Detecta transformações entre /upload/ e o caminho do arquivo
  // Exemplos de padrões a remover:
  // /upload/w_800,h_600,c_fill,q_auto,f_auto/
  // /upload/w_auto,h_auto,c_fill,q_auto,f_auto/
  const transformRegex = /\/upload\/[^/]*(?:w_|h_|c_|q_|f_)[^/]*\//;
  
  if (transformRegex.test(url)) {
    console.warn('⚠️ URL com transformações detectada, limpando:', url);
    // Remove tudo entre /upload/ e o próximo /
    const cleaned = url.replace(transformRegex, '/upload/');
    console.log('✅ URL limpa:', cleaned);
    return cleaned;
  }
  
  return url;
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


  // Se não há imagem, retorna fallback
  if (!imageUrl || imageUrl.trim() === '') {
    console.warn('⚠️ Imagem vazia ou nula, usando fallback:', fallback);
    return fallback;
  }

  const cleanImageUrl = imageUrl.trim();

  // 1. PRIORIDADE: URLs do Cloudinary - retorna diretamente (sem transformações!)
  if (isCloudinaryUrl(cleanImageUrl)) {
    // ✅ Limpar transformações inválidas e retornar URL limpa
    return cleanCloudinaryUrl(cleanImageUrl);
  }

  // 2. URLs absolutas externas (http/https/data:) - retorna diretamente
  if (cleanImageUrl.startsWith('http://') || 
      cleanImageUrl.startsWith('https://') || 
      cleanImageUrl.startsWith('data:')) {
    return cleanImageUrl;
  }

  // 3. URLs relativas - retorna URL simples do Cloudinary SEM transformações
  if (cleanImageUrl.startsWith('/') || !cleanImageUrl.includes('/')) {
    // Extrair nome do arquivo
    const fileName = cleanImageUrl.startsWith('/') ? 
      cleanImageUrl.split('/').pop() : 
      cleanImageUrl;

    // Construir public_id baseado no tipo
    const folder = CLOUDINARY_FOLDERS[type] || CLOUDINARY_FOLDERS.default;
    const publicId = `${folder}/${fileName.replace(/\.[^/.]+$/, '')}`; // Remove extensão

    // ✅ Construir URL SIMPLES do Cloudinary SEM transformações
    const cloudinaryUrl = `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload/${publicId}`;
    
    return cloudinaryUrl;
  }

  // 4. FALLBACK: URLs do backend local (para desenvolvimento)
  const apiUrl = getApiBaseUrl();
  if (apiUrl) {
    const backendUrl = `${apiUrl}/images/${getImageFolder(type)}/${cleanImageUrl}`;
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
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliaria-bortone.onrender.com';
  
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
  // ✅ URL do Cloudinary SEM transformações por padrão
  const primarySrc = buildImageUrl(imageUrl, type);

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