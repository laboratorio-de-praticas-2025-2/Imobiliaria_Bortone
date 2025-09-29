const multiparty = require('multiparty');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    // Parse do multipart form data
    const form = new multiparty.Form();
    
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    console.log('Fields:', fields);
    console.log('Files:', Object.keys(files));

    const uploadedFile = files.image?.[0] || files.imagem?.[0];
    if (!uploadedFile) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nenhum arquivo enviado' })
      };
    }

    // Gerar nome único
    const fileExtension = path.extname(uploadedFile.originalFilename);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    
    // Definir pasta de destino
    const folder = fields.folder?.[0] || 'imoveis';
    const publicDir = path.join(process.cwd(), 'public', 'images', folder);
    
    // Criar diretório se não existir
    await fs.mkdir(publicDir, { recursive: true });
    
    // Caminho final do arquivo
    const destinationPath = path.join(publicDir, fileName);
    
    // Copiar arquivo do temp para destino
    await fs.copyFile(uploadedFile.path, destinationPath);
    
    // Limpar arquivo temporário
    try {
      await fs.unlink(uploadedFile.path);
    } catch (cleanupError) {
      console.warn('Erro ao limpar arquivo temporário:', cleanupError);
    }

    console.log('Upload successful:', fileName);

    // Resposta de sucesso
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        url: `/images/${folder}/${fileName}`,
        fileName: fileName,
        originalName: uploadedFile.originalFilename,
        size: uploadedFile.size
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
