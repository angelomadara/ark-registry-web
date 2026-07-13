<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-[var(--color-forest)] text-white shadow-lg">
      <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight">
          <span class="text-[var(--color-leaf-light)]">The Ark</span> Registry
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/species"
            class="hover:text-[var(--color-leaf-light)] transition-colors"
          >
            Species
          </NuxtLink>
          <NuxtLink
            to="/sightings"
            class="hover:text-[var(--color-leaf-light)] transition-colors"
          >
            Sightings
          </NuxtLink>
          <button
            v-if="authStore.isAuthenticated"
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

    <main class="flex-1 container mx-auto px-4 py-6">
      <slot />
    </main>

    <footer class="bg-[var(--color-forest)] text-white/70 text-sm text-center py-4">
      &copy; {{ new Date().getFullYear() }} The Ark Registry &mdash; Documenting Earth's Biodiversity
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { logout } = useAuth()

function handleLogout() {
  logout()
}
</script>
