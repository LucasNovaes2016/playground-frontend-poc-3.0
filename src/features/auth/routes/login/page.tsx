import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/auth/auth-context";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    login();
    navigate("/dashboard", { replace: true });
  }

  return (
    <div>
      <h1>Login</h1>
      <button type="button" onClick={handleLogin}>
        Simular login
      </button>
    </div>
  );
}
