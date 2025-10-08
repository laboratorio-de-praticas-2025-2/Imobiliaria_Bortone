import ProtectedRoute from "./ProtectedRoute";

/**
 * Componente específico para proteger rotas administrativas
 * Permite acesso apenas para usuários de nível 0 (administradores)
 */
export default function AdminRoute({ children }) {
  return (
    <ProtectedRoute
      requiredLevel={0}
      redirectTo="/login"
      accessDeniedMessage="Acesso negado. Esta área é restrita a administradores."
    >
      {children}
    </ProtectedRoute>
  );
}