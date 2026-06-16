import { expect, test } from "@playwright/test";
import { PostsListPage } from "./pages/PostsListPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { authorNameOf, posts } from "./fixtures/data";
import { mockHappyApi } from "./fixtures/mockApi";

test.describe("navegação lista <-> detalhes (mockada)", () => {
  test.beforeEach(async ({ page }) => {
    await mockHappyApi(page);
  });

  test("abre o post clicado e mostra seus dados", async ({ page }) => {
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);
    const target = posts[1]; // "Hooks na prática"

    await list.goto();
    await list.openPostByTitle(target.title);

    await details.expectLoaded();
    await expect(details.badge).toHaveText(`Post #${target.id}`);
    await expect(details.title).toHaveText(target.title);
    await expect(details.author).toContainText(authorNameOf(target));
    await expect(details.body).toHaveText(target.body);
    // Transição de tela afirmada por ausência da lista, não por URL.
    await expect(list.heading).toBeVisible(); // h1 "Posts" persiste no header
    await expect(list.table).toBeHidden();
  });

  test("botão voltar retorna para a lista", async ({ page }) => {
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openFirstPost();
    await details.expectLoaded();

    await details.goBack();
    await expect(list.table).toBeVisible();
    await expect(details.badge).toBeHidden();
  });

  test("round-trip: abre A, volta, abre B mostra B", async ({ page }) => {
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);
    const [postA, postB] = posts;

    await list.goto();

    await list.openPostByTitle(postA.title);
    await expect(details.badge).toHaveText(`Post #${postA.id}`);

    await details.goBack();
    await expect(list.table).toBeVisible();

    await list.openPostByTitle(postB.title);
    await expect(details.badge).toHaveText(`Post #${postB.id}`);
    await expect(details.title).toHaveText(postB.title);
  });

  test("linha é acionável por teclado (Enter)", async ({ page }) => {
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    const firstRow = list.rows().first();
    await firstRow.focus();
    await firstRow.press("Enter");

    await details.expectLoaded();
    await expect(details.badge).toHaveText(`Post #${posts[0].id}`);
  });
});
