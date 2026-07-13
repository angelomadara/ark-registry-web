<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-[var(--color-forest)] mb-6 text-center">
      Sign In
    </h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          placeholder="your_username"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        />
      </div>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-[var(--color-forest)] text-white py-2.5 rounded-lg hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
    <p class="text-center text-sm text-gray-500 mt-4">
      Don't have an account?
      <NuxtLink to="/register" class="text-[var(--color-leaf)] hover:underline">Register</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const { login } = useAuth()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(username.value, password.value)
    router.push('/')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
