import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return new NextResponse('URL da imagem é obrigatória', { status: 400 });
    }

    // Verificar se é uma URL do Cloudinary válida
    if (!imageUrl.startsWith('https://res.cloudinary.com/')) {
      return new NextResponse('URL inválida', { status: 400 });
    }

    console.log('🔄 Proxy Image Request:', imageUrl);

    // Fazer fetch da imagem original
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-Proxy/1.0)',
      },
    });

    if (!response.ok) {
      console.error('❌ Falha ao buscar imagem:', response.status);
      return new NextResponse('Falha ao buscar imagem', { status: response.status });
    }

    // Obter o buffer da imagem
    const buffer = await response.arrayBuffer();
    
    // Retornar a imagem com headers apropriados
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('💥 Proxy error:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}