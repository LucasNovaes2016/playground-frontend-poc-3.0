export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
  skipDefaultRequestMiddleware?: boolean;
  skipDefaultResponseMiddleware?: boolean;
}

export interface CreateApiClientOptions {
  defaultParams?: Record<string, unknown>;
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

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
