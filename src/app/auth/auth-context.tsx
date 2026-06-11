import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Estado de autenticação em memória (playground).
 *
 * Não persiste — ao recarregar a página o usuário volta para o `/login`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return ctx;
}
