import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import App from "./App";
import { samplePosts } from "./test/fixtures";
import { server } from "./test/msw/server";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Teste de INTEGRAÇÃO ponta-a-ponta (com MSW): exercita App + tabela + filtros +
// detalhes + useFetch + client + estados de feedback. É o teste que mais cobre.

describe("<App /> (fluxo completo)", () => {
  it("lista os posts com o nome do autor", async () => {
    render(<App />);

    expect(screen.getByText("Carregando posts...")).toBeInTheDocument();

    expect(await screen.findByText("Introdução ao React")).toBeInTheDocument();
    expect(screen.getByText("Testes com Vitest")).toBeInTheDocument();
    // "Leanne Graham" também aparece como <option> no filtro; escopamos à tabela
    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Leanne Graham")).toHaveLength(2); // posts 1 e 2
  });

  it("filtra a tabela por título", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("Introdução ao React");

    await user.type(screen.getByLabelText("Título"), "hooks");
    await user.click(screen.getByRole("button", { name: "Pesquisar" }));

    expect(screen.getByText("Hooks na prática")).toBeInTheDocument();
    expect(screen.queryByText("Introdução ao React")).not.toBeInTheDocument();
  });

  it("mostra estado vazio quando nenhum post casa com o filtro", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("Introdução ao React");

    await user.type(screen.getByLabelText("Título"), "zzz-inexistente");
    await user.click(screen.getByRole("button", { name: "Pesquisar" }));

    expect(
      screen.getByText("Nenhum post encontrado com os filtros aplicados."),
    ).toBeInTheDocument();
  });

  it("navega para os detalhes e volta para a lista", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByText("Introdução ao React"));

    // detalhe carregado via /posts/:id
    expect(await screen.findByText(samplePosts[0].body)).toBeInTheDocument();
    expect(screen.getByText("por Leanne Graham")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "← Voltar para a lista" }),
    );

    // de volta à lista (filtros visíveis novamente)
    expect(await screen.findByLabelText("Título")).toBeInTheDocument();
  });

  it("mostra erro com retry quando a listagem falha", async () => {
    server.use(
      http.get(`${BASE_URL}/posts`, () => new HttpResponse(null, { status: 500 })),
    );
    render(<App />);

    expect(
      await screen.findByText("A requisição falhou (HTTP 500). Tente novamente."),
    ).toBeInTheDocument();

    // restaura o handler e recarrega
    const user = userEvent.setup();
    server.use(http.get(`${BASE_URL}/posts`, () => HttpResponse.json(samplePosts)));
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Introdução ao React")).toBeInTheDocument();
  });
});
