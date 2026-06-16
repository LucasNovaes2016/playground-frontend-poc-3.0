import { afterEach, vi } from "vitest";
import { getComments, getPost, getPosts, getUsers } from "./jsonPlaceholder";
import { samplePosts, sampleUsers, sampleComments } from "../test/fixtures";

// Testes UNITÁRIOS do client HTTP: mockamos `fetch` diretamente para exercitar
// os dois ramos do wrapper `request<T>()` (erro de rede x HTTP não-ok), sem
// depender do MSW nem da rede. `vi.spyOn` substitui o fetch global por chamada.

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchOnce(response: Partial<Response>) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(response as Response);
}

describe("jsonPlaceholder client", () => {
  describe("caminho feliz", () => {
    it("getPosts faz GET /posts e devolve a lista", async () => {
      const spy = mockFetchOnce({ ok: true, json: async () => samplePosts });

      await expect(getPosts()).resolves.toEqual(samplePosts);
      expect(spy).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/posts",
      );
    });

    it("getUsers faz GET /users e devolve a lista", async () => {
      mockFetchOnce({ ok: true, json: async () => sampleUsers });
      await expect(getUsers()).resolves.toEqual(sampleUsers);
    });

    it("getPost faz GET /posts/:id e devolve o post", async () => {
      const spy = mockFetchOnce({ ok: true, json: async () => samplePosts[0] });

      await expect(getPost(1)).resolves.toEqual(samplePosts[0]);
      expect(spy).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/posts/1",
      );
    });

    it("getComments faz GET /posts/:id/comments e devolve a lista", async () => {
      const spy = mockFetchOnce({ ok: true, json: async () => sampleComments });

      await expect(getComments(1)).resolves.toEqual(sampleComments);
      expect(spy).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/posts/1/comments",
      );
    });
  });

  describe("tratamento de erro", () => {
    it("converte falha de rede em mensagem amigável", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));

      await expect(getPosts()).rejects.toThrow(
        "Não foi possível conectar à API. Verifique sua conexão e tente novamente.",
      );
    });

    it("converte resposta HTTP não-ok em mensagem com o status", async () => {
      mockFetchOnce({ ok: false, status: 500 });

      await expect(getPosts()).rejects.toThrow(
        "A requisição falhou (HTTP 500). Tente novamente.",
      );
    });
  });
});
