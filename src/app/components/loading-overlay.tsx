/**
 * Overlay de loading em tela cheia.
 *
 * Renderizado no RootLayout enquanto há uma navegação com loader pendente
 * (`useNavigation().state === "loading"`). Cobre toda a viewport, incluindo
 * o shell, dando feedback visual durante a transição entre rotas.
 */
export function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>Carregando...</span>
    </div>
  );
}
