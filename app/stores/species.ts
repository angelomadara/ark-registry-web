import type { Species } from '~/composables/useSpecies'

export const useSpeciesStore = defineStore('species', () => {
  const speciesList = ref<Species[]>([])
  const currentSpecies = ref<Species | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const { getAll } = useSpecies()
      speciesList.value = await getAll()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load species'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const { getById } = useSpecies()
      currentSpecies.value = await getById(id)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load species'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  return {
    speciesList,
    currentSpecies,
    loading,
    error,
    fetchAll,
    fetchById,
  }
})
