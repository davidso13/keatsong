import { RestaurantListSkeleton } from "@/components/restaurant/RestaurantList";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="h-9 w-48 animate-pulse rounded bg-ink/[0.07]" />
      <div className="mt-8">
        <RestaurantListSkeleton />
      </div>
    </div>
  );
}
