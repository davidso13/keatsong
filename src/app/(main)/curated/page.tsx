import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCuratedLists } from "@/services/curated";

export const metadata: Metadata = {
  title: "Collections",
  description: "Themed restaurant collections for every kind of day.",
};

export default async function CuratedListPage() {
  const lists = await getCuratedLists();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Curated</p>
      <h1 className="display mt-2 text-4xl">Collections</h1>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Restaurants grouped by the moment — &ldquo;rainy day&rdquo;, &ldquo;solo dinner&rdquo;,
        &ldquo;special occasion&rdquo; and more.
      </p>

      {lists.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink-faint">
          No collections published yet. Add entries to{" "}
          <code className="font-mono text-ink-soft">src/data/curated.json</code>.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/curated/${list.slug}`}
              className="group overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="relative aspect-[16/10] bg-ink/[0.04]">
                {list.coverImage && (
                  <Image
                    src={list.coverImage}
                    alt={list.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="eyebrow text-cobalt">{list.theme}</p>
                <h2 className="mt-2 font-display text-lg font-semibold text-ink">{list.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{list.description}</p>
                <p className="mt-3 text-xs text-ink-faint">
                  {list.itemCount} {list.itemCount === 1 ? "place" : "places"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
