import "./ErrorState.css";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">
        ⚠️
      </span>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button type="button" className="error-state__retry" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
