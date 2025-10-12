// Utilitário para converter gráficos Chart.js em imagens
export async function chartToImage(chartRef, width = 400, height = 300) {
  if (!chartRef.current || !chartRef.current.chartInstance) {
    throw new Error('Chart reference not found');
  }

  const chart = chartRef.current.chartInstance;
  
  // Força o update do gráfico
  chart.update('none');
  
  // Aguarda um pouco para garantir que o gráfico foi renderizado
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Captura o canvas como imagem
  const canvas = chart.canvas;
  const dataURL = canvas.toDataURL('image/png', 1.0);
  
  return {
    dataURL,
    width,
    height
  };
}

// Função para capturar múltiplos gráficos
export async function captureAllCharts(chartRefs) {
  const images = [];
  
  for (const { ref, width, height } of chartRefs) {
    try {
      const image = await chartToImage(ref, width, height);
      images.push(image);
    } catch (error) {
      console.error('Erro ao capturar gráfico:', error);
    }
  }
  
  return images;
}
