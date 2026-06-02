export const AUTH_DATA = {
  token: "fake-auth-token-1234",
  userId: 42,
  tenant: "playground",
};

export function getToken(): string | null {
  return localStorage.getItem("authToken") || AUTH_DATA.token;
}

export function clearToken(): void {
  localStorage.removeItem("authToken");
}

export function formatQueryString(
  params: Record<string, unknown> = {},
): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map(
            (item) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
          )
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return entries.join("&");
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
  skipDefaultRequestMiddleware?: boolean;
  skipDefaultResponseMiddleware?: boolean;
}

export interface CreateServiceOptions {
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

export function createService(
  baseURL: string,
  config: CreateServiceOptions = {},
): ApiClient {
  async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const defaultParams = {
      userId: AUTH_DATA.userId,
      tenant: AUTH_DATA.tenant,
      appClient: "web",
    };

    const useDefaultRequest =
      !config.skipDefaultRequestMiddleware &&
      !options.skipDefaultRequestMiddleware;

    const params = useDefaultRequest
      ? { ...defaultParams, ...options.params }
      : (options.params ?? {});

    const token = getToken();

    const isFormData =
      options.body instanceof FormData || options.body instanceof Blob;

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
      ...(!isFormData && {
        "Content-Type": "application/json",
      }),
      ...(!config.skipDefaultRequestMiddleware && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    };

    const mergedHeaders = {
      ...defaultHeaders,
      ...options.headers,
    };

    const queryString = formatQueryString(params);
    let url = `${baseURL}${path}${queryString ? `?${queryString}` : ""}`;

    let body: BodyInit | undefined;

    if (options.body instanceof FormData || options.body instanceof Blob) {
      body = options.body;
    } else if (options.body !== undefined) {
      body = JSON.stringify(options.body);
    }

    let init: RequestInit = {
      method: options.method ?? "GET",
      headers: mergedHeaders,
      body,
    };

    if (config.requestInterceptor) {
      const intercepted = await config.requestInterceptor({
        url,
        init,
        options,
      });
      url = intercepted.url;
      init = intercepted.init;
    }

    const response = await fetch(url, init);

    const handledResponse = config.responseInterceptor
      ? await config.responseInterceptor(response)
      : response;

    if (
      handledResponse.status === 401 &&
      !config.skipDefaultResponseMiddleware &&
      !options.skipDefaultResponseMiddleware
    ) {
      await clearToken();
      window.location.reload();
      throw new Error("Unauthorized");
    }

    if (!handledResponse.ok) {
      const error = new Error(
        `Failed to fetch ${path}: ${handledResponse.status} ${handledResponse.statusText}`,
      );
      if (config.errorInterceptor) {
        await config.errorInterceptor(error);
      }
      throw error;
    }

    return handledResponse.json();
  }

  return { request };
}
