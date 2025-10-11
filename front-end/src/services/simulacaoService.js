export async function simularFinanciamento(dados) {
  try {
    console.log('📤 Enviando para API route...');
    const response = await fetch('/api/simulador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    console.log('📥 Resposta recebida:', response.status);
    const result = await response.json();
    console.log('📊 Resultado:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro completo:', error);
    return { sucesso: false, erro: 'Erro de conexão com o servidor' };
  }
}