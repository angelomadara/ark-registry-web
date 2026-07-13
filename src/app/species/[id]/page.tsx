"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSpeciesById, type Species } from "@/lib/species";

export default function SpeciesDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadSpecies();
  }, [id]);

  async function loadSpecies() {
    setLoading(true);
    setError("");
    try {
      const data = await getSpeciesById(id);
      setSpecies(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load species details."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-forest-light">
        Loading species details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md inline-block">
          {error}
        </div>
        <div className="mt-4">
          <Link
            href="/species"
            className="text-leaf hover:text-leaf-light font-medium"
          >
            &larr; Back to species list
          </Link>
        </div>
      </div>
    );
  }

  if (!species) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/species"
        className="text-leaf hover:text-leaf-light font-medium mb-6 inline-block"
      >
        &larr; Back to species list
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-sky overflow-hidden">
        {species.image_url && (
          <img
            src={species.image_url}
            alt={species.name}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-forest">{species.name}</h1>

          {species.scientific_name && (
            <p className="text-lg text-leaf italic">
              {species.scientific_name}
            </p>
          )}

          {species.conservation_status && (
            <div>
              <span className="text-sm font-medium text-forest">
                Conservation Status:{" "}
              </span>
              <span className="inline-block text-xs bg-sky text-forest-light px-3 py-1 rounded-full">
                {species.conservation_status}
              </span>
            </div>
          )}

          {species.description && (
            <div>
              <h2 className="text-xl font-semibold text-forest mb-2">
                Description
              </h2>
              <p className="text-forest-light leading-relaxed">
                {species.description}
              </p>
            </div>
          )}

          <div className="text-sm text-earth border-t border-sky pt-4">
            {species.created_at && (
              <p>First recorded: {new Date(species.created_at).toLocaleDateString()}</p>
            )}
            {species.updated_at && (
              <p>Last updated: {new Date(species.updated_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
