export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(username: string, password: string) {
    const data = await apiFetch<{ token: string; user: { id: number; username: string; role: string } }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    )

    authStore.setUser(data.user, data.token)
    return data
  }

  async function register(username: string, email: string, password: string) {
    const data = await apiFetch<{ token: string; user: { id: number; username: string; role: string } }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }
    )

    authStore.setUser(data.user, data.token)
    return data
  }

  function logout() {
    authStore.clearUser()
    router.push('/login')
  }

  return {
    login,
    register,
    logout,
  }
}
