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
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
}

export function createService(baseURL: string): ApiClient {
  async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const defaultParams = {
      userId: AUTH_DATA.userId,
      tenant: AUTH_DATA.tenant,
      appClient: "web",
    };

    const params = {
      ...defaultParams,
      ...options.params,
    };

    const token = getToken();
    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const mergedHeaders = {
      ...defaultHeaders,
      ...options.headers,
    };

    const queryString = formatQueryString(params);
    const url = `${baseURL}${path}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: mergedHeaders,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
      await clearToken();
      window.location.reload();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${path}: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  return { request };
}
