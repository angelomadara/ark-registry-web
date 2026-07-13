import type { UseFetchOptions } from 'nuxt/app'

export function useApi<T = unknown>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // Attach auth token if logged in
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  return useFetch<T>(`${config.public.apiBase}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  })
}

/**
 * Raw fetch wrapper for non-useFetch needs (file uploads, etc.)
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  const response = await fetch(`${config.public.apiBase}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new ApiError(response.status, error.message || 'Request failed')
  }

  return response.json()
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
