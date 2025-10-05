const multiparty = require('multiparty');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

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
    console.log('🔍 NETLIFY FUNCTION DEBUG:');
    console.log('Event headers:', event.headers);
    console.log('Event httpMethod:', event.httpMethod);
    console.log('Event isBase64Encoded:', event.isBase64Encoded);

    // ⚠️ PROBLEMA: Netlify Functions não pode salvar arquivos no public/
    // ✅ SOLUÇÃO: Proxy para backend que pode salvar arquivos
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    if (!backendUrl || backendUrl === 'undefined') {
      console.error('❌ NEXT_PUBLIC_API_URL não configurada!');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Variável de ambiente NEXT_PUBLIC_API_URL não configurada',
          debug: 'Configure no painel do Netlify: Site settings > Environment variables'
        })
      };
    }

    console.log('🌐 Fazendo proxy para backend:', backendUrl);

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

    console.log('📂 Fields recebidos:', Object.keys(fields));
    console.log('📁 Files recebidos:', Object.keys(files));

    const uploadedFile = files.image?.[0] || files.imagem?.[0];
    if (!uploadedFile) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nenhum arquivo enviado' })
      };
    }

    console.log('📎 Arquivo recebido:', {
      name: uploadedFile.originalFilename,
      size: uploadedFile.size,
      type: uploadedFile.headers['content-type']
    });

    // Criar FormData para enviar ao backend
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Ler arquivo e adicionar ao FormData
    const fileBuffer = await fs.readFile(uploadedFile.path);
    formData.append('imagem', fileBuffer, {
      filename: uploadedFile.originalFilename,
      contentType: uploadedFile.headers['content-type']
    });

    // Adicionar campos adicionais
    const imovelId = fields.imovel_id?.[0] || '1'; // ID padrão para teste
    const descricao = fields.descricao?.[0] || 'Imagem do imóvel';
    
    formData.append('imovel_id', imovelId);
    formData.append('descricao', descricao);

    // Fazer request para o backend
    const fetch = require('node-fetch');
    console.log('🚀 Enviando para backend...');
    
    const response = await fetch(`${backendUrl}/imagemImovel/upload`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    console.log('📡 Resposta do backend:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro do backend:', errorText);
      throw new Error(`Backend error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Upload bem-sucedido:', result);

    // Limpar arquivo temporário
    try {
      await fs.unlink(uploadedFile.path);
    } catch (cleanupError) {
      console.warn('⚠️ Erro ao limpar arquivo temporário:', cleanupError);
    }

    // Retornar resultado
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        url: result.url_imagem,
        fileName: result.url_imagem.split('/').pop(),
        originalName: uploadedFile.originalFilename,
        size: uploadedFile.size,
        backendResponse: result
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
