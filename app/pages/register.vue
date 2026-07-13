<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-[var(--color-forest)] mb-6 text-center">
      Create Account
    </h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="Jane Doe"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
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
          minlength="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        />
      </div>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-[var(--color-forest)] text-white py-2.5 rounded-lg hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-50"
      >
        {{ loading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </form>
    <p class="text-center text-sm text-gray-500 mt-4">
      Already have an account?
      <NuxtLink to="/login" class="text-[var(--color-leaf)] hover:underline">Sign In</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const { register } = useAuth()

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await register(name.value, email.value, password.value)
    router.push('/')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
