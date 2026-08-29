import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { MapView } from "@/components/restaurant/MapView";
import { getAllCuratedSlugs, getCuratedListBySlug } from "@/services/curated";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCuratedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = await getCuratedListBySlug(slug);
  if (!list) return { title: "Collection not found" };
  return { title: list.title, description: list.description };
}

export default async function CuratedDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const list = await getCuratedListBySlug(slug);
  if (!list) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header>
        <p className="eyebrow text-cobalt">{list.theme}</p>
        <h1 className="display mt-2 text-4xl">{list.title}</h1>
        <p className="mt-4 text-ink-soft">{list.description}</p>
      </header>

      {list.coverImage && (
        <div className="relative mt-7 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ink/[0.04]">
          <Image
            src={list.coverImage}
            alt={list.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-8">
        <MapView
          markers={list.items.map((item) => ({
            id: item.restaurant.id,
            latitude: item.restaurant.latitude,
            longitude: item.restaurant.longitude,
            label: item.restaurant.name,
          }))}
        />
      </div>

      <ol className="mt-8 space-y-8">
        {list.items.map((item, index) => (
          <li key={item.id}>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">
                {index + 1}
              </span>
              {item.comment && <p className="text-sm text-ink-soft">{item.comment}</p>}
            </div>
            <RestaurantCard restaurant={item.restaurant} />
          </li>
        ))}
      </ol>
    </div>
  );
}
