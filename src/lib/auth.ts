import { apiFetch, setToken, clearToken } from "./api";

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  setToken(data.token);
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const data = await apiFetch<RegisterResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

  setToken(data.token);
  return data;
}

export function logout(): void {
  clearToken();
}
