import { http, HttpResponse } from "msw";
import { samplePosts, sampleUsers, sampleComments } from "../fixtures";

const BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Handlers padrão (caminho feliz) para os 3 endpoints que a app consome.
 * Testes individuais podem sobrescrever um handler com `server.use(...)`
 * para simular erro (HTTP 500), 404 ou resposta vazia.
 */
export const handlers = [
  http.get(`${BASE_URL}/posts`, () => HttpResponse.json(samplePosts)),

  http.get(`${BASE_URL}/users`, () => HttpResponse.json(sampleUsers)),

  http.get(`${BASE_URL}/posts/:id`, ({ params }) => {
    const id = Number(params.id);
    const post = samplePosts.find((p) => p.id === id);
    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(post);
  }),

  http.get(`${BASE_URL}/posts/:id/comments`, ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json(sampleComments.filter((c) => c.postId === id));
  }),
];
