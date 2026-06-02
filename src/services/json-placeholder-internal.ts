import { jsonPlaceholderInternalApi } from "../api/jsonPlaceholderInternalApi";
import { Post, Comment } from "../types";

export async function fetchPosts(): Promise<Post[]> {
  return jsonPlaceholderInternalApi.request<Post[]>("/posts", {
    params: { _limit: 10 },
  });
}

export async function fetchPostsSimulate401(): Promise<Post[]> {
  return jsonPlaceholderInternalApi.request<Post[]>("/posts", {
    params: { _limit: 1, simulate401: true },
  });
}

export async function createComment(
  comment: Omit<Comment, "id">,
): Promise<Comment> {
  return jsonPlaceholderInternalApi.request<Comment>("/comments", {
    method: "POST",
    body: comment,
  });
}
