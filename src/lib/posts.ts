import type { Post, User } from "../types";
import type { PostFilterValues } from "../components/PostFilters";

/**
 * Constrói um índice id-do-usuário → nome, para lookup O(1) do autor
 * de cada post sem varrer a lista de usuários repetidas vezes.
 */
export function buildAuthorNameById(users: User[]): Map<number, string> {
  const map = new Map<number, string>();
  users.forEach((user) => map.set(user.id, user.name));
  return map;
}

/**
 * Filtra posts por título (substring, case-insensitive) e por usuário
 * (match exato do userId, comparado como string). Os dois filtros são
 * aplicados em conjunto (AND); um filtro vazio não restringe nada.
 */
export function filterPosts(
  posts: Post[],
  filters: PostFilterValues,
): Post[] {
  const titleQuery = filters.title.toLowerCase();
  return posts.filter((post) => {
    const matchesTitle =
      titleQuery === "" || post.title.toLowerCase().includes(titleQuery);
    const matchesUser =
      filters.userId === "" || String(post.userId) === filters.userId;
    return matchesTitle && matchesUser;
  });
}
