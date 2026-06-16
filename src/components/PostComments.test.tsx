import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { PostComments } from "./PostComments";
import { sampleComments } from "../test/fixtures";
import { server } from "../test/msw/server";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Teste de INTEGRAÇÃO: PostComments usa useFetch + o client real, que bate no
// MSW. Cobrimos loading → sucesso, lista vazia e erro → retry.

describe("<PostComments />", () => {
  it("mostra loading e depois os comentários buscados na API", async () => {
    render(<PostComments postId={1} />);

    expect(screen.getByText("Carregando comentários...")).toBeInTheDocument();

    // título com a contagem aparece quando os dados chegam
    expect(await screen.findByText("Comentários (2)")).toBeInTheDocument();
    for (const comment of sampleComments) {
      expect(screen.getByText(comment.body)).toBeInTheDocument();
      expect(screen.getByText(comment.name)).toBeInTheDocument();
      expect(screen.getByText(comment.email)).toBeInTheDocument();
    }
    // não usa tabela
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("mostra o estado vazio quando o post não tem comentários", async () => {
    render(<PostComments postId={2} />);

    expect(
      await screen.findByText("Nenhum comentário ainda."),
    ).toBeInTheDocument();
    expect(screen.getByText("Comentários (0)")).toBeInTheDocument();
  });

  it("mostra erro com retry e se recupera ao tentar novamente", async () => {
    server.use(
      http.get(`${BASE_URL}/posts/:id/comments`, () =>
        new HttpResponse(null, { status: 500 }),
      ),
    );
    const user = userEvent.setup();
    render(<PostComments postId={1} />);

    expect(
      await screen.findByText("A requisição falhou (HTTP 500). Tente novamente."),
    ).toBeInTheDocument();

    server.use(
      http.get(`${BASE_URL}/posts/:id/comments`, () =>
        HttpResponse.json(sampleComments),
      ),
    );
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText(sampleComments[0].body)).toBeInTheDocument();
  });
});
