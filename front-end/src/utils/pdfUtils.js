// Imports dinâmicos serão usados dentro da função para evitar erros em SSR
let _html2canvas = null;
let _jsPDF = null;

// Remove classes de escala/transform para evitar captura deformada e clona conteúdo off-screen
export async function exportRelatorioToPdf(element, fileName = 'relatorio.pdf') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Geração de PDF só pode ocorrer no cliente (browser).');
  }
  if (!element) throw new Error('Elemento não encontrado para gerar PDF');

  // Carrega libs sob demanda (code-splitting) e evita problemas em SSR
  if (!_html2canvas) {
    const mod = await import('html2canvas');
    _html2canvas = mod.default || mod;
  }
  if (!_jsPDF) {
    const mod = await import('jspdf');
    _jsPDF = mod.jsPDF || mod.default || mod;
  }

  // Clonar conteúdo para não alterar layout visível
  const clone = element.cloneNode(true);
  // Remover classes típicas de escala usadas só para preview
  const scaleClasses = ['scale-40','scale-50','scale-55','scale-60','scale-65'];
  const traverseAndClean = (node) => {
    if (node.classList) {
      scaleClasses.forEach(c => node.classList.remove(c));
    }
    [...node.children].forEach(traverseAndClean);
  };
  traverseAndClean(clone);

  // Marca d'água somente no clone (mantém preview intocado)
  try {
    const pageNodes = clone.querySelectorAll('.page');
    pageNodes.forEach((node) => {
      node.style.backgroundImage = 'none';
      if (!node.style.position) node.style.position = 'relative';

      const leftImg = document.createElement('img');
      leftImg.src = '/images/logo-background.svg';
      leftImg.style.position = 'absolute';
      leftImg.style.left = '-250px';
      leftImg.style.top = '20%';
      leftImg.style.width = '500px';
      leftImg.style.height = 'auto';
      leftImg.style.opacity = '0.7'; // visível porém suave
      leftImg.style.zIndex = '0';
      leftImg.style.pointerEvents = 'none';

      const rightImg = document.createElement('img');
      rightImg.src = '/images/logo-background.svg';
      rightImg.style.position = 'absolute';
      rightImg.style.right = '-250px';
      rightImg.style.top = '80%';
      rightImg.style.transform = 'translateY(-100%)';
      rightImg.style.width = '500px';
      rightImg.style.height = 'auto';
      rightImg.style.opacity = '0.7';
      rightImg.style.zIndex = '0';
      rightImg.style.pointerEvents = 'none';

      // Garantir que o conteúdo fique acima (marca atrás)
      node.insertBefore(rightImg, node.firstChild);
      node.insertBefore(leftImg, node.firstChild);
      Array.from(node.children).forEach((child) => {
        if (child !== leftImg && child !== rightImg) {
          if (!child.style.position) child.style.position = 'relative';
          child.style.zIndex = '1';
          if (!child.style.opacity) child.style.opacity = '1';
        }
      });
    });
  } catch {}

  // Wrapper off-screen
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '210mm';
  wrapper.style.minHeight = '297mm';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Aguarda os gráficos no elemento original renderizarem (Chart.js)
  const waitForCharts = async (timeoutMs = 2000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const liveCanvases = element.querySelectorAll('canvas');
      const ready = Array.from(liveCanvases).every(c => c.width > 0 && c.height > 0);
      if (ready && liveCanvases.length > 0) return;
      await new Promise(r => setTimeout(r, 100));
    }
  };
  await waitForCharts();

  // Converte os canvases do elemento original em imagens e injeta no clone
  const liveCanvases = element.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');
  for (let i = 0; i < cloneCanvases.length; i++) {
    const cloneCanvas = cloneCanvases[i];
    const sourceCanvas = liveCanvases[i];
    if (cloneCanvas && sourceCanvas && sourceCanvas.toDataURL) {
      const img = new Image();
      try {
        img.src = sourceCanvas.toDataURL('image/png');
      } catch (e) {
        // Em caso de erro (taint), pula substituição específica
        continue;
      }
      img.style.width = sourceCanvas.style.width || cloneCanvas.style.width || '100%';
      img.style.height = sourceCanvas.style.height || cloneCanvas.style.height || 'auto';
      img.style.display = 'block';
      if (cloneCanvas.parentNode) {
        cloneCanvas.parentNode.replaceChild(img, cloneCanvas);
      }
    }
  }
  
  // Aguarda imagens substituídas carregarem
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Use escala 2 para melhor nitidez
  const canvas = await _html2canvas(clone, { 
    scale: 2, 
    useCORS: true, 
    backgroundColor: '#ffffff',
    allowTaint: true,
    logging: false
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new _jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 0;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName.endsWith('.pdf') ? fileName : fileName + '.pdf');
  document.body.removeChild(wrapper);
}

