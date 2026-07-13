<template>
  <div class="max-w-7xl mx-auto">
    <!-- Hero -->
    <section class="text-center py-12">
      <h1 class="text-4xl font-bold text-[var(--color-forest)] mb-3">
        Welcome to The Ark Registry
      </h1>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        A crowdsourced platform for documenting, discovering, and preserving
        Earth's incredible biodiversity — one species at a time.
      </p>
      <div class="mt-6 flex gap-3 justify-center">
        <NuxtLink
          to="/species"
          class="bg-[var(--color-forest)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--color-forest-light)] transition-colors"
        >
          Browse Species
        </NuxtLink>
        <NuxtLink
          to="/sightings/create"
          class="bg-[var(--color-leaf)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--color-leaf-light)] transition-colors"
        >
          Report a Sighting
        </NuxtLink>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="grid md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-[var(--color-forest)]">{{ stats.totalSpecies }}</div>
        <div class="text-gray-500 text-sm mt-1">Total Species</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-[var(--color-leaf)]">{{ stats.totalSightings }}</div>
        <div class="text-gray-500 text-sm mt-1">Total Sightings</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-[var(--color-earth)]">{{ stats.recentSightings }}</div>
        <div class="text-gray-500 text-sm mt-1">Recent Sightings (7d)</div>
      </div>
    </section>

    <!-- Recent Species -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-[var(--color-forest)]">Recent Species</h2>
        <NuxtLink to="/species" class="text-[var(--color-leaf)] hover:underline text-sm">
          View All &rarr;
        </NuxtLink>
      </div>
      <div v-if="loading" class="text-center py-8 text-gray-400">Loading...</div>
      <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
      <div v-else class="grid md:grid-cols-3 gap-4">
        <div
          v-for="species in speciesStore.speciesList.slice(0, 6)"
          :key="species.id"
          class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <NuxtLink :to="`/species/${species.id}`">
            <h3 class="font-semibold text-[var(--color-forest)]">{{ species.name }}</h3>
            <p class="text-sm text-gray-400 italic">{{ species.scientific_name }}</p>
            <span
              class="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
              :class="statusBadgeClass(species.conservation_status)"
            >
              {{ species.conservation_status }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const speciesStore = useSpeciesStore()
const loading = ref(true)
const error = ref<string | null>(null)
const stats = ref({
  totalSpecies: 0,
  totalSightings: 0,
  recentSightings: 0,
})

onMounted(async () => {
  // Fetch stats
  try {
    const data = await apiFetch<{
      totalSpecies: number
      totalSightings: number
      recentSightings: number
    }>('/api/species/stats')
    stats.value = data
  } catch {
    // Stats endpoint may not exist yet — default to zeros
  }

  // Fetch recent species
  try {
    await speciesStore.fetchAll()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load species'
  } finally {
    loading.value = false
  }
})

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    'Endangered': 'bg-red-100 text-red-700',
    'Vulnerable': 'bg-orange-100 text-orange-700',
    'Near Threatened': 'bg-yellow-100 text-yellow-700',
    'Least Concern': 'bg-green-100 text-green-700',
    'Critically Endangered': 'bg-red-200 text-red-800',
    'Extinct in the Wild': 'bg-gray-200 text-gray-700',
  }
  return map[status] || 'bg-blue-100 text-blue-700'
}
</script>
