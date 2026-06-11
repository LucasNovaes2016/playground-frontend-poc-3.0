import {
  useLocation,
  useNavigate,
  useRevalidator,
  useRouteError,
} from "react-router-dom";

/**
 * ErrorBoundary das telas de detalhe/edição.
 *
 * É consumido pelo padrão `lazy` do React Router via export nomeado
 * `ErrorBoundary` em cada `route.tsx`. Quando o loader (ensureQueryData)
 * falha, esta tela substitui o erro padrão (feio) do React Router por uma
 * mensagem amigável com duas ações:
 *  - "Tentar novamente": re-executa o loader da rota (revalidate).
 *  - "Voltar para a lista": navega para a lista da feature atual.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { pathname } = useLocation();

  // /tickets/1/edit -> /tickets | /users/2 -> /users
  const listPath = `/${pathname.split("/")[1]}`;
  const isRetrying = revalidator.state === "loading";

  return (
    <div>
      <h1>Algo deu errado</h1>
      <p>Não foi possível carregar os dados.</p>
      {error instanceof Error && <p>{error.message}</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => revalidator.revalidate()}
          disabled={isRetrying}
        >
          {isRetrying ? "Tentando..." : "Tentar novamente"}
        </button>
        <button type="button" onClick={() => navigate(listPath)}>
          Voltar para a lista
        </button>
      </div>
    </div>
  );
}
