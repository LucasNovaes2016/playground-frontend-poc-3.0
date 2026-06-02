import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type Post } from "./services/json-placeholder";

function App() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <p>Loading posts...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ color: "#c00" }}>Error: Failed to load posts</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Public Posts</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts?.map((post) => (
          <li
            key={post.id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <h2 style={{ margin: "0 0 8px 0" }}>{post.title}</h2>
            <p style={{ margin: 0, color: "#555" }}>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
