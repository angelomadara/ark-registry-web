<template>
  <div class="max-w-3xl mx-auto">
    <NuxtLink to="/sightings" class="text-[var(--color-leaf)] hover:underline text-sm mb-4 inline-block">
      &larr; Back to Sightings
    </NuxtLink>

    <h1 class="text-2xl font-bold text-[var(--color-forest)] mb-6">Report a Sighting</h1>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-4">
      <!-- Species Selection -->
      <div>
        <label for="species_id" class="block text-sm font-medium text-gray-700 mb-1">Species *</label>
        <select
          id="species_id"
          v-model="form.species_id"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent bg-white"
        >
          <option value="" disabled>Select a species</option>
          <option
            v-for="species in speciesStore.speciesList"
            :key="species.id"
            :value="species.id"
          >
            {{ species.name }} ({{ species.scientific_name }})
          </option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          placeholder="Describe what you observed — habitat, behavior, number of individuals, etc."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        ></textarea>
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          placeholder="e.g. Amazon Rainforest, Brazil"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        />
      </div>

      <!-- Photo Upload -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
        <input
          id="image"
          v-model="form.image_url"
          type="url"
          placeholder="https://example.com/photo.jpg"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">
          Provide a URL to an image of your sighting
        </p>
      </div>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-sm">Sighting reported successfully!</p>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full bg-[var(--color-forest)] text-white py-2.5 rounded-lg hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-50"
      >
        {{ submitting ? 'Submitting...' : 'Submit Sighting' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const speciesStore = useSpeciesStore()
const router = useRouter()

const form = reactive({
  species_id: '',
  description: '',
  location: '',
  image_url: '',
})

const error = ref('')
const success = ref(false)
const submitting = ref(false)

onMounted(() => {
  speciesStore.fetchAll()
})

async function handleSubmit() {
  error.value = ''
  success.value = false
  submitting.value = true

  try {
    await apiFetch('/api/species-sightings', {
      method: 'POST',
      body: JSON.stringify({
        species_id: Number(form.species_id),
        description: form.description || undefined,
        location: form.location || undefined,
        image_url: form.image_url || undefined,
      }),
    })

    success.value = true
    // Reset form
    form.species_id = ''
    form.description = ''
    form.location = ''
    form.image_url = ''

    // Redirect after a moment
    setTimeout(() => router.push('/sightings'), 1500)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to submit sighting'
  } finally {
    submitting.value = false
  }
}
</script>
