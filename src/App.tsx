import { useMemo, useState } from "react";
import { getPosts, getUsers } from "./api/jsonPlaceholder";
import { useFetch } from "./hooks/useFetch";
import {
  PostFilters,
  EMPTY_FILTERS,
  type PostFilterValues,
} from "./components/PostFilters";
import { PostsTable } from "./components/PostsTable";
import { PostDetails } from "./components/PostDetails";
import { Loading } from "./components/feedback/Loading";
import { ErrorState } from "./components/feedback/ErrorState";
import { EmptyState } from "./components/feedback/EmptyState";
import "./App.css";

function App() {
  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    reload: reloadPosts,
  } = useFetch(getPosts);

  const { data: users } = useFetch(getUsers);

  const [filters, setFilters] = useState<PostFilterValues>(EMPTY_FILTERS);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const authorNameById = useMemo(() => {
    const map = new Map<number, string>();
    (users ?? []).forEach((user) => map.set(user.id, user.name));
    return map;
  }, [users]);

  const filteredPosts = useMemo(() => {
    const titleQuery = filters.title.toLowerCase();
    return (posts ?? []).filter((post) => {
      const matchesTitle =
        titleQuery === "" || post.title.toLowerCase().includes(titleQuery);
      const matchesUser =
        filters.userId === "" || String(post.userId) === filters.userId;
      return matchesTitle && matchesUser;
    });
  }, [posts, filters]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Posts</h1>
        <p className="app__subtitle">
          Listagem e detalhes de posts via JSONPlaceholder
        </p>
      </header>

      <main className="app__content">
        {selectedPostId !== null ? (
          <PostDetails
            postId={selectedPostId}
            authorNameById={authorNameById}
            onBack={() => setSelectedPostId(null)}
          />
        ) : (
          <>
            <PostFilters
              users={users ?? []}
              onSearch={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
            />

            {postsLoading && <Loading message="Carregando posts..." />}

            {!postsLoading && postsError && (
              <ErrorState message={postsError} onRetry={reloadPosts} />
            )}

            {!postsLoading && !postsError && filteredPosts.length === 0 && (
              <EmptyState message="Nenhum post encontrado com os filtros aplicados." />
            )}

            {!postsLoading && !postsError && filteredPosts.length > 0 && (
              <PostsTable
                posts={filteredPosts}
                authorNameById={authorNameById}
                onSelectPost={setSelectedPostId}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
