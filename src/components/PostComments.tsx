import { useCallback } from "react";
import { getComments } from "../api/jsonPlaceholder";
import { useFetch } from "../hooks/useFetch";
import { Loading } from "./feedback/Loading";
import { ErrorState } from "./feedback/ErrorState";
import { EmptyState } from "./feedback/EmptyState";
import { PostComment } from "./PostComment";
import "./PostComments.css";

interface PostCommentsProps {
  postId: number;
}

export function PostComments({ postId }: PostCommentsProps) {
  const fetcher = useCallback(() => getComments(postId), [postId]);
  const { data: comments, loading, error, reload } = useFetch(fetcher);

  return (
    <section className="post-comments" aria-label="Comentários">
      <h3 className="post-comments__heading">
        Comentários{comments ? ` (${comments.length})` : ""}
      </h3>

      {loading && <Loading message="Carregando comentários..." />}

      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && comments && comments.length === 0 && (
        <EmptyState message="Nenhum comentário ainda." />
      )}

      {!loading && !error && comments && comments.length > 0 && (
        <ul className="post-comments__list" role="list">
          {comments.map((comment) => (
            <PostComment key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  );
}
