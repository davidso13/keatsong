import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RestaurantFilters } from "@/components/restaurant/RestaurantFilters";
import {
  RestaurantList,
  RestaurantListSkeleton,
} from "@/components/restaurant/RestaurantList";
import { MapView } from "@/components/restaurant/MapView";
import { getRestaurants } from "@/services/restaurants";
import { restaurantQuerySchema } from "@/lib/schemas/restaurant";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Find restaurants near you by cuisine, price and area.",
};

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "distance", label: "Nearest" },
  { value: "latest", label: "Newest" },
] as const;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const normalized = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  const parsed = restaurantQuerySchema.safeParse(normalized);
  const query = parsed.success ? parsed.data : restaurantQuerySchema.parse({});

  const { items, total, page, hasNext } = await getRestaurants(query);

  const buildSortHref = (sort: string) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string") params.set(key, value);
    }
    params.set("sort", sort);
    params.delete("page");
    return `/restaurants?${params.toString()}`;
  };

  const buildPageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === "string") params.set(key, value);
    }
    params.set("page", String(nextPage));
    return `/restaurants?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Directory</p>
      <h1 className="display mt-2 text-4xl">Restaurants</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {total.toLocaleString("en-US")} {total === 1 ? "place" : "places"}
      </p>

      <div className="mt-8">
        <MapView
          markers={items.map((r) => ({
            id: r.id,
            latitude: r.latitude,
            longitude: r.longitude,
            label: r.name,
          }))}
        />
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="h-40" />}>
          <RestaurantFilters />
        </Suspense>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {SORT_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={buildSortHref(option.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              query.sort === option.value
                ? "bg-night text-white"
                : "bg-ink/[0.06] text-ink-soft hover:bg-ink/[0.1]",
            )}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Suspense fallback={<RestaurantListSkeleton />}>
          <RestaurantList restaurants={items} />
        </Suspense>
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        {page > 1 && (
          <Link
            href={buildPageHref(page - 1)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Previous
          </Link>
        )}
        <span className="text-sm text-ink-faint">Page {page}</span>
        {hasNext && (
          <Link
            href={buildPageHref(page + 1)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
