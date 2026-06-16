import { render, screen } from "@testing-library/react";
import { PostComment } from "./PostComment";
import { sampleComments } from "../test/fixtures";
import type { Comment } from "../types";

// Teste UNITÁRIO de componente puro: recebe um comentário por prop e renderiza
// seu markup, sem API/MSW (mesmo padrão de PostsTable.test.tsx).

// PostComment renderiza um <li>, então embrulhamos num <ul> para manter o DOM
// válido (evita aviso de aninhamento do React).
function renderComment(comment: Comment) {
  return render(
    <ul>
      <PostComment comment={comment} />
    </ul>,
  );
}

describe("<PostComment />", () => {
  it("renderiza nome, corpo e o e-mail como link mailto", () => {
    const comment = sampleComments[0];
    renderComment(comment);

    expect(screen.getByText(comment.name)).toBeInTheDocument();
    expect(screen.getByText(comment.body)).toBeInTheDocument();

    const emailLink = screen.getByRole("link", { name: comment.email });
    expect(emailLink).toHaveAttribute("href", `mailto:${comment.email}`);
  });

  it("mostra a inicial maiúscula do nome no avatar", () => {
    renderComment({ ...sampleComments[0], name: "maria silva" });
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("usa '?' no avatar quando o nome está em branco", () => {
    renderComment({ ...sampleComments[0], name: "   " });
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
