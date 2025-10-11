export async function simularFinanciamento(dados) {
  try {
    const response = await fetch('http://localhost:4000/simulador/calcular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao conectar com o backend:', error);
    return { sucesso: false, erro: 'Erro de conexão com o servidor' };
  }
}