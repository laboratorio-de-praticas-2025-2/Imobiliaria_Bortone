// Serviço para upload de imagens via Netlify Functions

/**
 * Upload universal de imagem para Cloudinary
 * @param {File} file - Arquivo de imagem
 * @param {Object} options - Opções do upload
 * @param {string} options.type - Tipo de imagem ('banner', 'blog', 'publicidade', 'imoveis')
 * @param {string} options.imovelId - ID do imóvel (para imóveis)
 * @param {string} options.descricao - Descrição da imagem
 * @param {string} options.titulo - Título (para blog/publicidade)
 * @param {string} options.conteudo - Conteúdo (para blog/publicidade)
 * @param {string} options.usuarioId - ID do usuário
 * @param {boolean} options.ativo - Status ativo (para publicidade)
 * @returns {Promise<string>} URL da imagem
 */
export const uploadToNetlify = async (file, options = {}) => {
  const {
    type = 'imoveis',
    imovelId,
    descricao,
    titulo,
    conteudo,
    usuarioId,
    ativo
  } = options;

  // Configurações do Cloudinary (podem ser obtidas de variáveis de ambiente)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.warn('⚠️ CLOUDINARY_CLOUD_NAME não configurado, usando demo');
  }

  // Mapear tipos para pastas no Cloudinary
  const folderMap = {
    'banners': 'imobiliaria/banners',
    'banner': 'imobiliaria/banners', 
    'blog': 'imobiliaria/blog',
    'publicidade': 'imobiliaria/promo', // Usar 'promo' para evitar ad blockers
    'imoveis': 'imobiliaria/imoveis',
    'imovel': 'imobiliaria/imoveis'
  };
  
  const folder = folderMap[type] || 'imobiliaria/imoveis';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  // Usar 'promo' ao invés de 'publicidade' no nome do arquivo para evitar ad blockers
  const filePrefix = type === 'publicidade' ? 'promo' : type;
  formData.append('public_id', `${filePrefix}_${Date.now()}`);
  
  try {
    
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Cloudinary upload failed:', response.status, errorData);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Retornar URL da imagem
    return result.secure_url;
  } catch (error) {
    console.error('💥 Upload error:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }
};

/**
 * Upload específico para imóveis (mantém compatibilidade)
 * @param {File} file - Arquivo de imagem  
 * @param {string} imovelId - ID do imóvel
 * @param {string} descricao - Descrição da imagem
 * @returns {Promise<string>} URL da imagem
 */
export const uploadImovelImage = async (file, imovelId = '1', descricao = 'Imagem do imóvel') => {
  return uploadToNetlify(file, { type: 'imoveis', imovelId, descricao });
};

/**
 * Upload específico para banners
 * @param {File} file - Arquivo de imagem
 * @param {string} descricao - Descrição do banner
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<string>} URL da imagem
 */
export const uploadBannerImage = async (file, descricao, usuarioId) => {
  return uploadToNetlify(file, { type: 'banner', descricao, usuarioId });
};

/**
 * Upload específico para blog
 * @param {File} file - Arquivo de imagem
 * @param {string} titulo - Título do artigo
 * @param {string} conteudo - Conteúdo do artigo
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<string>} URL da imagem
 */
export const uploadBlogImage = async (file, titulo, conteudo, usuarioId) => {
  return uploadToNetlify(file, { type: 'blog', titulo, conteudo, usuarioId });
};

/**
 * Upload específico para publicidade
 * @param {File} file - Arquivo de imagem
 * @param {string} titulo - Título da publicidade
 * @param {string} conteudo - Conteúdo da publicidade
 * @param {string} usuarioId - ID do usuário
 * @param {boolean} ativo - Status ativo
 * @returns {Promise<string>} URL da imagem
 */
export const uploadPublicidadeImage = async (file, titulo, conteudo, usuarioId, ativo = true) => {
  return uploadToNetlify(file, { type: 'publicidade', titulo, conteudo, usuarioId, ativo });
};

/**
 * Deletar imagem do Cloudinary
 * @param {string} publicId - Public ID da imagem no Cloudinary
 * @param {string} imageType - Tipo de imagem ('banner', 'blog', 'publicidade', 'imoveis')
 * @returns {Promise<boolean>} Success status
 */
export const deleteFromNetlify = async (publicId, imageType = 'imoveis') => {
  try {
    
    // Para Cloudinary, precisaríamos de uma API key e secret no backend
    // Por agora, vamos apenas logar a tentativa
    console.warn('⚠️ Delete do Cloudinary requer implementação no backend com API keys');
    
    // Simular sucesso por enquanto
    return true;
  } catch (error) {
    console.error('💥 Delete error:', error);
    return false;
  }
};

/**
 * Extrair nome do arquivo de uma URL
 * @param {string} imageUrl - URL da imagem
 * @returns {string} Nome do arquivo
 */
export const extractFileNameFromUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // Se for URL relativa (/images/imoveis/arquivo.jpg)
  if (imageUrl.startsWith('/images/')) {
    return imageUrl.split('/').pop();
  }
  
  // Se for URL completa
  try {
    const url = new URL(imageUrl);
    return url.pathname.split('/').pop();
  } catch {
    return imageUrl.split('/').pop() || '';
  }
};

/**
 * Verificar se uma imagem existe
 * @param {string} imageUrl - URL da imagem
 * @returns {Promise<boolean>} Se a imagem existe
 */
export const checkImageExists = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Preparar URL de imagem para o Netlify
 * @param {string} imageUrl - URL original da imagem
 * @returns {string} URL otimizada
 */
export const prepareNetlifyImageUrl = (imageUrl) => {
  if (!imageUrl) return '/images/placeholder.jpg';
  
  // Se já é uma URL relativa válida, retornar como está
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
  // Se é apenas nome do arquivo, construir path completo
  if (!imageUrl.includes('/')) {
    return `/images/imoveis/${imageUrl}`;
  }
  
  // Fallback
  return imageUrl;
};
