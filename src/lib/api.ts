export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.arkregistry.org";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ark_token");
}

export function setToken(token: string): void {
  localStorage.setItem("ark_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("ark_token");
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (let browser set multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Handle non-JSON responses
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    if (!res.ok) {
      throw new ApiError(res.status, `HTTP ${res.status}: ${res.statusText}`);
    }
    return (await res.text()) as unknown as T;
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new ApiError(
      res.status,
      json.message || "Request failed",
      json.data
    );
  }

  return json.data;
}
