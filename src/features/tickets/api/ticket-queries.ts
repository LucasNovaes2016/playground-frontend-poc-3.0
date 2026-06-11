import { queryOptions } from "@tanstack/react-query";

/**
 * Simulamos um "ticket" usando os usuários da API pública JSONPlaceholder.
 * Sem backend próprio — apenas para demonstrar a integração loader + React Query.
 */
export interface Ticket {
  id: number;
  title: string;
  body: string;
}

async function fetchTicket(id: string): Promise<Ticket> {
  // Playground: usamos a API pública de /users para simular um ticket
  // (a de /posts passou a responder 403). Mapeamos a resposta para o shape Ticket.
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/123312rs/${id}`,
  );
  if (!response.ok) {
    throw new Response("Ticket não encontrado", { status: response.status });
  }
  const user = await response.json();
  return { id: user.id, title: user.name, body: user.email };
}

export function ticketQuery(id: string) {
  return queryOptions({
    queryKey: ["tickets", id],
    queryFn: () => fetchTicket(id),
  });
}
