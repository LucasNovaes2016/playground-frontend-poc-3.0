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
