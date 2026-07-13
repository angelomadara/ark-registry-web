export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Allow public routes
  if (to.path === '/login' || to.path === '/register') {
    // If already logged in, redirect to dashboard
    if (authStore.isAuthenticated) {
      return navigateTo('/')
    }
    return
  }

  // Protect all other routes
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
