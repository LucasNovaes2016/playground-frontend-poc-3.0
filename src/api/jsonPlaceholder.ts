import type { Comment, Post, User } from "../types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function request<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique sua conexão e tente novamente.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `A requisição falhou (HTTP ${response.status}). Tente novamente.`,
    );
  }

  return (await response.json()) as T;
}

export function getPosts(): Promise<Post[]> {
  return request<Post[]>("/posts");
}

export function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export function getPost(id: number): Promise<Post> {
  return request<Post>(`/posts/${id}`);
}

export function getComments(postId: number): Promise<Comment[]> {
  return request<Comment[]>(`/posts/${postId}/comments`);
}
