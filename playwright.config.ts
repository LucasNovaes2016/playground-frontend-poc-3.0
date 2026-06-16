import { defineConfig, devices } from "@playwright/test";

// Alterne para a build de produção (vite build && vite preview) com E2E_PREVIEW=1.
const USE_PREVIEW = !!process.env.E2E_PREVIEW;
const PORT = USE_PREVIEW ? 4173 : 5173;
const baseURL = `http://localhost:${PORT}`;

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",

  // Roda arquivos em paralelo.
  fullyParallel: true,
  // Falha o build de CI se um test.only for commitado por engano.
  forbidOnly: !!process.env.CI,
  // Retenta só em CI; localmente um flake deve aparecer na hora.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"], ["list"]]
    : [["html", { open: "never" }], ["list"]],

  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Cross-browser fica pronto para ligar quando a suíte estiver estável:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: USE_PREVIEW
      ? "npm run build && npm run preview -- --port 4173"
      : "npm run dev -- --port 5173",
    url: baseURL,
    // Localmente reaproveita um server já rodando; em CI sempre sobe limpo.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
