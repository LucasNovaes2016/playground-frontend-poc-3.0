import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ticketQuery } from "@/features/tickets/api/ticket-queries";

export function TicketEditPage() {
  const { id } = useParams();
  // Dados já pré-carregados pelo loader (ensureQueryData) — leitura do cache.
  const { data: ticket } = useQuery(ticketQuery(id!));

  return (
    <div>
      <h1>Edit ticket</h1>
      <p>
        Editando <strong>#{ticket?.id}</strong> — {ticket?.title}
      </p>
    </div>
  );
}
