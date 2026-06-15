import { useCallback } from "react";
import { getPost } from "../api/jsonPlaceholder";
import { useFetch } from "../hooks/useFetch";
import { Loading } from "./feedback/Loading";
import { ErrorState } from "./feedback/ErrorState";
import { EmptyState } from "./feedback/EmptyState";
import "./PostDetails.css";

interface PostDetailsProps {
  postId: number;
  authorNameById: Map<number, string>;
  onBack: () => void;
}

export function PostDetails({
  postId,
  authorNameById,
  onBack,
}: PostDetailsProps) {
  const fetcher = useCallback(() => getPost(postId), [postId]);
  const { data: post, loading, error, reload } = useFetch(fetcher);

  return (
    <div className="post-details">
      <button type="button" className="post-details__back" onClick={onBack}>
        ← Voltar para a lista
      </button>

      {loading && <Loading message="Carregando detalhes do post..." />}

      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && !post && (
        <EmptyState message="Post não encontrado." />
      )}

      {!loading && !error && post && (
        <article className="post-details__card">
          <div className="post-details__meta">
            <span className="post-details__badge">Post #{post.id}</span>
            <span className="post-details__author">
              por {authorNameById.get(post.userId) ?? `Usuário ${post.userId}`}
            </span>
          </div>
          <h2 className="post-details__title">{post.title}</h2>
          <p className="post-details__body">{post.body}</p>
        </article>
      )}
    </div>
  );
}
