export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: number; name: string; email: string } | null>(null)
  const token = ref<string | null>(null)

  // Hydrate from localStorage on init
  if (import.meta.client) {
    const stored = localStorage.getItem('ark_auth')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        user.value = parsed.user
        token.value = parsed.token
      } catch {
        localStorage.removeItem('ark_auth')
      }
    }
  }

  const isAuthenticated = computed(() => !!token.value)

  function setUser(userData: { id: number; name: string; email: string }, authToken: string) {
    user.value = userData
    token.value = authToken
    if (import.meta.client) {
      localStorage.setItem('ark_auth', JSON.stringify({ user: userData, token: authToken }))
    }
  }

  function clearUser() {
    user.value = null
    token.value = null
    if (import.meta.client) {
      localStorage.removeItem('ark_auth')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    clearUser,
  }
})
