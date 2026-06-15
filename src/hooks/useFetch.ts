import { useCallback, useEffect, useState } from "react";

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Hook genérico para buscar dados e padronizar os estados de
 * loading, error e empty em toda a aplicação.
 *
 * `fn` deve ser memoizado (useCallback) para evitar re-execuções
 * indesejadas, já que ele compõe a lista de dependências do efeito.
 */
export function useFetch<T>(fn: () => Promise<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData(null);
          setError(
            err instanceof Error ? err.message : "Ocorreu um erro inesperado.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fn, reloadToken]);

  return { data, loading, error, reload };
}
