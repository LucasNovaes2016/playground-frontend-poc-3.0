// Payloads canônicos usados pelos testes mockados (page.route).
// Mantidos pequenos e determinísticos para permitir assertions exatas.

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export const users: User[] = [
  { id: 1, name: "Leanne Graham", username: "Bret", email: "leanne@example.com" },
  { id: 2, name: "Ervin Howell", username: "Antonette", email: "ervin@example.com" },
];

export const posts: Post[] = [
  { userId: 1, id: 1, title: "Introdução ao React", body: "Conteúdo do primeiro post." },
  { userId: 1, id: 2, title: "Hooks na prática", body: "Conteúdo do segundo post." },
  { userId: 2, id: 3, title: "Testes com Vitest", body: "Conteúdo do terceiro post." },
];

// Comentários do post 1; o post 2 fica sem comentários de propósito,
// para exercitar o estado vazio.
export const comments: Comment[] = [
  {
    postId: 1,
    id: 1,
    name: "Maria Silva",
    email: "maria@example.com",
    body: "Excelente introdução, ajudou bastante!",
  },
  {
    postId: 1,
    id: 2,
    name: "João Souza",
    email: "joao@example.com",
    body: "Fiquei com uma dúvida sobre os hooks.",
  },
];

export function findPost(id: number): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function commentsOf(postId: number): Comment[] {
  return comments.filter((c) => c.postId === postId);
}

export function authorNameOf(post: Post): string {
  return users.find((u) => u.id === post.userId)?.name ?? `Usuário ${post.userId}`;
}