// Gera o mesmo PDF do preview porém retorna Blob (para compartilhamento)
export async function exportRelatorioToPdfAsBlobDOM(element) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Geração de PDF só pode ocorrer no cliente (browser).');
  }
  if (!element) throw new Error('Elemento não encontrado para gerar PDF');

  if (!_html2canvas) {
    const mod = await import('html2canvas');
    _html2canvas = mod.default || mod;
  }
  if (!_jsPDF) {
    const mod = await import('jspdf');
    _jsPDF = mod.jsPDF || mod.default || mod;
  }

  const clone = element.cloneNode(true);
  const scaleClasses = ['scale-40','scale-50','scale-55','scale-60','scale-65'];
  const traverseAndClean = (node) => {
    if (node.classList) {
      scaleClasses.forEach(c => node.classList.remove(c));
    }
    [...node.children].forEach(traverseAndClean);
  };
  traverseAndClean(clone);

  // Marca d'água apenas no clone
  try {
    const pageNodes = clone.querySelectorAll('.page');
    pageNodes.forEach((node) => {
      node.style.backgroundImage = 'none';
      if (!node.style.position) node.style.position = 'relative';

      const leftImg = document.createElement('img');
      leftImg.src = '/images/logo-background.svg';
      leftImg.style.position = 'absolute';
      leftImg.style.left = '-250px';
      leftImg.style.top = '20%';
      leftImg.style.width = '500px';
      leftImg.style.height = 'auto';
      leftImg.style.opacity = '0.7';
      leftImg.style.zIndex = '0';
      leftImg.style.pointerEvents = 'none';

      const rightImg = document.createElement('img');
      rightImg.src = '/images/logo-background.svg';
      rightImg.style.position = 'absolute';
      rightImg.style.right = '-250px';
      rightImg.style.top = '80%';
      rightImg.style.transform = 'translateY(-100%)';
      rightImg.style.width = '500px';
      rightImg.style.height = 'auto';
      rightImg.style.opacity = '0.7';
      rightImg.style.zIndex = '0';
      rightImg.style.pointerEvents = 'none';

      node.insertBefore(rightImg, node.firstChild);
      node.insertBefore(leftImg, node.firstChild);
      Array.from(node.children).forEach((child) => {
        if (child !== leftImg && child !== rightImg) {
          if (!child.style.position) child.style.position = 'relative';
          child.style.zIndex = '1';
          if (!child.style.opacity) child.style.opacity = '1';
        }
      });
    });
  } catch {}

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '210mm';
  wrapper.style.minHeight = '297mm';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Espera gráficos
  const waitForCharts = async (timeoutMs = 2000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const liveCanvases = element.querySelectorAll('canvas');
      const ready = Array.from(liveCanvases).every(c => c.width > 0 && c.height > 0);
      if (ready && liveCanvases.length > 0) return;
      await new Promise(r => setTimeout(r, 100));
    }
  };
  await waitForCharts();

  // Substitui canvases por imagens
  const liveCanvases = element.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');
  for (let i = 0; i < cloneCanvases.length; i++) {
    const cloneCanvas = cloneCanvases[i];
    const sourceCanvas = liveCanvases[i];
    if (cloneCanvas && sourceCanvas && sourceCanvas.toDataURL) {
      const img = new Image();
      try {
        img.src = sourceCanvas.toDataURL('image/png');
      } catch (e) {
        continue;
      }
      img.style.width = sourceCanvas.style.width || cloneCanvas.style.width || '100%';
      img.style.height = sourceCanvas.style.height || cloneCanvas.style.height || 'auto';
      img.style.display = 'block';
      if (cloneCanvas.parentNode) {
        cloneCanvas.parentNode.replaceChild(img, cloneCanvas);
      }
    }
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const canvas = await _html2canvas(clone, { 
    scale: 2, 
    useCORS: true, 
    backgroundColor: '#ffffff',
    allowTaint: true,
    logging: false
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new _jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 0;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const blob = pdf.output('blob');
  document.body.removeChild(wrapper);
  return blob;
}
