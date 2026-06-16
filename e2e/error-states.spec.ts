import { expect, test } from "@playwright/test";
import { PostsListPage } from "./pages/PostsListPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { posts } from "./fixtures/data";
import {
  mockEmptyPosts,
  mockFailing,
  mockPostNotFound,
  mockSlowApi,
} from "./fixtures/mockApi";

test.describe("estados de erro/vazio/loading (mockados)", () => {
  test("lista com erro 500 mostra alerta e recupera no 'Tentar novamente'", async ({
    page,
  }) => {
    const api = await mockFailing(page, "posts", 500);
    const list = new PostsListPage(page);
    await list.goto();

    await expect(list.errorAlert).toBeVisible();
    await expect(list.errorAlert).toContainText(
      "A requisição falhou (HTTP 500). Tente novamente.",
    );

    api.heal(); // próxima chamada a /posts terá sucesso
    await list.retry();

    await expect(list.errorAlert).toBeHidden();
    await expect(list.rows()).toHaveCount(posts.length);
  });

  test("lista vazia mostra a mensagem de 'nenhum post'", async ({ page }) => {
    await mockEmptyPosts(page);
    const list = new PostsListPage(page);
    await list.goto();

    await expect(list.emptyMessage).toBeVisible();
    await expect(list.table).toBeHidden();
  });

  test("lista mostra loading enquanto a resposta não chega", async ({
    page,
  }) => {
    await mockSlowApi(page, "posts", 1500);
    const list = new PostsListPage(page);
    await list.goto();

    await expect(list.loading).toBeVisible();
    await expect(list.rows().first()).toBeVisible(); // após a resposta
    await expect(list.loading).toBeHidden();
  });

  test("detalhes mostram loading enquanto a resposta não chega", async ({
    page,
  }) => {
    await mockSlowApi(page, "post", 1500);
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openFirstPost();

    await expect(details.loading).toBeVisible();
    await details.expectLoaded();
    await expect(details.loading).toBeHidden();
  });

  test("detalhes com erro 500 mostram alerta e recuperam no retry", async ({
    page,
  }) => {
    const api = await mockFailing(page, "post", 500);
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openFirstPost();

    await expect(details.errorAlert).toBeVisible();
    await expect(details.errorAlert).toContainText("HTTP 500");

    api.heal(); // próxima chamada a /posts/:id terá sucesso
    await details.retry();
    await details.expectLoaded();
    await expect(details.errorAlert).toBeHidden();
  });

  test("detalhes inexistentes (404) mostram alerta de erro", async ({
    page,
  }) => {
    // getPost lança em qualquer !response.ok, então 404 cai no ErrorState
    // (role="alert"), não no EmptyState "Post não encontrado.".
    await mockPostNotFound(page);
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openFirstPost();

    await expect(details.errorAlert).toBeVisible();
    await expect(details.errorAlert).toContainText("HTTP 404");
  });
});
