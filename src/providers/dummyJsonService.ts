import { createService } from "./createService";

const DUMMY_JSON_BASE_URL = "https://dummyjson.com";

export const dummyJsonApi = createService(DUMMY_JSON_BASE_URL);
