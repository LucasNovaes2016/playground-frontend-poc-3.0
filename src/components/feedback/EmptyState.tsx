import "./EmptyState.css";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "Nenhum resultado encontrado.",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        📭
      </span>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
