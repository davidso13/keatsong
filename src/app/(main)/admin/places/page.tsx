import type { Metadata } from "next";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { DeletableList } from "@/components/admin/DeletableList";
import { getPlaces } from "@/services/places";

export const metadata: Metadata = { title: "Places" };

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const places = await getPlaces();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-semibold text-ink">Add a place</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Registered places appear on <code className="font-mono">/places</code>.
        </p>
        <div className="mt-4">
          <PlaceForm />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink">
          Existing <span className="text-ink-faint">{places.length}</span>
        </h2>
        <div className="mt-4">
          <DeletableList
            endpoint="/api/admin/places"
            emptyMessage="Nothing yet."
            rows={places.map((p) => ({
              id: p.id,
              title: p.name,
              subtitle: `${p.category} · ${p.region}`,
              href: `/places/${p.id}`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
