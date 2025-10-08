import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    
    if (!targetUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Verificar se a URL é segura (localhost ou backend permitido)
    const allowedHosts = [
      'localhost:4000',
      '127.0.0.1:4000',
      'imobiliaria-bortone.onrender.com'
    ];
    
    const urlObject = new URL(targetUrl);
    const isAllowed = allowedHosts.some(host => urlObject.host === host);
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Unauthorized target URL' }, { status: 403 });
    }

    // Fazer a requisição para o backend
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js API Proxy'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const body = await request.json();
    
    if (!targetUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Verificar se a URL é segura
    const allowedHosts = [
      'localhost:4000',
      '127.0.0.1:4000',
      'imobiliaria-bortone.onrender.com'
    ];
    
    const urlObject = new URL(targetUrl);
    const isAllowed = allowedHosts.some(host => urlObject.host === host);
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Unauthorized target URL' }, { status: 403 });
    }

    // Fazer a requisição POST para o backend
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Next.js API Proxy'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post data', details: error.message }, 
      { status: 500 }
    );
  }
}