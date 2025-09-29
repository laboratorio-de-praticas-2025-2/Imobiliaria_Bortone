// Serviço para upload de imagens via Netlify Functions

/**
 * Upload de imagem para Netlify (via proxy para backend)
 * @param {File} file - Arquivo de imagem
 * @param {string} imovelId - ID do imóvel
 * @param {string} descricao - Descrição da imagem
 * @returns {Promise<string>} URL da imagem
 */
export const uploadToNetlify = async (file, imovelId = '1', descricao = 'Imagem do imóvel') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('imovel_id', imovelId);
  formData.append('descricao', descricao);

  try {
    console.log('🚀 Uploading via Netlify Function:', { 
      fileName: file.name, 
      size: file.size,
      imovelId,
      descricao 
    });
    
    const response = await fetch('/.netlify/functions/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Upload failed:', response.status, errorData);
      
      // Tentar parsear erro JSON
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorData);
      } catch {
        errorDetails = { error: errorData };
      }
      
      throw new Error(errorDetails.error || `Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);
    
    // Retornar URL da imagem
    return result.url;
  } catch (error) {
    console.error('💥 Upload error:', error);
    throw new Error(`Falha no upload: ${error.message}`);
  }
};

/**
 * Deletar imagem do Netlify
 * @param {string} fileName - Nome do arquivo
 * @param {string} folder - Pasta onde está o arquivo (default: 'imoveis')
 * @returns {Promise<boolean>} Success status
 */
export const deleteFromNetlify = async (fileName, folder = 'imoveis') => {
  try {
    console.log('Deleting from Netlify:', { fileName, folder });
    
    const response = await fetch('/.netlify/functions/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, folder })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Delete failed:', response.status, errorData);
      return false;
    }

    const result = await response.json();
    console.log('Delete successful:', result);
    
    return true;
  } catch (error) {
    console.error('Delete error:', error);
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
