import { jsonPlaceholderApi } from "../api/jsonPlaceholderApi";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export async function fetchPosts(): Promise<Post[]> {
  return jsonPlaceholderApi.request<Post[]>("/posts", {
    params: { _limit: 10 },
  });
}

export async function fetchUsers(): Promise<User[]> {
  return jsonPlaceholderApi.request<User[]>("/users", {
    params: { _limit: 10 },
  });
}

export async function fetchComments(): Promise<Comment[]> {
  return jsonPlaceholderApi.request<Comment[]>("/comments", {
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
