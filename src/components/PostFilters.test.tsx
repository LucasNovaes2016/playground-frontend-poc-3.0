import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { PostFilters } from "./PostFilters";
import { sampleUsers } from "../test/fixtures";

// Teste de COMPONENTE: interage como um usuário (digitar/selecionar/clicar) e
// verifica os callbacks. Os callbacks são espiões (vi.fn) — não há rede aqui.

function renderFilters() {
  const onSearch = vi.fn();
  const onClear = vi.fn();
  render(
    <PostFilters users={sampleUsers} onSearch={onSearch} onClear={onClear} />,
  );
  return { onSearch, onClear };
}

describe("<PostFilters />", () => {
  it("envia o título com trim e o userId selecionado ao pesquisar", async () => {
    const user = userEvent.setup();
    const { onSearch } = renderFilters();

    await user.type(screen.getByLabelText("Título"), "  react  ");
    await user.selectOptions(screen.getByLabelText("Usuário"), "2");
    await user.click(screen.getByRole("button", { name: "Pesquisar" }));

    expect(onSearch).toHaveBeenCalledWith({ title: "react", userId: "2" });
  });

  it("lista os usuários como opções do select", () => {
    renderFilters();
    expect(
      screen.getByRole("option", { name: "Leanne Graham" }),
    ).toBeInTheDocument();
  });

  it("limpa os campos e chama onClear", async () => {
    const user = userEvent.setup();
    const { onClear } = renderFilters();

    const titleInput = screen.getByLabelText<HTMLInputElement>("Título");
    await user.type(titleInput, "algo");
    expect(titleInput.value).toBe("algo");

    await user.click(screen.getByRole("button", { name: "Limpar" }));

    expect(titleInput.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
