import { createService } from "./createService";

const AUTH_BASE_URL = "https://api.example.com";

export const authServiceApi = createService(AUTH_BASE_URL, {
  skipDefaultRequestMiddleware: true,
  skipDefaultResponseMiddleware: true,
});
