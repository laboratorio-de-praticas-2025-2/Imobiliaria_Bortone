// NOTA: Esta função Netlify não está sendo usada no projeto atual
// O upload é feito diretamente do frontend para Cloudinary
// Mantendo para referência futura ou caso seja necessário

const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Responder OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200,
      headers,  
      body: ''  
    }; 
  }

  // Só aceitar POST
  if (event.httpMethod !== 'POST') {
    return {   
      statusCode: 405,     
      headers,     
      body: JSON.stringify({ error: 'Method not allowed' })     
    };
  }

  try {
    console.log('🔍 NETLIFY CLOUDINARY UPLOAD FUNCTION');   
    console.log('Event headers:', event.headers);

    // Verificar se Cloudinary está configurado    
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary não configurado!');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Serviço de upload não configurado' })
      };
    }

    console.log('Event body length:', event.body?.length);

    // Verificar se o body é válido
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body deve ser JSON válido' })
      };
    }

    // Parse do body JSON (esperamos base64)
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Body deve ser JSON válido' })
      };
    }

    const { 
      file, // base64 string
      fileName,
      imageType = 'imoveis',
      imovelId,
      descricao,
      titulo,
      conteudo,
      usuarioId,
      ativo 
    } = requestData;

    if (!file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Arquivo (base64) é obrigatório' })
      };
    }

    console.log('📎 Upload iniciado:', {
      fileName,
      imageType,
      fileSize: file.length
    });

    // Mapear tipos para pastas no Cloudinary
    const folderMap = {
      'banners': 'imobiliaria/banners',
      'banner': 'imobiliaria/banners', 
      'blog': 'imobiliaria/blog',
      'publicidade': 'imobiliaria/publicidade',
      'imoveis': 'imobiliaria/imoveis',
      'imovel': 'imobiliaria/imoveis'
    };
    
    const folder = folderMap[imageType] || 'imobiliaria/imoveis';

    // Upload para Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'image',
      public_id: fileName ? fileName.replace(/\.[^/.]+$/, '') : undefined, // Remove extensão
      overwrite: false,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('✅ Upload bem-sucedido para Cloudinary:', {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      folder
    });

    // Retornar resultado
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        url: uploadResponse.secure_url,
        url_imagem: uploadResponse.secure_url, // Para compatibilidade
        fileName: uploadResponse.public_id,
        originalName: fileName,
        folder: folder,
        type: imageType,
        cloudinary: {
          public_id: uploadResponse.public_id,
          version: uploadResponse.version,
          width: uploadResponse.width,
          height: uploadResponse.height,
          bytes: uploadResponse.bytes
        }
      })
    };

  } catch (error) {
    console.error('💥 Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};