import { expect, test } from "@playwright/test";
import { PostsListPage } from "./pages/PostsListPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";

/**
 * Smoke contra a API REAL (https://jsonplaceholder.typicode.com).
 * Sem page.route: prova a integração de verdade (request, CORS, parsing,
 * renderização). É intencionalmente mínimo e NÃO deve ser o gate obrigatório
 * de PR — depende de um serviço de terceiros e pode ser intermitente.
 */
test.describe("smoke @real-api", () => {
  test("lista carrega posts reais e navega para detalhes e volta", async ({
    page,
  }) => {
    const list = new PostsListPage(page);
    const details = new PostDetailsPage(page);

    await list.goto();

    // A API real devolve muitos posts; basta ter ao menos uma linha.
    await expect(list.rows().first()).toBeVisible({ timeout: 15_000 });

    // Abrimos o 4º post (índice 3) de propósito: em algumas redes/VPN o detalhe
    // dos primeiros posts é bloqueado (403), então evitamos essa faixa para que
    // o smoke reflita a integração e não a regra de rede.
    await list.rows().nth(3).click();
    await details.expectLoaded();

    await details.goBack();
    await expect(list.heading).toBeVisible();
    await expect(list.rows().first()).toBeVisible();
  });
});
