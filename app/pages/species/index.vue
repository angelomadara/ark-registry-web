<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-[var(--color-forest)]">Species</h1>
      <p class="text-sm text-gray-500">{{ speciesStore.speciesList.length }} total</p>
    </div>

    <div v-if="speciesStore.loading" class="text-center py-12 text-gray-400">
      Loading species...
    </div>

    <div v-else-if="speciesStore.error" class="text-center py-12 text-red-500">
      {{ speciesStore.error }}
    </div>

    <div v-else-if="speciesStore.speciesList.length === 0" class="text-center py-12 text-gray-400">
      No species found yet.
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="species in speciesStore.speciesList"
        :key="species.id"
        :to="`/species/${species.id}`"
        class="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow hover:border-l-4 hover:border-l-[var(--color-leaf)]"
      >
        <h2 class="font-semibold text-[var(--color-forest)] text-lg">{{ species.name }}</h2>
        <p class="text-sm text-gray-400 italic mb-2">{{ species.scientific_name }}</p>
        <p class="text-sm text-gray-600 line-clamp-2">{{ species.description }}</p>
        <span
          class="inline-block mt-3 text-xs px-2 py-0.5 rounded-full"
          :class="statusBadgeClass(species.conservation_status)"
        >
          {{ species.conservation_status }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // Species list is PUBLIC — no auth required
})

const speciesStore = useSpeciesStore()

onMounted(() => {
  speciesStore.fetchAll()
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
