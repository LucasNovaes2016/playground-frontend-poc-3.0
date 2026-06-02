export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
  skipDefaultRequestMiddleware?: boolean;
  skipDefaultResponseMiddleware?: boolean;
}

export interface CreateApiClientOptions {
  skipDefaultRequestMiddleware?: boolean;
  skipDefaultResponseMiddleware?: boolean;
  requestInterceptor?: (config: {
    url: string;
    init: RequestInit;
    options: RequestOptions;
  }) =>
    | Promise<{ url: string; init: RequestInit }>
    | { url: string; init: RequestInit };
  responseInterceptor?: (response: Response) => Promise<Response> | Response;
  errorInterceptor?: (error: unknown) => Promise<unknown> | unknown;
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
}
