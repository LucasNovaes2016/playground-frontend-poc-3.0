import type { Comment } from "../types";
import "./PostComment.css";

interface PostCommentProps {
  comment: Comment;
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function PostComment({ comment }: PostCommentProps) {
  return (
    <li className="post-comment">
      <span className="post-comment__avatar" aria-hidden="true">
        {initialOf(comment.name)}
      </span>
      <div className="post-comment__content">
        <div className="post-comment__head">
          <span className="post-comment__name">{comment.name}</span>
          <a className="post-comment__email" href={`mailto:${comment.email}`}>
            {comment.email}
          </a>
        </div>
        <p className="post-comment__body">{comment.body}</p>
      </div>
    </li>
  );
}
