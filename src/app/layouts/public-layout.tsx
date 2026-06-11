import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/auth/auth-context";

/**
 * Layout das rotas públicas (login, esqueci a senha).
 *
 * Se o usuário já estiver autenticado, redireciona para o dashboard.
 */
export function PublicLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
