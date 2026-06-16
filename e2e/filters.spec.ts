import { expect, test } from "@playwright/test";
import { PostsListPage } from "./pages/PostsListPage";
import { posts } from "./fixtures/data";
import { mockHappyApi } from "./fixtures/mockApi";

test.describe("filtros (mockada)", () => {
  test.beforeEach(async ({ page }) => {
    await mockHappyApi(page);
  });

  test("filtra por título", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    await list.filterByTitle("Hooks");

    await expect(list.rows()).toHaveCount(1);
    await expect(list.rowByTitle("Hooks na prática")).toBeVisible();
  });

  test("filtra por usuário", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    // Ervin Howell (id 2) é autor de apenas um post na fixture.
    await list.filterByUser("Ervin Howell");

    await expect(list.rows()).toHaveCount(1);
    await expect(list.rowByTitle("Testes com Vitest")).toBeVisible();
  });

  test("combina título e usuário", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    await list.titleFilter.fill("React");
    await list.filterByUser("Leanne Graham"); // filterByUser já dispara a busca

    await expect(list.rows()).toHaveCount(1);
    await expect(list.rowByTitle("Introdução ao React")).toBeVisible();
  });

  test("'Limpar' restaura a lista completa", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    await list.filterByTitle("Hooks");
    await expect(list.rows()).toHaveCount(1);

    await list.clearFilters();
    await expect(list.rows()).toHaveCount(posts.length);
  });

  test("filtro sem correspondência mostra estado vazio", async ({ page }) => {
    const list = new PostsListPage(page);
    await list.goto();

    await list.filterByTitle("xyz-nao-existe");

    await expect(list.emptyMessage).toBeVisible();
    await expect(list.table).toBeHidden();
  });
});
