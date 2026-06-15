import type { Post } from "../types";
import "./PostsTable.css";

interface PostsTableProps {
  posts: Post[];
  authorNameById: Map<number, string>;
  onSelectPost: (id: number) => void;
}

export function PostsTable({
  posts,
  authorNameById,
  onSelectPost,
}: PostsTableProps) {
  return (
    <div className="posts-table__wrapper">
      <table className="posts-table">
        <thead>
          <tr>
            <th className="posts-table__col-id">ID</th>
            <th>Título</th>
            <th className="posts-table__col-author">Autor</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="posts-table__row"
              tabIndex={0}
              role="button"
              onClick={() => onSelectPost(post.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectPost(post.id);
                }
              }}
            >
              <td className="posts-table__col-id">{post.id}</td>
              <td className="posts-table__title">{post.title}</td>
              <td className="posts-table__col-author">
                {authorNameById.get(post.userId) ?? `Usuário ${post.userId}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
