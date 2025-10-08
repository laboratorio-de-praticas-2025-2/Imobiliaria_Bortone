// Nova implementação de PDF que funciona melhor com gráficos
let _jsPDF = null;

// Função para capturar ícones SVG como imagens com cor personalizada
async function captureIconsAsImages(element) {
  const iconImages = [];
  const svgElements = element.querySelectorAll('.card-container svg');
  
  for (let i = 0; i < svgElements.length; i++) {
    try {
      const svgElement = svgElements[i].cloneNode(true);
      
      // Alterar a cor do SVG para azul Bortone
      const paths = svgElement.querySelectorAll('path, circle, rect, polygon, line');
      paths.forEach(path => {
        path.setAttribute('fill', '#243B7B'); // Azul Bortone
        path.setAttribute('stroke', '#243B7B');
      });
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 48;
      canvas.height = 48;
      
      const img = new Image();
      const promise = new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 48, 48);
          resolve(canvas.toDataURL('image/png', 1.0));
        };
        img.onerror = () => resolve(null);
      });
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      iconImages[i] = await promise;
    } catch (error) {
      console.error(`Erro ao capturar ícone ${i}:`, error);
      iconImages[i] = null;
    }
  }
  
  return iconImages;
}

// Função para desenhar ícones específicos
const drawIcon = (pdf, iconType, x, y, size = 8) => {
  pdf.setFontSize(size);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(36, 54, 123); // Azul Bortone
  
  switch (iconType) {
    case 'check':
      // Desenhar checkmark em quadrado
      pdf.setFillColor(36, 54, 123);
      pdf.rect(x - 2, y - 2, 6, 6, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.text('✓', x, y + 1);
      break;
    case 'building':
      // Desenhar ícone de prédio (símbolo simples)
      pdf.setTextColor(36, 54, 123);
      pdf.setFillColor(36, 54, 123);
      // Desenhar retângulo simples para prédio
      pdf.rect(x - 3, y - 4, 6, 8, 'F');
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x - 2, y - 3, 2, 2, 'F');
      pdf.rect(x + 1, y - 3, 2, 2, 'F');
      pdf.rect(x - 2, y, 2, 2, 'F');
      pdf.rect(x + 1, y, 2, 2, 'F');
      break;
    case 'house':
      // Desenhar ícone de casa (símbolo simples)
      pdf.setTextColor(36, 54, 123);
      pdf.setFillColor(36, 54, 123);
      // Desenhar casa simples
      pdf.rect(x - 3, y - 2, 6, 4, 'F');
      // Telhado (usando retângulos)
      pdf.rect(x - 4, y - 3, 2, 1, 'F');
      pdf.rect(x - 2, y - 4, 2, 1, 'F');
      pdf.rect(x, y - 5, 2, 1, 'F');
      pdf.rect(x + 2, y - 4, 2, 1, 'F');
      break;
    case 'mountain':
      // Desenhar ícone de montanha (símbolo simples)
      pdf.setTextColor(36, 54, 123);
      pdf.setFillColor(36, 54, 123);
      // Desenhar montanha simples usando retângulos
      pdf.rect(x - 3, y - 1, 2, 3, 'F');
      pdf.rect(x - 1, y - 2, 2, 4, 'F');
      pdf.rect(x + 1, y - 1, 2, 3, 'F');
      break;
    default:
      pdf.text('•', x, y);
  }
};

