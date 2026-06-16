import { buildAuthorNameById, filterPosts } from "./posts";
import { samplePosts, sampleUsers } from "../test/fixtures";

// Testes UNITÁRIOS puros: nenhuma renderização de React, nenhuma rede.
// Apenas entrada → saída. São os testes mais rápidos e estáveis da pirâmide.

describe("buildAuthorNameById", () => {
  it("mapeia id do usuário para o nome", () => {
    const map = buildAuthorNameById(sampleUsers);
    expect(map.get(1)).toBe("Leanne Graham");
    expect(map.get(2)).toBe("Ervin Howell");
  });

  it("retorna um Map vazio quando não há usuários", () => {
    const map = buildAuthorNameById([]);
    expect(map.size).toBe(0);
  });
});

describe("filterPosts", () => {
  const emptyFilters = { title: "", userId: "" };

  it("retorna todos os posts quando os filtros estão vazios", () => {
    expect(filterPosts(samplePosts, emptyFilters)).toEqual(samplePosts);
  });

  it("filtra por título de forma case-insensitive (substring)", () => {
    const result = filterPosts(samplePosts, { title: "hooks", userId: "" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Hooks na prática");
  });

  it("filtra por userId com match exato (comparado como string)", () => {
    const result = filterPosts(samplePosts, { title: "", userId: "2" });
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(2);
  });

  it("aplica título e usuário em conjunto (AND)", () => {
    const result = filterPosts(samplePosts, { title: "react", userId: "1" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("retorna lista vazia quando nada casa com os filtros", () => {
    const result = filterPosts(samplePosts, { title: "inexistente", userId: "" });
    expect(result).toEqual([]);
  });
});
