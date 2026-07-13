"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSightingsList, type Sighting } from "@/lib/species";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SightingsListPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/sightings");
      return;
    }
    loadSightings();
  }, [isAuthenticated]);

  async function loadSightings() {
    setLoading(true);
    setError("");
    try {
      const data = await getSightingsList({ limit: 50 });
      setSightings(data.sightings || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sightings."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest">Sightings</h1>
        <Link
          href="/sightings/create"
          className="bg-leaf text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-leaf-light transition-colors"
        >
          + Report New Sighting
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12 text-forest-light">
          Loading sightings...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {!loading && !error && sightings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-forest-light text-lg">
            No sightings have been reported yet.
          </p>
          <Link
            href="/sightings/create"
            className="text-leaf hover:text-leaf-light font-medium mt-2 inline-block"
          >
            Be the first to report one!
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {sightings.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-sky"
          >
            <div className="flex gap-4">
              {s.image_url && (
                <img
                  src={s.image_url}
                  alt="Sighting"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-forest">
                  {s.species_name || `Species #${s.species_id}`}
                </h3>
                {s.description && (
                  <p className="text-forest-light text-sm mt-1">
                    {s.description}
                  </p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-earth">
                  {s.observed_at && (
                    <span>
                      Observed: {new Date(s.observed_at).toLocaleDateString()}
                    </span>
                  )}
                  {s.latitude && s.longitude && (
                    <span>
                      {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                    </span>
                  )}
                  {s.reported_by && <span>By: {s.reported_by}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
