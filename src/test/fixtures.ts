import type { Comment, Post, User } from "../types";

/**
 * Dados de amostra reutilizados pelos handlers do MSW e pelas asserções.
 * Manter os mocks centralizados aqui evita divergência entre o que a "API"
 * devolve e o que os testes esperam.
 */
export const sampleUsers: User[] = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "leanne@example.com",
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "ervin@example.com",
  },
];

export const samplePosts: Post[] = [
  {
    userId: 1,
    id: 1,
    title: "Introdução ao React",
    body: "Conteúdo do primeiro post.",
  },
  {
    userId: 1,
    id: 2,
    title: "Hooks na prática",
    body: "Conteúdo do segundo post.",
  },
  {
    userId: 2,
    id: 3,
    title: "Testes com Vitest",
    body: "Conteúdo do terceiro post.",
  },
];

// Comentários do post 1; o post 2 fica sem comentários de propósito,
// para exercitar o estado vazio.
export const sampleComments: Comment[] = [
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
