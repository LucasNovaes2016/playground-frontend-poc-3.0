import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object da tela de detalhes de um post.
 * A navegação do app é por estado (sem mudança de URL), então a tela é
 * identificada pela presença dos seus elementos, nunca por page.url().
 */
export class PostDetailsPage {
  readonly page: Page;
  readonly badge: Locator; // "Post #{id}"
  readonly author: Locator; // "por {autor}"
  readonly title: Locator; // h2
  readonly body: Locator;
  readonly backButton: Locator;
  readonly loading: Locator;
  readonly errorAlert: Locator;
  readonly retryButton: Locator;
  // Seção de comentários (renderizada abaixo dos detalhes do post).
  readonly comments: Locator;
  readonly commentsHeading: Locator;
  readonly commentsLoading: Locator;
  readonly commentsEmpty: Locator;
  readonly commentsError: Locator;
  readonly commentsRetryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.badge = page.getByText(/^Post #\d+$/);
    this.author = page.getByText(/^por /);
    this.title = page.getByRole("heading", { level: 2 });
    this.body = page.locator(".post-details__body");
    this.backButton = page.getByRole("button", {
      name: "← Voltar para a lista",
    });
    this.loading = page.getByText("Carregando detalhes do post...");
    this.errorAlert = page.getByRole("alert");
    this.retryButton = page.getByRole("button", { name: "Tentar novamente" });

    // Tudo da seção de comentários é escopado ao container para não colidir
    // com o alerta/retry de erro do próprio post.
    this.comments = page.getByRole("region", { name: "Comentários" });
    this.commentsHeading = this.comments.getByRole("heading", { level: 3 });
    this.commentsLoading = this.comments.getByText("Carregando comentários...");
    this.commentsEmpty = this.comments.getByText("Nenhum comentário ainda.");
    this.commentsError = this.comments.getByRole("alert");
    this.commentsRetryButton = this.comments.getByRole("button", {
      name: "Tentar novamente",
    });
  }

  // Os comentários são itens de lista (<li>) dentro da seção.
  commentItems(): Locator {
    return this.comments.getByRole("listitem");
  }

  commentByText(text: string): Locator {
    return this.commentItems().filter({ hasText: text });
  }

  async retryComments(): Promise<void> {
    await this.commentsRetryButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.badge).toBeVisible();
    await expect(this.title).toBeVisible();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  async retry(): Promise<void> {
    await this.retryButton.click();
  }
}
