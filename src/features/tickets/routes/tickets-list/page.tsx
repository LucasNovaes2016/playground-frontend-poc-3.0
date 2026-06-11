import { useNavigate } from "react-router-dom";

// Mock estático apenas para navegação (sem chamada de API nas listas).
const tickets = [
  { id: 1, title: "Ticket 1" },
  { id: 2, title: "Ticket 2" },
  { id: 3, title: "Ticket 3" },
];

export function TicketsListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Tickets list</h1>
      <button type="button" onClick={() => navigate("/tickets/create")}>
        Create ticket
      </button>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ flex: 1 }}>{ticket.title}</span>
            <button type="button" onClick={() => navigate(`/tickets/${ticket.id}`)}>
              Details
            </button>
            <button type="button" onClick={() => navigate(`/tickets/${ticket.id}/edit`)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
