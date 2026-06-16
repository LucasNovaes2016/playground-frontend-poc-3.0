import { expect, test } from "@playwright/test";
import { PostsListPage } from "./pages/PostsListPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { commentsOf, posts } from "./fixtures/data";
import { mockFailing, mockHappyApi } from "./fixtures/mockApi";

const postWithComments = posts[0]; // "Introdução ao React" (id 1)
const postWithoutComments = posts[1]; // "Hooks na prática" (id 2)

test.describe("comentários do post (mockados)", () => {
  test("lista os comentários abaixo dos detalhes do post", async ({ page }) => {
    await mockHappyApi(page);
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openPostByTitle(postWithComments.title);
    await details.expectLoaded();

    const expected = commentsOf(postWithComments.id);
    await expect(details.commentsHeading).toHaveText(
      `Comentários (${expected.length})`,
    );
    await expect(details.commentItems()).toHaveCount(expected.length);
    for (const comment of expected) {
      await expect(details.commentByText(comment.body)).toBeVisible();
      await expect(details.commentByText(comment.body)).toContainText(
        comment.email,
      );
    }

    // UI de comentários não usa tabela.
    await expect(details.comments.getByRole("table")).toHaveCount(0);
  });

  test("mostra o estado vazio quando o post não tem comentários", async ({
    page,
  }) => {
    await mockHappyApi(page);
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openPostByTitle(postWithoutComments.title);
    await details.expectLoaded();

    await expect(details.commentsEmpty).toBeVisible();
    await expect(details.commentItems()).toHaveCount(0);
  });

  test("comentários com erro 500 mostram alerta e recuperam no retry", async ({
    page,
  }) => {
    const api = await mockFailing(page, "comments", 500);
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();
    await list.openPostByTitle(postWithComments.title);

    // os detalhes do post carregam normalmente; só os comentários falham
    await details.expectLoaded();
    await expect(details.commentsError).toBeVisible();
    await expect(details.commentsError).toContainText("HTTP 500");

    api.heal(); // próxima chamada a /posts/:id/comments terá sucesso
    await details.retryComments();

    await expect(details.commentsError).toBeHidden();
    await expect(details.commentItems()).toHaveCount(
      commentsOf(postWithComments.id).length,
    );
  });
});
