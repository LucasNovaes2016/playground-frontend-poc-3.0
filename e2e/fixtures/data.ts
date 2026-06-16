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

export const users: User[] = [
  { id: 1, name: "Leanne Graham", username: "Bret", email: "leanne@example.com" },
  { id: 2, name: "Ervin Howell", username: "Antonette", email: "ervin@example.com" },
];

export const posts: Post[] = [
  { userId: 1, id: 1, title: "Introdução ao React", body: "Conteúdo do primeiro post." },
  { userId: 1, id: 2, title: "Hooks na prática", body: "Conteúdo do segundo post." },
  { userId: 2, id: 3, title: "Testes com Vitest", body: "Conteúdo do terceiro post." },
];

export function findPost(id: number): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function authorNameOf(post: Post): string {
  return users.find((u) => u.id === post.userId)?.name ?? `Usuário ${post.userId}`;
}
