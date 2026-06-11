import { queryOptions } from "@tanstack/react-query";

/**
 * Usuários vindos da API pública JSONPlaceholder.
 * Sem backend próprio — apenas para demonstrar a integração loader + React Query.
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`,
  );
  if (!response.ok) {
    throw new Response("Usuário não encontrado", { status: response.status });
  }
  return response.json();
}

export function userQuery(id: string) {
  return queryOptions({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
  });
}
