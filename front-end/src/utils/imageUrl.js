// Normaliza URLs de imagens vindas do backend ou locais replicando a lógica robusta usada em CMS Publicidade.
export function normalizeBackendImage(src, { folderFallback = 'publicidadeImages' } = {}) {
  const placeholder = '/404.png';
  if (!src || typeof src !== 'string') return placeholder;
  let clean = src.trim();
  const apiBase = (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL) || '';

  // Se já for absoluta, retorna direto
  if (/^https?:\/\//i.test(clean)) return clean;

  // Se vier só o nome do arquivo, prefixa pasta
  if (!clean.startsWith('/')) {
    clean = `/images/${folderFallback}/${clean}`;
  }

  // Garante apenas uma barra na junção
  if (clean.startsWith('/images/') && apiBase.startsWith('http')) {
    const base = apiBase.replace(/\/$/, '');
    return `${base}${clean}`;
  }

  return clean;
}

export function buildImovelImage(imovel) {
  // Tentativas ordenadas
  const candidate = imovel?.imagens?.[0]?.url_imagem || imovel?.imagem_imovel?.[0]?.url_imagem || imovel?.imagem || null;
  return normalizeBackendImage(candidate, { folderFallback: 'imoveis' });
}
