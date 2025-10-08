"use client";
import { Divider } from "antd";
import Header from "@/components/home/Header";
import PropriedadesSelecionadas from "@/components/home/PropriedadesSelecionadas";
import PropriedadesPerto from "@/components/home/PropriedadesPerto";
import HomeFooter from "@/components/home/HomeFooter";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import { useAuth } from "@/hooks/useAuth";
import { usePageReset } from "@/hooks/usePageReset";
// Importar sistema de gerenciamento de erros de imagem
import "@/utils/imageErrorManager";

export default function Home() {
  // SEO para página inicial
  useSEO(getSEOConfig('/'));
  
  // Hook de autenticação
  const { isLoggedIn, isLoading } = useAuth();
  
  // Hook para resetar página quando vem do admin
  usePageReset();
  
  // Estado para controlar se o componente foi montado no cliente
  const [isMounted, setIsMounted] = useState(false);
  
  // Verificar se é primeira visita ou navegação de volta
  const [showSplash, setShowSplash] = useState(() => {
    // Se estivermos no lado do cliente, verificar se já mostrou o splash
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('hasVisitedHome');
      return !hasVisited;
    }
    return true;
  });
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Marcar que o componente foi montado no cliente
    setIsMounted(true);
    
    if (showSplash) {
      // Marcar que já visitou a home
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hasVisitedHome', 'true');
      }
      
      const timer1 = setTimeout(() => setAnimateOut(true), 2000);
      const timer2 = setTimeout(() => setShowSplash(false), 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showSplash]);

  // Efeito para limpar possíveis estados problemáticos ao carregar a página
  useEffect(() => {
    // Verificar se veio de navegação do admin
    const isFromAdmin = document.referrer.includes('/admin') || 
                       sessionStorage.getItem('navigatedFromAdmin') === 'true';
    
    if (isFromAdmin) {
      console.log('🔄 Detectada navegação do admin, limpando estados...');
      
      // Limpar flag
      sessionStorage.removeItem('navigatedFromAdmin');
      
      // Forçar limpeza de cache dos componentes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('forceRefresh'));
      }, 100);
    }
    
    console.log('🏠 Página Home carregada/recarregada');
  }, []);

  // Mostrar splash screen apenas na primeira visita
  if (showSplash) {
    return <SplashScreen animateOut={animateOut} />;
  }

  // Aguardar verificação de autenticação e montagem do componente
  if (!isMounted || isLoading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-b from-[#324587] to-[#0C1121] flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <Header key="header" />
      <Divider size="large" />
      {isLoggedIn ? (
        <PropriedadesSelecionadas key="prop-selecionadas" />
      ) : (
        <PropriedadesPerto key="prop-perto" />
      )}
      <Divider size="large" />
      <HomeFooter key="footer" />
    </>
  );
}
