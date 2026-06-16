/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/  |  https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // describe/it/expect globais (estilo Jest) — sem precisar importar em cada arquivo
    globals: true,
    // ambiente de DOM para testar componentes React
    environment: "jsdom",
    // roda antes de cada arquivo de teste: matchers do jest-dom + ciclo do MSW
    setupFiles: "./src/test/setup.ts",
    // imports de .css nos componentes são ignorados nos testes
    css: false,
    // Vitest cobre só os testes em src/; os specs e2e (Playwright) ficam fora.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // a build falha se a cobertura cair abaixo destes limites
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 75 },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/types.ts",
        "src/**/*.css",
        "src/test/**",
        "**/*.d.ts",
      ],
    },
  },
});
