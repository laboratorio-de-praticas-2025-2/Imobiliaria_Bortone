// Serviço para upload de imagens via Netlify Functions

/**
 * Upload de imagem para Netlify
 * @param {File} file - Arquivo de imagem
 * @param {string} folder - Pasta de destino (default: 'imoveis')
 * @returns {Promise<string>} URL da imagem
 */
export const uploadToNetlify = async (file, folder = 'imoveis') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  try {
    console.log('Uploading to Netlify:', { fileName: file.name, folder });
    
    const response = await fetch('/.netlify/functions/upload-image', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Upload failed:', response.status, errorData);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    
    return result.url;
  } catch (error) {
    console.error('Upload error:', error);
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
