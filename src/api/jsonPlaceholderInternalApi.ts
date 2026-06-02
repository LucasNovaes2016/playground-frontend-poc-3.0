import { createApiClient } from "./createApiClient";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const jsonPlaceholderInternalApi = createApiClient(API_BASE_URL, {
  responseInterceptor: (response: Response) => {
    try {
      if (response.url && response.url.includes("simulate401=true")) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
      }
    } catch (e) {
      // ignore and return original response
    }
    return response;
  },
});
