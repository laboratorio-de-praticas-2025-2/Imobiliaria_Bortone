"use client";

import { useAuth } from "@/hooks/useAuth";

/**
 * Componente que renderiza conteúdo apenas se o usuário for admin
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado
 * @param {React.ReactNode} props.fallback - Conteúdo alternativo se não for admin
 */
export function AdminOnly({ children, fallback = null }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return null; // ou um placeholder de loading
  }

  return isAdmin ? children : fallback;
}

/**
 * Componente que renderiza conteúdo apenas se o usuário estiver logado
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado
 * @param {React.ReactNode} props.fallback - Conteúdo alternativo se não estiver logado
 */
export function AuthOnly({ children, fallback = null }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null; // ou um placeholder de loading
  }

  return isLoggedIn ? children : fallback;
}

/**
 * Componente que renderiza conteúdo apenas se o usuário NÃO estiver logado
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado
 */
export function GuestOnly({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return !isLoggedIn ? children : null;
}