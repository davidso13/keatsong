import Image from "next/image";
import Link from "next/link";
import { MapPin, Car, Clock, TrainFront } from "lucide-react";
import { Badge } from "@/components/ui";
import { RatingBadge } from "./RatingBadge";
import { FOOD_CATEGORY_LABEL } from "@/lib/constants";
import { formatDistance, formatNearestStation, formatPriceRange } from "@/utils/format";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant & { distance?: number | null };
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-ink/25"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/[0.04]">
        {restaurant.thumbnail ? (
          <Image
            src={restaurant.thumbnail}
            alt={restaurant.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-faint">
            No photo
          </div>
        )}
        <Badge variant="solid" className="absolute left-3 top-3">
          {FOOD_CATEGORY_LABEL[restaurant.category]}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-ink">{restaurant.name}</h3>
          <RatingBadge rating={restaurant.ratingAvg} count={restaurant.ratingCount} />
        </div>

        <p className="line-clamp-2 text-sm text-ink-soft">{restaurant.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {restaurant.region}
            {restaurant.distance != null && ` · ${formatDistance(restaurant.distance)}`}
          </span>
          {restaurant.nearestStation && (
            <span className="inline-flex items-center gap-1">
              <TrainFront className="h-3.5 w-3.5" aria-hidden />
              {formatNearestStation(restaurant.nearestStation)}
            </span>
          )}
          <span>{formatPriceRange(restaurant.priceRange)}</span>
          {restaurant.hasParking && (
            <span className="inline-flex items-center gap-1">
              <Car className="h-3.5 w-3.5" aria-hidden />
              Parking
            </span>
          )}
          {restaurant.hasBreakTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Break time
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
