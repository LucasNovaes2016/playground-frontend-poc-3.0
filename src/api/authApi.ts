import { createApiClient } from "./createApiClient";

const AUTH_BASE_URL = "https://api.example.com";

export const authApi = createApiClient(AUTH_BASE_URL, {
  skipDefaultRequestMiddleware: true,
  skipDefaultResponseMiddleware: true,
});
