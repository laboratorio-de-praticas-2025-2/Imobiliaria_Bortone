export async function POST(request) {
  try {
    console.log('🔄 API Route: Recebendo requisição...');
    const body = await request.json();
    console.log('📨 Dados recebidos:', body);
    
    const response = await fetch('https://imobiliaria-bortone.onrender.com/simulador/calcular', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('🔗 Backend response status:', response.status);
    const data = await response.json();
    console.log('📊 Backend response:', data);
    
    return Response.json(data);
  } catch (error) {
    console.error('❌ Erro na API route:', error);
    return Response.json({
      sucesso: false,
      erro: 'Erro interno do servidor'
    }, { status: 500 });
  }
}