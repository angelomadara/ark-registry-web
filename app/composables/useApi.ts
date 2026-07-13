import type { UseFetchOptions } from 'nuxt/app'

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

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
 * useApiFetch — wraps Nuxt's useFetch, unwraps the response envelope.
 * Returns response.data when success: true.
 * Throws ApiError when success: false.
 */
export function useApiFetch<T = unknown>(
  url: string,
  options: UseFetchOptions<ApiResponse<T>> = {}
) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  return useFetch<ApiResponse<T>>(`${config.public.apiBase}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
    onResponse({ response }) {
      const body = response._data as ApiResponse<T>
      if (body && body.success === true) {
        response._data = body.data as T
      } else if (body && body.success === false) {
        throw new ApiError(response.status, body.message || 'Request failed')
      }
    },
  })
}

/**
 * Raw fetch wrapper for non-useFetch needs (file uploads, etc.)
 * Unwraps the response envelope: returns response.data on success,
 * throws ApiError with response.message on failure.
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

  const body = await response.json().catch(() => ({ success: false, message: response.statusText }))

  if (body && body.success === true) {
    return body.data as T
  }

  if (body && body.success === false) {
    throw new ApiError(response.status, body.message || 'Request failed')
  }

  // Fallback for responses without envelope (legacy / non-standard)
  if (!response.ok) {
    throw new ApiError(response.status, body.message || response.statusText)
  }

  return body as T
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
