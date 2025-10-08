"use client";

import { useState, useEffect } from "react";

/**
 * Hook para verificar se o usuário está logado e seu nível de acesso
 * @returns {Object} - { isLoggedIn, user, isAdmin, isLoading }
 */
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userInfoString = localStorage.getItem("userInfo");

        if (authToken && userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          setUser(userInfo);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Verificar mudanças no localStorage (para quando o usuário fizer login/logout em outra aba)
    const handleStorageChange = (e) => {
      if (e.key === "authToken" || e.key === "userInfo") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Derived states
  const isAdmin = user && parseInt(user.nivel) === 0;
  const userLevel = user ? parseInt(user.nivel) : null;

  return {
    isLoggedIn,
    user,
    isAdmin,
    userLevel,
    isLoading,
    // Função para forçar re-verificação
    recheck: () => {
      setIsLoading(true);
      const checkAuth = () => {
        try {
          const authToken = localStorage.getItem("authToken");
          const userInfoString = localStorage.getItem("userInfo");

          if (authToken && userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setUser(userInfo);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          setUser(null);
          setIsLoggedIn(false);
        } finally {
          setIsLoading(false);
        }
      };
      checkAuth();
    }
  };
}