"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook para resetar estado de página quando navegando de volta do admin
 */
export function usePageReset() {
  const router = useRouter();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Na primeira montagem, verificar se veio de uma página admin
    if (isFirstMount.current) {
      isFirstMount.current = false;
      
      // Verificar se existe referrer no sessionStorage
      const referrer = sessionStorage.getItem('lastAdminPage');
      
      if (referrer && referrer.includes('/admin')) {
        console.log('🔄 Detectada navegação de volta do admin, limpando states...');
        
        // Limpar cache do sessionStorage relacionado ao admin
        sessionStorage.removeItem('lastAdminPage');
        
        // Forçar limpeza de possíveis estados corrompidos
        setTimeout(() => {
          // Dispara evento customizado para componentes que precisam se resetar
          window.dispatchEvent(new CustomEvent('pageReset', {
            detail: { from: 'admin' }
          }));
        }, 100);
      }
    }

    // Listener para mudanças de rota
    const handleRouteChange = (url) => {
      if (url.includes('/admin')) {
        sessionStorage.setItem('lastAdminPage', url);
      }
    };

    // No Next.js 13+ com App Router, precisamos usar uma abordagem diferente
    // Vamos apenas marcar quando estivermos saindo de uma página
    const handleBeforeUnload = () => {
      if (window.location.pathname.includes('/admin')) {
        sessionStorage.setItem('lastAdminPage', window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);

  return null;
}