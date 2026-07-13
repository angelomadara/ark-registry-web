export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: { id: number; name: string; email: string } }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    )

    authStore.setUser(data.user, data.token)
    return data
  }

  async function register(name: string, email: string, password: string) {
    const data = await apiFetch<{ token: string; user: { id: number; name: string; email: string } }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
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
