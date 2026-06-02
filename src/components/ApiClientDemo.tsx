import { useState } from "react";
import { fetchPosts as fetchPublicPosts } from "../services/json-placeholder";
import {
  fetchPosts as fetchInternalPosts,
  fetchPostsSimulate401,
} from "../services/json-placeholder-internal";
import { Post } from "../types";

export default function ApiClientDemo(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("authToken"),
  );
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  function handleLogin() {
    localStorage.setItem("authToken", "fake-auth-token-1234");
    setIsLoggedIn(true);
    setStatus("Logged in");
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setStatus("Logged out");
  }

  async function loadPublic() {
    setIsLoading(true);
    setStatus("");
    try {
      const data = await fetchPublicPosts();
      setPosts(data);
      setStatus("Public posts loaded");
    } catch (e) {
      setStatus("Error loading public posts");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadInternal() {
    setIsLoading(true);
    setStatus("");
    try {
      const data = await fetchInternalPosts();
      setPosts(data);
      setStatus("Internal posts loaded");
    } catch (e) {
      setStatus("Error loading internal posts");
    } finally {
      setIsLoading(false);
    }
  }

  async function simulate401() {
    setIsLoading(true);
    setStatus("Simulating 401...");
    try {
      await fetchPostsSimulate401();
      setStatus("Unexpected success");
    } catch (e) {
      setStatus("Request failed (expected)");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}
    >
      <h2>API Client Demo</h2>

      <div style={{ marginBottom: "12px" }}>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Deslogar</button>
        ) : (
          <button onClick={handleLogin}>Logar</button>
        )}
        <span style={{ marginLeft: "12px" }}>{status}</span>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <button
          onClick={loadPublic}
          disabled={isLoading}
          style={{ marginRight: 8 }}
        >
          Load Public Posts
        </button>
        <button
          onClick={loadInternal}
          disabled={isLoading}
          style={{ marginRight: 8 }}
        >
          Load Internal Posts
        </button>
        <button onClick={simulate401} disabled={isLoading}>
          Simulate 401 (internal)
        </button>
      </div>

      {isLoading && <p>Loading...</p>}

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
            <h3 style={{ margin: "0 0 8px 0" }}>{post.title}</h3>
            <p style={{ margin: 0, color: "#555" }}>{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
