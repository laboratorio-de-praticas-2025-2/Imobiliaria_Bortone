import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    
    // Validar nome do arquivo para segurança
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // Determinar caminho baseado no ambiente
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    let imagePath;
    
    if (isVercel) {
      // No Vercel, buscar na pasta temporária
      imagePath = path.join(os.tmpdir(), 'publicidadeImages', filename);
    } else {
      // Em desenvolvimento local, buscar na pasta public
      imagePath = path.join(process.cwd(), 'public', 'images', 'publicidadeImages', filename);
    }

    console.log('Buscando imagem em:', imagePath);

    // Verificar se o arquivo existe
    if (!fs.existsSync(imagePath)) {
      console.log('Arquivo não encontrado:', imagePath);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Ler o arquivo
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determinar o tipo MIME baseado na extensão
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg'; // padrão
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }

    // Retornar a imagem com headers apropriados
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache por 1 ano
      },
    });

  } catch (error) {
    console.error('Erro ao servir imagem:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}