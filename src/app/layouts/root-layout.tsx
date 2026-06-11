import { Outlet, useNavigation } from "react-router-dom";
import { AuthProvider } from "@/app/auth/auth-context";
import { LoadingOverlay } from "@/app/components/loading-overlay";

/**
 * Layout raiz: provê o contexto de autenticação para toda a árvore de rotas
 * (públicas e privadas), exibe o overlay de loading durante navegações com
 * loader pendente e renderiza o outlet correspondente.
 */
export function RootLayout() {
  const navigation = useNavigation();

  return (
    <AuthProvider>
      {navigation.state === "loading" && <LoadingOverlay />}
      <Outlet />
    </AuthProvider>
  );
}
