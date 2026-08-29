import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Car, Clock, MapPin, Phone, TrainFront } from "lucide-react";
import { Badge } from "@/components/ui";
import { RatingBadge } from "@/components/restaurant/RatingBadge";
import { ReviewList } from "@/components/restaurant/ReviewList";
import { MapView } from "@/components/restaurant/MapView";
import { getAllRestaurantIds, getRestaurantById } from "@/services/restaurants";
import { FOOD_CATEGORY_LABEL } from "@/lib/constants";
import { formatNearestStation, formatPriceRange } from "@/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllRestaurantIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const restaurant = await getRestaurantById(id);
  if (!restaurant) return { title: "Restaurant not found" };
  return {
    title: restaurant.name,
    description: restaurant.description,
  };
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const restaurant = await getRestaurantById(id);
  if (!restaurant) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {restaurant.thumbnail && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ink/[0.04]">
          <Image
            src={restaurant.thumbnail}
            alt={restaurant.name}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mt-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{FOOD_CATEGORY_LABEL[restaurant.category]}</Badge>
          <Badge variant="outline">{formatPriceRange(restaurant.priceRange)}</Badge>
        </div>
        <h1 className="display mt-4 text-4xl">{restaurant.name}</h1>
        <div className="mt-3">
          <RatingBadge rating={restaurant.ratingAvg} count={restaurant.ratingCount} />
        </div>
        <p className="mt-4 text-ink-soft">{restaurant.description}</p>
      </header>

      <dl className="mt-7 space-y-2 rounded-2xl border border-line bg-surface p-5 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-ink-faint" aria-hidden />
          <dd>{restaurant.address}</dd>
        </div>
        {restaurant.nearestStation && (
          <div className="flex items-center gap-2">
            <TrainFront className="h-4 w-4 text-ink-faint" aria-hidden />
            <dd>{formatNearestStation(restaurant.nearestStation)}</dd>
          </div>
        )}
        {restaurant.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-ink-faint" aria-hidden />
            <dd>{restaurant.phone}</dd>
          </div>
        )}
        <div className="flex items-center gap-4 pt-1 text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Car className="h-4 w-4" aria-hidden />
            Parking {restaurant.hasParking ? "available" : "not available"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden />
            Break time {restaurant.hasBreakTime ? "yes" : "no"}
          </span>
        </div>
      </dl>

      <section className="mt-9">
        <h2 className="mb-3 font-display text-lg font-semibold">Location</h2>
        <MapView
          center={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
          markers={[
            {
              id: restaurant.id,
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
              label: restaurant.name,
            },
          ]}
          level={3}
        />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold">
          Reviews <span className="text-ink-faint">{restaurant.reviews.length}</span>
        </h2>
        <ReviewList reviews={restaurant.reviews} />
      </section>
    </article>
  );
}
