import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { PostsTable } from "./PostsTable";
import { buildAuthorNameById } from "../lib/posts";
import { samplePosts, sampleUsers } from "../test/fixtures";

const authorNameById = buildAuthorNameById(sampleUsers);

describe("<PostsTable />", () => {
  it("renderiza uma linha por post com título e autor", () => {
    render(
      <PostsTable
        posts={samplePosts}
        authorNameById={authorNameById}
        onSelectPost={vi.fn()}
      />,
    );

    expect(screen.getByText("Introdução ao React")).toBeInTheDocument();
    // autor resolvido pelo mapa (userId 1 → Leanne Graham)
    expect(screen.getAllByText("Leanne Graham")).toHaveLength(2);
  });

  it("usa o fallback 'Usuário {id}' quando o autor não está no mapa", () => {
    render(
      <PostsTable
        posts={[{ userId: 99, id: 10, title: "Órfão", body: "x" }]}
        authorNameById={authorNameById}
        onSelectPost={vi.fn()}
      />,
    );
    expect(screen.getByText("Usuário 99")).toBeInTheDocument();
  });

  it("dispara onSelectPost ao clicar na linha", async () => {
    const user = userEvent.setup();
    const onSelectPost = vi.fn();
    render(
      <PostsTable
        posts={samplePosts}
        authorNameById={authorNameById}
        onSelectPost={onSelectPost}
      />,
    );

    await user.click(screen.getByText("Hooks na prática"));
    expect(onSelectPost).toHaveBeenCalledWith(2);
  });

  it("dispara onSelectPost ao pressionar Enter na linha (acessibilidade)", async () => {
    const user = userEvent.setup();
    const onSelectPost = vi.fn();
    render(
      <PostsTable
        posts={samplePosts}
        authorNameById={authorNameById}
        onSelectPost={onSelectPost}
      />,
    );

    const rows = screen.getAllByRole("button");
    rows[0].focus();
    await user.keyboard("{Enter}");
    expect(onSelectPost).toHaveBeenCalledWith(1);
  });
});
