import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { HomeSearch } from "@/components/home/HomeSearch";
import { RestaurantList } from "@/components/restaurant/RestaurantList";
import { getBanners } from "@/services/banners";
import { getRestaurants } from "@/services/restaurants";
import { restaurantQuerySchema } from "@/lib/schemas/restaurant";

export default async function HomePage() {
  const [banners, { items: topRestaurants }] = await Promise.all([
    getBanners(),
    getRestaurants(restaurantQuerySchema.parse({ sort: "rating", pageSize: 6 })),
  ]);

  return (
    <div className="pb-4">
      {/* 1. Rolling banners */}
      <div className="px-4 pt-8 sm:px-6 sm:pt-12">
        <BannerCarousel banners={banners} />
      </div>

      {/* 2. Wide search */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <HomeSearch />
      </section>

      {/* 3. Highest rated this week */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-ink-faint">Right now</p>
            <h2 className="display mt-2 text-3xl">Highest rated this week</h2>
          </div>
          <Link
            href="/restaurants"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-cobalt hover:gap-2"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6">
          <RestaurantList
            restaurants={topRestaurants}
            emptyMessage="No restaurants yet. Add entries to src/data/restaurants.json."
          />
        </div>
      </section>
    </div>
  );
}
