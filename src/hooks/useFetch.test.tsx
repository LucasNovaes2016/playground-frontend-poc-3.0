import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useFetch } from "./useFetch";

// Teste UNITÁRIO de hook via `renderHook`: validamos as transições de estado
// (loading → data / loading → error) e o comportamento do `reload`, com um
// fetcher fake (vi.fn) — sem componentes nem rede.

describe("useFetch", () => {
  it("começa em loading e popula data no sucesso", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const { result } = renderHook(() => useFetch(fn));

    // estado inicial: carregando, sem dados nem erro
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe("ok");
    expect(result.current.error).toBeNull();
  });

  it("captura erro e expõe a mensagem", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("falhou"));
    const { result } = renderHook(() => useFetch(fn));

    await waitFor(() => expect(result.current.error).toBe("falhou"));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("usa mensagem genérica quando o erro não é uma Error", async () => {
    const fn = vi.fn().mockRejectedValue("string solta");
    const { result } = renderHook(() => useFetch(fn));

    await waitFor(() =>
      expect(result.current.error).toBe("Ocorreu um erro inesperado."),
    );
  });

  it("reload re-executa o fetcher", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const { result } = renderHook(() => useFetch(fn));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => result.current.reload());

    await waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
  });
});
