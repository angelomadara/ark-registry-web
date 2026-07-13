export interface Species {
  id: number
  name: string
  scientific_name: string
  description: string
  conservation_status: string
  image_url?: string
  created_at: string
  updated_at: string
}

export function useSpecies() {
  async function getAll(): Promise<Species[]> {
    return apiFetch<Species[]>('/api/species')
  }

  async function getById(id: number | string): Promise<Species> {
    return apiFetch<Species>(`/api/species/${id}`)
  }

  return {
    getAll,
    getById,
  }
}
