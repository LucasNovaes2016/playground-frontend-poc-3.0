import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/app/auth/auth-context";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tickets", label: "Tickets" },
  { to: "/users", label: "Users" },
];

/**
 * Layout das rotas privadas: faz o guard de autenticação e renderiza o
 * "shell" da aplicação (navegação lateral + área de conteúdo).
 *
 * Se o usuário não estiver autenticado, redireciona para o login.
 */
export function PrivateLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 200,
          padding: 16,
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <strong>Playground</strong>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={logout} style={{ marginTop: "auto" }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
