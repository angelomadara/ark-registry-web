<template>
  <div class="max-w-3xl mx-auto">
    <NuxtLink to="/species" class="text-[var(--color-leaf)] hover:underline text-sm mb-4 inline-block">
      &larr; Back to Species
    </NuxtLink>

    <div v-if="speciesStore.loading" class="text-center py-12 text-gray-400">
      Loading...
    </div>

    <div v-else-if="speciesStore.error" class="text-center py-12 text-red-500">
      {{ speciesStore.error }}
    </div>

    <div v-else-if="speciesStore.currentSpecies" class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="speciesStore.currentSpecies.image_url" class="h-64 bg-gray-100">
        <img
          :src="speciesStore.currentSpecies.image_url"
          :alt="speciesStore.currentSpecies.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="p-6">
        <h1 class="text-3xl font-bold text-[var(--color-forest)]">
          {{ speciesStore.currentSpecies.name }}
        </h1>
        <p class="text-gray-400 italic text-lg mb-4">
          {{ speciesStore.currentSpecies.scientific_name }}
        </p>

        <span
          class="inline-block text-sm px-3 py-1 rounded-full mb-4"
          :class="statusBadgeClass(speciesStore.currentSpecies.conservation_status)"
        >
          {{ speciesStore.currentSpecies.conservation_status }}
        </span>

        <p class="text-gray-700 leading-relaxed">
          {{ speciesStore.currentSpecies.description }}
        </p>

        <p class="text-sm text-gray-400 mt-6">
          Last updated: {{ new Date(speciesStore.currentSpecies.updated_at).toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const speciesStore = useSpeciesStore()

onMounted(() => {
  speciesStore.fetchById(route.params.id as string)
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
