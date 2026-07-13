import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-forest mb-4">
          The Ark Registry
        </h1>
        <p className="text-xl text-forest-light max-w-2xl mx-auto">
          A digital platform for biodiversity monitoring, species conservation,
          and citizen science reporting.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/species"
            className="bg-leaf text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-leaf-light transition-colors"
          >
            Browse Species
          </Link>
          <Link
            href="/login"
            className="bg-forest text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-forest-light transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Stats / Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-sky">
          <h3 className="text-forest text-lg font-semibold mb-2">
            Species Database
          </h3>
          <p className="text-forest-light">
            Explore our curated database of documented species with detailed
            profiles, images, and conservation status.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-sky">
          <h3 className="text-forest text-lg font-semibold mb-2">
            Community Sightings
          </h3>
          <p className="text-forest-light">
            Report and view species sightings from contributors around the
            world. Every observation helps conservation.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-sky">
          <h3 className="text-forest text-lg font-semibold mb-2">
            Conservation Tracking
          </h3>
          <p className="text-forest-light">
            Monitor conservation status and population trends with community
            contributions.
          </p>
        </div>
      </section>
    </div>
  );
}
