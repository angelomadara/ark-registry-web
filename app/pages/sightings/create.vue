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
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="4"
          placeholder="Describe what you observed — habitat, behavior, number of individuals, etc."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent"
        ></textarea>
      </div>

      <!-- Photo Upload -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
        <input
          id="image"
          ref="imageInput"
          type="file"
          accept="image/*"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] focus:border-transparent file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[var(--color-leaf)] file:text-white file:cursor-pointer file:hover:bg-[var(--color-leaf-light)]"
        />
        <p class="text-xs text-gray-400 mt-1">
          Upload a photo of your sighting (optional)
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
const authStore = useAuthStore()
const router = useRouter()
const imageInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  species_id: '',
  notes: '',
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
    const config = useRuntimeConfig()
    const formData = new FormData()

    formData.append('user_id', String(authStore.user?.id ?? ''))
    formData.append('species_id', form.species_id)
    if (form.notes) {
      formData.append('notes', form.notes)
    }

    if (imageInput.value?.files?.[0]) {
      formData.append('image', imageInput.value.files[0])
    }

    // Use native fetch with FormData — NO Content-Type header (browser sets boundary)
    const response = await fetch(`${config.public.apiBase}/api/v1/species/register`, {
      method: 'POST',
      headers: authStore.token
        ? { Authorization: `Bearer ${authStore.token}` }
        : {},
      body: formData,
    })

    const body = await response.json()

    if (body && body.success === true) {
      success.value = true
      form.species_id = ''
      form.notes = ''
      if (imageInput.value) {
        imageInput.value.value = ''
      }
      setTimeout(() => router.push('/sightings'), 1500)
    } else {
      throw new Error(body.message || 'Failed to submit sighting')
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to submit sighting'
  } finally {
    submitting.value = false
  }
}
</script>
