"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSpeciesList, type Species } from "@/lib/species";

export default function SpeciesListPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");


  async function loadSpecies() {
    setLoading(true);
    setError("");
    try {
      const data = await getSpeciesList({ limit: 50 });
      setSpecies(data.species || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load species."
      );
      // Use demo data for now
      setSpecies([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = search
    ? species.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.scientific_name &&
            s.scientific_name.toLowerCase().includes(search.toLowerCase()))
      )
    : species;


  useEffect(() => {
    (async () => {
      await loadSpecies();
    })()
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest">Species</h1>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search species by name or scientific name..."
          className="w-full max-w-md px-4 py-2 border border-leaf-light rounded-md bg-white text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
        />
      </div>

      {loading && (
        <div className="text-center py-12 text-forest-light">
          Loading species...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-forest-light text-lg">
            {search
              ? "No species match your search."
              : "No species have been registered yet."}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Link
            key={s.id}
            href={`/species/${s.id}`}
            className="bg-white rounded-xl p-5 shadow-sm border border-sky hover:border-leaf hover:shadow-md transition-all"
          >
            {s.image_url && (
              <img
                src={s.image_url}
                alt={s.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-semibold text-forest">{s.name}</h3>
            {s.scientific_name && (
              <p className="text-sm text-leaf italic">{s.scientific_name}</p>
            )}
            {s.conservation_status && (
              <span className="inline-block mt-2 text-xs bg-sky text-forest-light px-2 py-1 rounded-full">
                {s.conservation_status}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
