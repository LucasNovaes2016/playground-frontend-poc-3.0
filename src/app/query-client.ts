import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient singleton.
 *
 * Exportado de um módulo dedicado para que tanto o `main.tsx` (via
 * `QueryClientProvider`) quanto os `loaders` das rotas possam compartilhar
 * a mesma instância — loaders não têm acesso a hooks/contexto do React.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    // No playground, 1 retry é suficiente — falha rápido para evidenciar o
    // botão "Tentar novamente" do ErrorBoundary das telas de detalhe/edição.
    queries: { retry: 1 },
  },
});
