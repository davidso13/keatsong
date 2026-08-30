import type { Metadata } from "next";
import { ContentCard } from "@/components/content/ContentCard";
import { getPlaces } from "@/services/places";

export const metadata: Metadata = {
  title: "Places",
  description: "Landmarks, parks, museums and neighbourhoods worth a visit.",
};

export default async function PlacesPage() {
  const places = await getPlaces();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Explore</p>
      <h1 className="display mt-2 text-4xl">Places</h1>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Spots worth building a day around — with the best time to go and how to get there.
      </p>

      {places.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink-faint">
          Nothing listed yet. Add entries to{" "}
          <code className="font-mono text-ink-soft">src/data/places.json</code>.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <ContentCard
              key={place.id}
              href={`/places/${place.id}`}
              title={place.name}
              description={place.description}
              category={place.category}
              region={place.region}
              thumbnail={place.thumbnail}
              meta={place.bestTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}
