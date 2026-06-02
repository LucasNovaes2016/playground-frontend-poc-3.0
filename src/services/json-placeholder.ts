import { jsonPlaceholderApi } from "../api/jsonPlaceholderApi";
import { Post, Comment } from "../types";

export async function fetchPosts(): Promise<Post[]> {
  return jsonPlaceholderApi.request<Post[]>("/posts", {
    params: { _limit: 10 },
  });
}

export async function createComment(
  comment: Omit<Comment, "id">,
): Promise<Comment> {
  return jsonPlaceholderApi.request<Comment>("/comments", {
    method: "POST",
    body: comment,
  });
}
