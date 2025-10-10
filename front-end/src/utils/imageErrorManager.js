// Sistema global para gerenciar erros de imagem e evitar spam no console

class ImageErrorManager {
  constructor() {
    this.errorCount = new Map(); // URL -> count
    this.maxErrorsPerUrl = 3; // Máximo de erros por URL
    this.cooldownTime = 30000; // 30 segundos
    this.cooldowns = new Map(); // URL -> timestamp
  }

  shouldLogError(url) {
    if (!url) return false;

    const now = Date.now();
    const lastCooldown = this.cooldowns.get(url);
    
    // Se ainda está em cooldown, não logar
    if (lastCooldown && (now - lastCooldown) < this.cooldownTime) {
      return false;
    }

    const currentCount = this.errorCount.get(url) || 0;
    
    // Se já passou do limite, entrar em cooldown
    if (currentCount >= this.maxErrorsPerUrl) {
      this.cooldowns.set(url, now);
      this.errorCount.set(url, 0); // Reset counter
      return false;
    }

    // Incrementar contador
    this.errorCount.set(url, currentCount + 1);
    return true;
  }

  logImageError(url, context = '') {
    if (this.shouldLogError(url)) {
      console.warn(`⚠️ Erro ao carregar imagem${context ? ' (' + context + ')' : ''}:`, url);
    }
  }

  // Método para resetar erros de uma URL específica
  resetErrors(url) {
    this.errorCount.delete(url);
    this.cooldowns.delete(url);
  }

  // Limpar erros antigos periodicamente
  cleanup() {
    const now = Date.now();
    for (const [url, timestamp] of this.cooldowns.entries()) {
      if ((now - timestamp) > this.cooldownTime * 2) {
        this.cooldowns.delete(url);
        this.errorCount.delete(url);
      }
    }
  }
}

// Instância singleton
const imageErrorManager = new ImageErrorManager();

// Limpeza automática a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    imageErrorManager.cleanup();
  }, 300000); // 5 minutos
}

// Handler de erro melhorado
export function handleImageError(e, fallback = '/404.png', context = '') {
  if (!e?.currentTarget) return;

  const url = e.currentTarget.src;
  
  // Evitar loops infinitos
  if (e.currentTarget.dataset.__fallbackApplied) {
    return;
  }
  
  // Logar erro apenas se permitido
  imageErrorManager.logImageError(url, context);
  
  // Marcar como fallback aplicado
  e.currentTarget.dataset.__fallbackApplied = 'true';
  
  // Aplicar fallback apenas se não for já o fallback
  if (!url.endsWith('404.png') && !url.endsWith('casa.png')) {
    e.currentTarget.src = fallback;
  } else {
    // Se o fallback também falhou, esconder
    e.currentTarget.style.opacity = '0.3';
    e.currentTarget.style.filter = 'grayscale(100%)';
  }
}

// Hook React para usar o manager
export function useImageErrorHandler(context = '') {
  return (e, fallback = '/404.png') => {
    handleImageError(e, fallback, context);
  };
}

export default imageErrorManager;