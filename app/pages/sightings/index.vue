<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-[var(--color-forest)] mb-6">Sightings</h1>

    <div class="mb-6">
      <NuxtLink
        to="/sightings/create"
        class="bg-[var(--color-leaf)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-leaf-light)] transition-colors"
      >
        + Report a Sighting
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">
      Loading sightings...
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="sightings.length === 0" class="text-center py-12 text-gray-400">
      No sightings reported yet. Be the first!
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="sighting in sightings"
        :key="sighting.id"
        class="bg-white rounded-lg shadow p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-[var(--color-forest)]">
              {{ sighting.species_name || `Species #${sighting.species_id}` }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ new Date(sighting.created_at).toLocaleDateString() }}
            </p>
          </div>
          <span
            v-if="sighting.location"
            class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded"
          >
            {{ sighting.location }}
          </span>
        </div>
        <p v-if="sighting.description" class="text-sm text-gray-600 mt-2">
          {{ sighting.description }}
        </p>
        <img
          v-if="sighting.image_url"
          :src="sighting.image_url"
          alt="Sighting photo"
          class="mt-3 rounded-lg max-h-48 object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

interface Sighting {
  id: number
  species_id: number
  species_name?: string
  description?: string
  location?: string
  image_url?: string
  created_at: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const sightings = ref<Sighting[]>([])

onMounted(async () => {
  try {
    sightings.value = await apiFetch<Sighting[]>('/api/v1/species/sightings')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load sightings'
  } finally {
    loading.value = false
  }
})
</script>
