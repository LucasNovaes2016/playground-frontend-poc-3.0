import { createApiClient } from "./createApiClient";

const DUMMY_JSON_BASE_URL = "https://dummyjson.com";

export const dummyJsonApi = createApiClient(DUMMY_JSON_BASE_URL, {
  skipDefaultRequestMiddleware: true,
  skipDefaultResponseMiddleware: true,
});
