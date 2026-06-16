import { type Page, type Route } from "@playwright/test";
import { findPost, posts, users } from "./data";

// Todas as chamadas do app vão para este host.
const API_GLOB = "**/jsonplaceholder.typicode.com/**";

function pathnameOf(route: Route): string {
  return new URL(route.request().url()).pathname;
}

type Endpoint = "users" | "posts" | "post";

function classify(pathname: string): { kind: Endpoint; id?: number } | null {
  if (/\/users$/.test(pathname)) return { kind: "users" };
  if (/\/posts$/.test(pathname)) return { kind: "posts" };
  const match = pathname.match(/\/posts\/(\d+)$/);
  if (match) return { kind: "post", id: Number(match[1]) };
  return null;
}

/**
 * Caminho feliz: intercepta /users, /posts e /posts/:id servindo as fixtures.
 * Registre SEMPRE antes do page.goto() para interceptar o carregamento inicial.
 */
export async function mockHappyApi(page: Page): Promise<void> {
  await page.route(API_GLOB, (route) => {
    const target = classify(pathnameOf(route));
    if (!target) return route.continue();

    if (target.kind === "users") return route.fulfill({ json: users });
    if (target.kind === "posts") return route.fulfill({ json: posts });

    const post = findPost(target.id!);
    return post
      ? route.fulfill({ json: post })
      : route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
}

/** Lista vazia em /posts (estado "nenhum post encontrado"). /users segue normal. */
export async function mockEmptyPosts(page: Page): Promise<void> {
  await page.route(API_GLOB, (route) => {
    const target = classify(pathnameOf(route));
    if (target?.kind === "users") return route.fulfill({ json: users });
    if (target?.kind === "posts") return route.fulfill({ json: [] });
    return route.continue();
  });
}

export interface FailingApi {
  /** Para de falhar; chamadas seguintes ao endpoint passam a servir a fixture. */
  heal(): void;
}

/**
 * Faz o endpoint informado falhar (HTTP `status`) ATÉ que `heal()` seja chamado;
 * depois disso serve a fixture. Os demais endpoints respondem normalmente.
 *
 * Diferente de um "falha-uma-vez": o React StrictMode (em dev) dispara o efeito
 * do useFetch duas vezes no mount, então o erro precisa persistir até o teste
 * decidir curar e clicar em "Tentar novamente" — assim o comportamento é
 * determinístico independentemente de StrictMode.
 */
export async function mockFailing(
  page: Page,
  endpoint: "posts" | "post",
  status = 500,
): Promise<FailingApi> {
  let healed = false;
  await page.route(API_GLOB, (route) => {
    const target = classify(pathnameOf(route));
    if (!target) return route.continue();

    if (target.kind === "users") return route.fulfill({ json: users });

    const isTarget =
      (endpoint === "posts" && target.kind === "posts") ||
      (endpoint === "post" && target.kind === "post");

    if (isTarget && !healed) {
      return route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ message: "boom" }),
      });
    }

    if (target.kind === "posts") return route.fulfill({ json: posts });
    const post = findPost(target.id!);
    return post
      ? route.fulfill({ json: post })
      : route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });

  return {
    heal() {
      healed = true;
    },
  };
}

/** Responde 404 para /posts/:id (detalhe inexistente → ErrorState com HTTP 404). */
export async function mockPostNotFound(page: Page): Promise<void> {
  await page.route(API_GLOB, (route) => {
    const target = classify(pathnameOf(route));
    if (target?.kind === "users") return route.fulfill({ json: users });
    if (target?.kind === "posts") return route.fulfill({ json: posts });
    if (target?.kind === "post")
      return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
    return route.continue();
  });
}

/**
 * Caminho feliz porém com atraso no endpoint informado — dá tempo de observar
 * o estado de loading (role="status") antes da resposta chegar.
 */
export async function mockSlowApi(
  page: Page,
  endpoint: "posts" | "post",
  delayMs = 1500,
): Promise<void> {
  await page.route(API_GLOB, async (route) => {
    const target = classify(pathnameOf(route));
    if (!target) return route.continue();

    if (target.kind === "users") return route.fulfill({ json: users });

    const shouldDelay =
      (endpoint === "posts" && target.kind === "posts") ||
      (endpoint === "post" && target.kind === "post");
    if (shouldDelay) await new Promise((r) => setTimeout(r, delayMs));

    if (target.kind === "posts") return route.fulfill({ json: posts });
    const post = findPost(target.id!);
    return post
      ? route.fulfill({ json: post })
      : route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
}
