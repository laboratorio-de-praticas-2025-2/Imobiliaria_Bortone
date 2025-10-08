"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";

/**
 * Componente para proteção de rotas baseado no nível do usuário
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {number} props.requiredLevel - Nível mínimo necessário (0 = admin, 1 = usuário normal)
 * @param {string} props.redirectTo - Para onde redirecionar se não autorizado
 * @param {string} props.accessDeniedMessage - Mensagem customizada de acesso negado
 */
export default function ProtectedRoute({ 
  children, 
  requiredLevel = 1, 
  redirectTo = "/login",
  accessDeniedMessage = "Acesso negado. Você não tem permissão para acessar esta área."
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Verificar se há token de autenticação
        const authToken = localStorage.getItem("authToken");
        const userInfoString = localStorage.getItem("userInfo");

        if (!authToken || !userInfoString) {
          console.log("❌ ProtectedRoute: Token ou userInfo não encontrados");
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        // Verificar informações do usuário
        const userInfo = JSON.parse(userInfoString);
        console.log("🔍 ProtectedRoute: Verificando usuário:", userInfo);

        // Verificar nível de acesso
        const userLevel = parseInt(userInfo.nivel) || 1;
        
        if (userLevel > requiredLevel) {
          console.log(`❌ ProtectedRoute: Nível insuficiente. Usuário: ${userLevel}, Necessário: ${requiredLevel}`);
          alert(accessDeniedMessage);
          router.push("/");
          return;
        }

        console.log(`✅ ProtectedRoute: Usuário autorizado. Nível: ${userLevel}`);
        setIsAuthorized(true);
      } catch (error) {
        console.error("❌ ProtectedRoute: Erro ao verificar autenticação:", error);
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredLevel, redirectTo, accessDeniedMessage]);

  // Mostrar loading enquanto verifica
  if (isLoading) {
    return <SplashScreen />;
  }

  // Mostrar conteúdo apenas se autorizado
  if (isAuthorized) {
    return children;
  }

  // Não renderizar nada se não autorizado (redirecionamento já foi feito)
  return null;
}