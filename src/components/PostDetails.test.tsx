import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { vi } from "vitest";
import { PostDetails } from "./PostDetails";
import { buildAuthorNameById } from "../lib/posts";
import { samplePosts, sampleUsers } from "../test/fixtures";
import { server } from "../test/msw/server";

const BASE_URL = "https://jsonplaceholder.typicode.com";
const authorNameById = buildAuthorNameById(sampleUsers);

// Teste de INTEGRAÇÃO: o componente usa useFetch + o client real, que bate no
// MSW. Cobrimos os estados loading → sucesso e erro → retry.

function renderDetails(postId = 1) {
  const onBack = vi.fn();
  render(
    <PostDetails
      postId={postId}
      authorNameById={authorNameById}
      onBack={onBack}
    />,
  );
  return { onBack };
}

describe("<PostDetails />", () => {
  it("mostra loading e depois o post buscado na API", async () => {
    renderDetails(1);

    expect(screen.getByText("Carregando detalhes do post...")).toBeInTheDocument();

    expect(await screen.findByText("Introdução ao React")).toBeInTheDocument();
    expect(screen.getByText(samplePosts[0].body)).toBeInTheDocument();
    expect(screen.getByText("por Leanne Graham")).toBeInTheDocument();
  });

  it("mostra erro com retry e se recupera ao tentar novamente", async () => {
    // primeiro a API falha...
    server.use(
      http.get(`${BASE_URL}/posts/:id`, () =>
        new HttpResponse(null, { status: 500 }),
      ),
    );
    const user = userEvent.setup();
    renderDetails(1);

    expect(
      await screen.findByText("A requisição falhou (HTTP 500). Tente novamente."),
    ).toBeInTheDocument();

    // ...restaura o handler de sucesso e clica em "Tentar novamente"
    server.use(
      http.get(`${BASE_URL}/posts/:id`, () =>
        HttpResponse.json(samplePosts[0]),
      ),
    );
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Introdução ao React")).toBeInTheDocument();
  });

  it("chama onBack ao clicar em voltar", async () => {
    const user = userEvent.setup();
    const { onBack } = renderDetails(1);

    await user.click(
      screen.getByRole("button", { name: "← Voltar para a lista" }),
    );
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
