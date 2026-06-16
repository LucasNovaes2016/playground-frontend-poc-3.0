import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./msw/server";

// Liga o servidor MSW antes de toda a suíte.
// `onUnhandledRequest: "error"` falha o teste se algo tentar bater numa URL
// não mockada — garante que nenhum teste vaza para a rede real.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Entre os testes: desfaz handlers pontuais (server.use) e desmonta o DOM.
afterEach(() => {
  server.resetHandlers();
  cleanup();
});

// Encerra o servidor ao final da suíte.
afterAll(() => server.close());
