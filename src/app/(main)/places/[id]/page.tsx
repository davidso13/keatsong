import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui";
import { MapView } from "@/components/restaurant/MapView";
import { getAllPlaceIds, getPlaceById } from "@/services/places";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getAllPlaceIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const place = await getPlaceById(id);
  if (!place) return { title: "Not found" };
  return { title: place.name, description: place.description };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const place = await getPlaceById(id);
  if (!place) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/places"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Places
      </Link>

      {place.thumbnail && (
        <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ink/[0.04]">
          <Image
            src={place.thumbnail}
            alt={place.name}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mt-7">
        <Badge variant="accent">{place.category}</Badge>
        <h1 className="display mt-4 text-4xl">{place.name}</h1>
        <p className="mt-4 text-ink-soft">{place.description}</p>
      </header>

      <dl className="mt-7 space-y-2 rounded-2xl border border-line bg-surface p-5 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-ink-faint" aria-hidden />
          <dd>{place.address ?? place.region}</dd>
        </div>
        {place.bestTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-ink-faint" aria-hidden />
            <dd>{place.bestTime}</dd>
          </div>
        )}
      </dl>

      {place.latitude != null && place.longitude != null && (
        <section className="mt-9">
          <h2 className="mb-3 font-display text-lg font-semibold">Location</h2>
          <MapView
            center={{ latitude: place.latitude, longitude: place.longitude }}
            markers={[
              {
                id: place.id,
                latitude: place.latitude,
                longitude: place.longitude,
                label: place.name,
              },
            ]}
            level={4}
          />
        </section>
      )}
    </article>
  );
}
