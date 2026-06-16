import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Page Object da tela de listagem (filtros + tabela de posts).
 * Locators seguem a prioridade do Playwright: role/label/placeholder/text.
 */
export class PostsListPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly titleFilter: Locator;
  readonly userFilter: Locator;
  readonly searchButton: Locator;
  readonly clearButton: Locator;
  readonly table: Locator;
  readonly loading: Locator;
  readonly errorAlert: Locator;
  readonly retryButton: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { level: 1, name: "Posts" });
    this.titleFilter = page.getByLabel("Título");
    this.userFilter = page.getByLabel("Usuário");
    this.searchButton = page.getByRole("button", { name: "Pesquisar" });
    this.clearButton = page.getByRole("button", { name: "Limpar" });
    this.table = page.getByRole("table");
    this.loading = page.getByText("Carregando posts...");
    this.errorAlert = page.getByRole("alert");
    this.retryButton = page.getByRole("button", { name: "Tentar novamente" });
    this.emptyMessage = page.getByText(
      "Nenhum post encontrado com os filtros aplicados.",
    );
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
    await expect(this.heading).toBeVisible();
  }

  // As linhas da tabela são <tr role="button"> clicáveis.
  rows(): Locator {
    return this.table.getByRole("button");
  }

  rowByTitle(title: string): Locator {
    return this.rows().filter({ hasText: title });
  }

  async openPostByTitle(title: string): Promise<void> {
    await this.rowByTitle(title).click();
  }

  async openFirstPost(): Promise<void> {
    await this.rows().first().click();
  }

  async filterByTitle(text: string): Promise<void> {
    await this.titleFilter.fill(text);
    await this.searchButton.click();
  }

  async filterByUser(userName: string): Promise<void> {
    await this.userFilter.selectOption({ label: userName });
    await this.searchButton.click();
  }

  async clearFilters(): Promise<void> {
    await this.clearButton.click();
  }

  async retry(): Promise<void> {
    await this.retryButton.click();
  }
}
