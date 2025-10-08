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

  // Wrapper off-screen
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '210mm';
  wrapper.style.minHeight = '297mm';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Use escala 2 para melhor nitidez
  const canvas = await _html2canvas(clone, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
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
