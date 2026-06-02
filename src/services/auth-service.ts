import { authServiceApi } from "../providers/authService";

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  return authServiceApi.request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logout = async (): Promise<void> => {
  await authServiceApi.request("/auth/logout", {
    method: "POST",
  });
};
