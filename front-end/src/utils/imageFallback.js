export function withImageFallback(src, fallback = '/404.png') {
  if (!src || typeof src !== 'string') return fallback;
  return src;
}

export function handleImgError(e, fallback = '/404.png') {
  if (!e?.currentTarget) return;
  if (e.currentTarget.dataset.__fallbackApplied) return; // evita loop
  e.currentTarget.dataset.__fallbackApplied = 'true';
  e.currentTarget.src = fallback;
}
