import "./Loading.css";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Carregando..." }: LoadingProps) {
  return (
    <div className="feedback feedback--loading" role="status" aria-live="polite">
      <span className="feedback__spinner" aria-hidden="true" />
      <p className="feedback__text">{message}</p>
    </div>
  );
}
