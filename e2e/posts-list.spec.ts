import { expect, test } from "@playwright/test";
import { PostsListPage } from "./pages/PostsListPage";
import { authorNameOf, posts } from "./fixtures/data";
import { mockHappyApi } from "./fixtures/mockApi";

test.describe("listagem de posts (mockada)", () => {
  test.beforeEach(async ({ page }) => {
    await mockHappyApi(page);
  });

  test("renderiza exatamente os posts da fixture", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    await expect(list.rows()).toHaveCount(posts.length);
    for (const post of posts) {
      await expect(list.rowByTitle(post.title)).toBeVisible();
    }
  });

  test("mapeia o autor correto a partir de /users", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    const firstPost = posts[0];
    const row = list.rowByTitle(firstPost.title);
    await expect(row).toContainText(authorNameOf(firstPost));
  });

  test("mostra os cabeçalhos da tabela", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    // As linhas de dados têm role="button", o que faz o Chromium rebaixar a
    // semântica da tabela (os <th> deixam de expor role "columnheader"), então
    // afirmamos pelos <th> do <thead> diretamente.
    const headers = list.table.locator("thead th");
    await expect(headers).toHaveText(["ID", "Título", "Autor"]);
  });
});
