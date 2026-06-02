import { createApiClient } from "./createApiClient";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const jsonPlaceholderApi = createApiClient(API_BASE_URL, {
  skipDefaultRequestMiddleware: true,
  skipDefaultResponseMiddleware: true,
});
