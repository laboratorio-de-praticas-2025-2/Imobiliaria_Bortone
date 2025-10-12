// Wrapper de segurança para componentes Chart.js
"use client";

import { useEffect } from 'react';

export function ChartSafetyWrapper({ children }) {
  useEffect(() => {
    // Interceptar erros de canvas globalmente
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    
    CanvasRenderingContext2D.prototype.drawImage = function(...args) {
      try {
        // Verificar se o canvas ou argumento de imagem é válido
        const imageArg = args[0];
        
        // Se for canvas, verificar dimensões
        if (imageArg && imageArg.tagName === 'CANVAS') {
          if (imageArg.width === 0 || imageArg.height === 0) {
            console.warn('ChartSafetyWrapper: Tentativa de drawImage com canvas de dimensão 0, ignorando');
            return;
          }
        }
        
        // Se for imagem, verificar se está carregada
        if (imageArg && imageArg.tagName === 'IMG') {
          if (!imageArg.complete || imageArg.naturalWidth === 0) {
            console.warn('ChartSafetyWrapper: Tentativa de drawImage com imagem não carregada, ignorando');
            return;
          }
        }
        
        // Chamar função original se tudo estiver ok
        return originalDrawImage.apply(this, args);
      } catch (error) {
        console.error('ChartSafetyWrapper: Erro interceptado em drawImage:', error);
        // Não propagar o erro, apenas logar
      }
    };
    
    // Cleanup - restaurar função original
    return () => {
      CanvasRenderingContext2D.prototype.drawImage = originalDrawImage;
    };
  }, []);

  return children;
}

export default ChartSafetyWrapper;