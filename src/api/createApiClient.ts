import { ApiClient, CreateApiClientOptions, RequestOptions } from "../types";
import { clearToken, formatQueryString, getToken } from "../utils";

export function createApiClient(
  baseURL: string,
  config: CreateApiClientOptions = {},
): ApiClient {
  async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const useDefaultRequest =
      !config.skipDefaultRequestMiddleware &&
      !options.skipDefaultRequestMiddleware;

    const params: Record<string, unknown> = useDefaultRequest
      ? { ...(config.defaultParams ?? {}), ...(options.params ?? {}) }
      : (options.params ?? {});

    const token = getToken();

    const isFormData =
      options.body instanceof FormData || options.body instanceof Blob;

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
      ...(!isFormData && {
        "Content-Type": "application/json",
      }),
      ...(useDefaultRequest && token
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