export async function exportRelatorioToPdfV2(element, fileName = 'relatorio.pdf', reportType = 'geral') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Geração de PDF só pode ocorrer no cliente (browser).');
  }
  if (!element) throw new Error('Elemento não encontrado para gerar PDF');

  // Carrega jsPDF sob demanda
  if (!_jsPDF) {
    const mod = await import('jspdf');
    _jsPDF = mod.jsPDF || mod.default || mod;
  }

  const pdf = new _jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Capturar ícones SVG como imagens
  const iconImages = await captureIconsAsImages(element);
  
  // Captura os dados do relatório
  const reportData = element.querySelector('[data-report-data]')?.dataset?.reportData;
  let data = {};
  
  if (reportData) {
    try {
      data = JSON.parse(reportData);
    } catch (e) {
      console.error('Erro ao parsear dados do relatório:', e);
    }
  }

  // Background watermark removido completamente

  // Reset color
  pdf.setTextColor(0, 0, 0);

  // Header - Logo e título (layout corrigido)
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(36, 54, 123); // Azul Bortone
  pdf.text('BORTONE', 20, 20);
  pdf.text('GRUPO BORTONE', 20, 25);
  
  // Título principal (dinâmico baseado no tipo) - posicionamento ajustado
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const reportTitles = {
    'geral': 'Relatório Geral - Imobiliária Bortone',
    'imoveis': 'Relatório de Imóveis - Imobiliária Bortone',
    'vendas': 'Relatório de Vendas - Imobiliária Bortone',
    'alugueis': 'Relatório de Aluguéis - Imobiliária Bortone',
    'usuarios': 'Relatório de Usuários - Imobiliária Bortone'
  };
  const reportTitle = reportTitles[reportType] || 'Relatório - Imobiliária Bortone';
  pdf.text(reportTitle, 70, 20); // Posição ajustada para não cortar
  
  // Data (reposicionada)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 70, 30);

  // Seção principal (dinâmica baseada no tipo) - título em destaque como no preview
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0); // Preto para destacar
  
  const sectionTitles = {
    'geral': 'Imóveis',
    'imoveis': 'Imóveis',
    'vendas': 'Vendas',
    'alugueis': 'Aluguéis',
    'usuarios': 'Usuários'
  };
  const sectionTitle = sectionTitles[reportType] || 'Imóveis';
  pdf.text(sectionTitle, 20, 50); // Posição ajustada

  // Cards dinâmicos baseados no tipo de relatório
  const cardWidth = 80;
  const cardHeight = 30;
  const startX = 20;
  const startY = 70; // Ajustado para dar espaço ao título

  // Definir cards baseados no tipo de relatório
  let cards = [];
  
  if (reportType === 'usuarios') {
    cards = [
      { title: 'Total de usuários cadastrados', value: data.usuarios?.total || 0, icon: '✓' },
      { title: 'Usuários administradores', value: data.usuarios?.administradores || 0, icon: 'A' },
      { title: 'Usuários visitantes', value: data.usuarios?.visitantes || 0, icon: 'V' }
    ];
  } else if (reportType === 'vendas') {
    // Cards específicos para vendas - layout como no preview
    cards = [
      { title: 'Total de imóveis disponíveis para venda', value: data.vendas?.total || 0, icon: '✓', iconType: 'building' }
    ];
  } else {
    // Cards padrão para imóveis
    cards = [
      { title: 'Total de imóveis disponíveis', value: data.imoveis?.total || 0, icon: '✓', iconType: 'check' },
      { title: 'Apartamentos disponíveis', value: data.imoveis?.porTipo?.apartamentos || 0, icon: 'A', iconType: 'building' },
      { title: 'Casas disponíveis', value: data.imoveis?.porTipo?.casas || 0, icon: 'H', iconType: 'house' },
      { title: 'Terrenos disponíveis', value: data.imoveis?.porTipo?.terrenos || 0, icon: 'T', iconType: 'mountain' }
    ];
  }

  // Renderizar cards
  cards.forEach((card, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = startX + (col * (cardWidth + 10));
    const y = startY + (row * (cardHeight + 10));

    // Card background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(x, y, cardWidth, cardHeight, 'F');
    
    // Card text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(card.title, x + 5, y + 10);
    
    // Card value
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${card.value}`, x + 5, y + 20);
    
    // Desenhar ícone específico (usando ícones SVG capturados)
    if (card.iconType) {
      const iconX = x + cardWidth - 8;
      const iconY = y + cardHeight - 5;
      
      // Usar ícone SVG capturado se disponível (exceto para mountain que usa fallback)
      if (iconImages[index] && card.iconType !== 'mountain') {
        pdf.addImage(iconImages[index], 'PNG', iconX - 4, iconY - 4, 8, 8);
      } else {
        // Fallback para ícones desenhados (menores e no canto inferior direito)
        switch (card.iconType) {
          case 'check':
            pdf.setFillColor(36, 54, 123);
            pdf.rect(iconX - 3, iconY - 3, 6, 6, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(6);
            pdf.text('✓', iconX, iconY + 1);
            break;
          case 'building':
            pdf.setFillColor(36, 54, 123);
            pdf.rect(iconX - 3, iconY - 2, 6, 4, 'F');
            pdf.setFillColor(255, 255, 255);
            pdf.rect(iconX - 2, iconY - 1, 1, 1, 'F');
            pdf.rect(iconX, iconY - 1, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY - 1, 1, 1, 'F');
            pdf.rect(iconX - 2, iconY, 1, 1, 'F');
            pdf.rect(iconX, iconY, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY, 1, 1, 'F');
            break;
          case 'house':
            pdf.setFillColor(36, 54, 123);
            pdf.rect(iconX - 3, iconY - 1, 6, 3, 'F');
            pdf.rect(iconX - 3, iconY - 2, 2, 1, 'F');
            pdf.rect(iconX - 1, iconY - 3, 2, 1, 'F');
            pdf.rect(iconX + 1, iconY - 2, 2, 1, 'F');
            pdf.setFillColor(255, 255, 255);
            pdf.rect(iconX - 1, iconY, 1, 1, 'F');
            break;
          case 'mountain':
            pdf.setFillColor(36, 54, 123);
            // Duas montanhas triangulares sobrepostas
            // Montanha da esquerda (maior)
            pdf.rect(iconX - 3, iconY - 2, 1, 1, 'F');
            pdf.rect(iconX - 2, iconY - 3, 2, 1, 'F');
            pdf.rect(iconX - 1, iconY - 4, 2, 1, 'F');
            pdf.rect(iconX, iconY - 3, 1, 1, 'F');
            pdf.rect(iconX - 2, iconY - 1, 3, 1, 'F');
            // Montanha da direita (menor, sobreposta)
            pdf.rect(iconX, iconY - 2, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY - 3, 2, 1, 'F');
            pdf.rect(iconX + 2, iconY - 2, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY - 1, 2, 1, 'F');
            break;
          default:
            pdf.setFillColor(36, 54, 123);
            pdf.circle(iconX, iconY, 1, 'F');
        }
      }
    } else {
      pdf.text(card.icon, x + cardWidth - 15, y + 20);
    }
  });

  // Seção Gráficos (apenas para relatórios que têm gráfico)
  const hasGraph = ['geral', 'imoveis', 'vendas', 'alugueis'].includes(reportType);
  
  if (hasGraph) {
    let currentY = startY + (cardHeight * 2) + 30;
    
    try {
      const charts = element.querySelectorAll('canvas');
      let chartIndex = 0;
      
      // Gráfico de Pizza (primeiro gráfico)
      if (charts[chartIndex] && charts[chartIndex].toDataURL) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(36, 54, 123);
        
        let pizzaTitle = 'Distribuição de imóveis por faixa de preço';
        if (reportType === 'vendas') {
          pizzaTitle = 'Distribuição de imóveis vendidos por categoria';
        } else if (reportType === 'alugueis') {
          pizzaTitle = 'Distribuição de imóveis alugados por categoria';
        }
        
        pdf.text(pizzaTitle, 20, currentY);
        
        const dataURL = charts[chartIndex].toDataURL('image/png', 1.0);
        // Gráfico menor para acomodar ambos na página
        pdf.addImage(dataURL, 'PNG', 20, currentY + 10, 60, 60);
        currentY += 80; // Espaço para próximo gráfico
        chartIndex++;
      }
      
      // Gráfico de Linha (segundo gráfico para vendas e aluguéis)
      if (['vendas', 'alugueis'].includes(reportType) && charts[chartIndex] && charts[chartIndex].toDataURL) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(36, 54, 123);
        
        let lineTitle = 'Evolução das vendas nos últimos 12 meses';
        if (reportType === 'alugueis') {
          lineTitle = 'Evolução dos aluguéis nos últimos 12 meses';
        }
        
        pdf.text(lineTitle, 20, currentY);
        
        const dataURL = charts[chartIndex].toDataURL('image/png', 1.0);
        // Gráfico de linha menor para caber na página
        pdf.addImage(dataURL, 'PNG', 20, currentY + 10, 150, 60);
        currentY += 80;
      }
      
    } catch (error) {
      console.error('Erro ao capturar gráficos:', error);
    }
  }

  // Número da página
  pdf.setFontSize(10);
  pdf.text('1', pageWidth - 20, pageHeight - 10);

  // Salva o PDF
  pdf.save(fileName.endsWith('.pdf') ? fileName : fileName + '.pdf');
}

// Nova função para gerar PDF como blob (para compartilhamento)
export async function exportRelatorioToPdfAsBlob(element, fileName = 'relatorio.pdf', reportType = 'geral') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Geração de PDF só pode ocorrer no cliente (browser).');
  }
  if (!element) throw new Error('Elemento não encontrado para gerar PDF');

  // Carrega jsPDF sob demanda
  if (!_jsPDF) {
    const mod = await import('jspdf');
    _jsPDF = mod.jsPDF || mod.default || mod;
  }

  const pdf = new _jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Capturar ícones SVG como imagens
  const iconImages = await captureIconsAsImages(element);
  
  // Captura os dados do relatório
  const reportData = element.querySelector('[data-report-data]')?.dataset?.reportData;
  let data = {};
  
  if (reportData) {
    try {
      data = JSON.parse(reportData);
    } catch (e) {
      console.error('Erro ao parsear dados do relatório:', e);
    }
  }

  // Background watermark removido completamente

  // Reset color
  pdf.setTextColor(0, 0, 0);

  // Header - Logo e título (layout corrigido)
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(36, 54, 123); // Azul Bortone
  pdf.text('BORTONE', 20, 20);
  pdf.text('GRUPO BORTONE', 20, 25);
  
  // Título principal (dinâmico baseado no tipo) - posicionamento ajustado
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const reportTitles = {
    'geral': 'Relatório Geral - Imobiliária Bortone',
    'imoveis': 'Relatório de Imóveis - Imobiliária Bortone',
    'vendas': 'Relatório de Vendas - Imobiliária Bortone',
    'alugueis': 'Relatório de Aluguéis - Imobiliária Bortone',
    'usuarios': 'Relatório de Usuários - Imobiliária Bortone'
  };
  const reportTitle = reportTitles[reportType] || 'Relatório - Imobiliária Bortone';
  pdf.text(reportTitle, 70, 20); // Posição ajustada para não cortar
  
  // Data (reposicionada)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 70, 30);

  // Seção principal (dinâmica baseada no tipo) - título em destaque como no preview
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0); // Preto para destacar
  
  const sectionTitles = {
    'geral': 'Imóveis',
    'imoveis': 'Imóveis',
    'vendas': 'Vendas',
    'alugueis': 'Aluguéis',
    'usuarios': 'Usuários'
  };
  const sectionTitle = sectionTitles[reportType] || 'Imóveis';
  pdf.text(sectionTitle, 20, 50); // Posição ajustada

  // Cards dinâmicos baseados no tipo de relatório
  const cardWidth = 80;
  const cardHeight = 30;
  const startX = 20;
  const startY = 70; // Ajustado para dar espaço ao título

  // Definir cards baseados no tipo de relatório
  let cards = [];
  
  if (reportType === 'usuarios') {
    cards = [
      { title: 'Total de usuários cadastrados', value: data.usuarios?.total || 0, icon: '✓' },
      { title: 'Usuários administradores', value: data.usuarios?.administradores || 0, icon: 'A' },
      { title: 'Usuários visitantes', value: data.usuarios?.visitantes || 0, icon: 'V' }
    ];
  } else if (reportType === 'vendas') {
    // Cards específicos para vendas - layout como no preview
    cards = [
      { title: 'Total de imóveis disponíveis para venda', value: data.vendas?.total || 0, icon: '✓', iconType: 'building' }
    ];
  } else {
    // Cards padrão para imóveis
    cards = [
      { title: 'Total de imóveis disponíveis', value: data.imoveis?.total || 0, icon: '✓', iconType: 'check' },
      { title: 'Apartamentos disponíveis', value: data.imoveis?.porTipo?.apartamentos || 0, icon: 'A', iconType: 'building' },
      { title: 'Casas disponíveis', value: data.imoveis?.porTipo?.casas || 0, icon: 'H', iconType: 'house' },
      { title: 'Terrenos disponíveis', value: data.imoveis?.porTipo?.terrenos || 0, icon: 'T', iconType: 'mountain' }
    ];
  }

  // Renderizar cards
  cards.forEach((card, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = startX + (col * (cardWidth + 10));
    const y = startY + (row * (cardHeight + 10));

    // Card background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(x, y, cardWidth, cardHeight, 'F');
    
    // Card text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(card.title, x + 5, y + 10);
    
    // Card value
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${card.value}`, x + 5, y + 20);
    
    // Desenhar ícone específico (usando ícones SVG capturados)
    if (card.iconType) {
      const iconX = x + cardWidth - 8;
      const iconY = y + cardHeight - 5;
      
      // Usar ícone SVG capturado se disponível (exceto para mountain que usa fallback)
      if (iconImages[index] && card.iconType !== 'mountain') {
        pdf.addImage(iconImages[index], 'PNG', iconX - 4, iconY - 4, 8, 8);
      } else {
        // Fallback para ícones desenhados (menores e no canto inferior direito)
        switch (card.iconType) {
          case 'check':
            pdf.setFillColor(36, 54, 123);
            pdf.rect(iconX - 3, iconY - 3, 6, 6, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(6);
            pdf.text('✓', iconX, iconY + 1);
            break;
          case 'building':
            pdf.setFillColor(36, 54, 123);
            pdf.rect(iconX - 3, iconY - 2, 6, 4, 'F');
            pdf.setFillColor(255, 255, 255);
            pdf.rect(iconX - 2, iconY - 1, 1, 1, 'F');
            pdf.rect(iconX, iconY - 1, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY - 1, 1, 1, 'F');
            pdf.rect(iconX - 2, iconY, 1, 1, 'F');
            pdf.rect(iconX, iconY, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY, 1, 1, 'F');
            break;
          case 'house':
            pdf.setFillColor(36, 54, 123);
            pdf.rect(iconX - 3, iconY - 1, 6, 3, 'F');
            pdf.rect(iconX - 3, iconY - 2, 2, 1, 'F');
            pdf.rect(iconX - 1, iconY - 3, 2, 1, 'F');
            pdf.rect(iconX + 1, iconY - 2, 2, 1, 'F');
            pdf.setFillColor(255, 255, 255);
            pdf.rect(iconX - 1, iconY, 1, 1, 'F');
            break;
          case 'mountain':
            pdf.setFillColor(36, 54, 123);
            // Duas montanhas triangulares sobrepostas
            // Montanha da esquerda (maior)
            pdf.rect(iconX - 3, iconY - 2, 1, 1, 'F');
            pdf.rect(iconX - 2, iconY - 3, 2, 1, 'F');
            pdf.rect(iconX - 1, iconY - 4, 2, 1, 'F');
            pdf.rect(iconX, iconY - 3, 1, 1, 'F');
            pdf.rect(iconX - 2, iconY - 1, 3, 1, 'F');
            // Montanha da direita (menor, sobreposta)
            pdf.rect(iconX, iconY - 2, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY - 3, 2, 1, 'F');
            pdf.rect(iconX + 2, iconY - 2, 1, 1, 'F');
            pdf.rect(iconX + 1, iconY - 1, 2, 1, 'F');
            break;
          default:
            pdf.setFillColor(36, 54, 123);
            pdf.circle(iconX, iconY, 1, 'F');
        }
      }
    } else {
      pdf.text(card.icon, x + cardWidth - 15, y + 20);
    }
  });

  // Seção Gráficos (apenas para relatórios que têm gráfico)
  const hasGraph = ['geral', 'imoveis', 'vendas', 'alugueis'].includes(reportType);
  
  if (hasGraph) {
    let currentY = startY + (cardHeight * 2) + 30;
    
    try {
      const charts = element.querySelectorAll('canvas');
      let chartIndex = 0;
      
      // Gráfico de Pizza (primeiro gráfico)
      if (charts[chartIndex] && charts[chartIndex].toDataURL) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(36, 54, 123);
        
        let pizzaTitle = 'Distribuição de imóveis por faixa de preço';
        if (reportType === 'vendas') {
          pizzaTitle = 'Distribuição de imóveis vendidos por categoria';
        } else if (reportType === 'alugueis') {
          pizzaTitle = 'Distribuição de imóveis alugados por categoria';
        }
        
        pdf.text(pizzaTitle, 20, currentY);
        
        const dataURL = charts[chartIndex].toDataURL('image/png', 1.0);
        // Gráfico menor para acomodar ambos na página
        pdf.addImage(dataURL, 'PNG', 20, currentY + 10, 60, 60);
        currentY += 80; // Espaço para próximo gráfico
        chartIndex++;
      }
      
      // Gráfico de Linha (segundo gráfico para vendas e aluguéis)
      if (['vendas', 'alugueis'].includes(reportType) && charts[chartIndex] && charts[chartIndex].toDataURL) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(36, 54, 123);
        
        let lineTitle = 'Evolução das vendas nos últimos 12 meses';
        if (reportType === 'alugueis') {
          lineTitle = 'Evolução dos aluguéis nos últimos 12 meses';
        }
        
        pdf.text(lineTitle, 20, currentY);
        
        const dataURL = charts[chartIndex].toDataURL('image/png', 1.0);
        // Gráfico de linha menor para caber na página
        pdf.addImage(dataURL, 'PNG', 20, currentY + 10, 150, 60);
        currentY += 80;
      }
      
    } catch (error) {
      console.error('Erro ao capturar gráficos:', error);
    }
  }

  // Número da página
  pdf.setFontSize(10);
  pdf.text('1', pageWidth - 20, pageHeight - 10);

  // Retorna o PDF como blob
  return pdf.output('blob');
}
