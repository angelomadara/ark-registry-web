"use client";

import { useState, type FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSighting } from "@/lib/species";
import { useAuth } from "@/app/context/AuthContext";

export default function CreateSightingPage() {
  const [speciesId, setSpeciesId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [observedAt, setObservedAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (typeof window !== "undefined" && !isAuthenticated) {
    router.push("/login?redirect=/sightings/create");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!speciesId || isNaN(Number(speciesId))) {
      setError("A valid species ID is required.");
      return;
    }

    if (!latitude || !longitude) {
      setError("Latitude and longitude are required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("species_id", speciesId);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (description) formData.append("description", description);
      if (observedAt) formData.append("observed_at", observedAt);

      if (fileRef.current?.files?.[0]) {
        formData.append("image", fileRef.current.files[0]);
      }

      await createSighting(formData);
      router.push("/sightings");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to report sighting. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/sightings"
        className="text-leaf hover:text-leaf-light font-medium mb-6 inline-block"
      >
        &larr; Back to sightings
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-sky p-8">
        <h1 className="text-2xl font-bold text-forest mb-6">
          Report a Sighting
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="speciesId"
                className="block text-sm font-medium text-forest mb-1"
              >
                Species ID *
              </label>
              <input
                id="speciesId"
                type="number"
                value={speciesId}
                onChange={(e) => setSpeciesId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label
                htmlFor="observedAt"
                className="block text-sm font-medium text-forest mb-1"
              >
                Date Observed
              </label>
              <input
                id="observedAt"
                type="date"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
                className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest focus:outline-none focus:ring-2 focus:ring-leaf"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-forest mb-1"
              >
                Latitude *
              </label>
              <input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
                placeholder="e.g. 51.5074"
              />
            </div>
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-forest mb-1"
              >
                Longitude *
              </label>
              <input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
                placeholder="e.g. -0.1278"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-forest mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
              placeholder="Describe what you observed..."
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-forest mb-1"
            >
              Photo
            </label>
            <input
              ref={fileRef}
              id="image"
              type="file"
              accept="image/*"
              className="w-full text-sm text-forest file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-sky file:text-forest hover:file:bg-leaf hover:file:text-white transition-colors cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-leaf text-white py-2.5 rounded-md font-medium hover:bg-leaf-light transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Sighting"}
          </button>
        </form>
      </div>
    </div>
  );
}
