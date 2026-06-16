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
import { buildAuthorNameById, filterPosts } from "./lib/posts";
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

  const authorNameById = useMemo(
    () => buildAuthorNameById(users ?? []),
    [users],
  );

  const filteredPosts = useMemo(
    () => filterPosts(posts ?? [], filters),
    [posts, filters],
  );

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
