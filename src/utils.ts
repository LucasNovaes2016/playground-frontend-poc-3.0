export const AUTH_DATA = {
  token: "fake-auth-token-1234",
  userId: 42,
  tenant: "playground",
};

export function getToken(): string | null {
  return localStorage.getItem("authToken");
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
