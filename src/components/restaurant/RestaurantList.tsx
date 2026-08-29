import { RestaurantCard } from "./RestaurantCard";
import { Skeleton } from "@/components/ui";
import type { Restaurant } from "@/types";

interface RestaurantListProps {
  restaurants: (Restaurant & { distance?: number | null })[];
  emptyMessage?: string;
}

export function RestaurantList({
  restaurants,
  emptyMessage = "No restaurants match these filters.",
}: RestaurantListProps) {
  if (restaurants.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/20 py-16 text-center text-sm text-ink-faint">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}

export function RestaurantListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-line">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
