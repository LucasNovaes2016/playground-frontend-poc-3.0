import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * Servidor MSW para ambiente Node (usado pelo Vitest/jsdom).
 * Intercepta as chamadas `fetch` da app no nível de rede, sem bater
 * na API real do JSONPlaceholder.
 */
export const server = setupServer(...handlers);
