export function withImageFallback(src, fallback = '/404.png') {
  if (!src || typeof src !== 'string') return fallback;
  return src;
}

export function handleImgError(e, fallback = '/404.png') {
  if (!e?.currentTarget) return;
  
  const img = e.currentTarget;
  
  // Evitar loops infinitos de erro
  if (img.dataset.fallbackAttempted) {
    console.error('❌ Fallback também falhou, escondendo imagem');
    img.style.display = 'none';
    return;
  }
  
  // Log do erro para debug
  console.warn('⚠️ Erro ao carregar imagem, aplicando fallback:', {
    original: img.src,
    fallback: fallback,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight
  });
  
  // Marcar que fallback foi tentado
  img.dataset.fallbackAttempted = 'true';
  
  // Aplicar fallback
  img.src = fallback;
}
