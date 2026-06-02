import { createService } from "./createService";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const jsonPlaceholderApi = createService(API_BASE_URL);
