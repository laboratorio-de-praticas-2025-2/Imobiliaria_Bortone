const fs = require('fs').promises;
const path = require('path');

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

  // Só aceitar DELETE
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { fileName, folder = 'imoveis' } = JSON.parse(event.body || '{}');
    
    if (!fileName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nome do arquivo é obrigatório' })
      };
    }

    const filePath = path.join(process.cwd(), 'public', 'images', folder, fileName);
    
    // Verificar se arquivo existe e deletar
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      
      console.log('File deleted successfully:', fileName);
      
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Arquivo deletado com sucesso',
          fileName: fileName
        })
      };
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Arquivo não encontrado' })
        };
      }
      throw fileError;
    }

  } catch (error) {
    console.error('Delete error:', error);
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
