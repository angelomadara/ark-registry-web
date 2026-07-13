import { apiFetch } from "./api";

export interface Species {
  id: number;
  name: string;
  scientific_name?: string;
  description?: string;
  conservation_status?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpeciesListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SpeciesListResponse {
  species: Species[];
  total: number;
  page: number;
  limit: number;
}

export interface Sighting {
  id: number;
  species_id: number;
  species_name?: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
  observed_at?: string;
  reported_by?: string;
  created_at?: string;
}

export interface SightingListParams {
  page?: number;
  limit?: number;
  species_id?: number;
}

export interface SightingListResponse {
  sightings: Sighting[];
  total: number;
  page: number;
  limit: number;
}

// Species
export async function getSpeciesList(
  params: SpeciesListParams = {}
): Promise<SpeciesListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);

  const qs = searchParams.toString();
  return apiFetch<SpeciesListResponse>(
    `/api/v1/species${qs ? `?${qs}` : ""}`
  );
}

export async function getSpeciesById(id: number): Promise<Species> {
  return apiFetch<Species>(`/api/v1/species/${id}`);
}

// Sightings
export async function getSightingsList(
  params: SightingListParams = {}
): Promise<SightingListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.species_id) searchParams.set("species_id", String(params.species_id));

  const qs = searchParams.toString();
  return apiFetch<SightingListResponse>(
    `/api/v1/species/sightings${qs ? `?${qs}` : ""}`
  );
}

export async function createSighting(
  formData: FormData
): Promise<Sighting> {
  return apiFetch<Sighting>("/api/v1/species/register", {
    method: "POST",
    body: formData,
  });
}
