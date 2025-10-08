export function withImageFallback(src, fallback = '/404.png') {
  if (!src || typeof src !== 'string') return fallback;
  return src;
}

export function handleImgError(e, fallback = '/404.png') {
  if (!e?.currentTarget) return;
  
  // Evitar loops infinitos de erro
  if (e.currentTarget.dataset.__fallbackApplied) {
    console.warn('🚫 Loop de erro de imagem evitado:', e.currentTarget.src);
    return;
  }
  
  // Marcar como fallback aplicado
  e.currentTarget.dataset.__fallbackApplied = 'true';
  
  // Aplicar fallback apenas se não for já o fallback
  if (e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith('404.png')) {
    console.warn('⚠️ Erro ao carregar imagem, aplicando fallback:', {
      original: e.currentTarget.src,
      fallback: fallback
    });
    e.currentTarget.src = fallback;
  }
  
  // Se o fallback também falhar, esconder a imagem
  if (e.currentTarget.src.endsWith('404.png')) {
    console.error('❌ Fallback também falhou, escondendo imagem');
    e.currentTarget.style.display = 'none';
  }
}
