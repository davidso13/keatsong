import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, MapPin, Sparkles, Star, Utensils } from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { RestaurantList } from "@/components/restaurant/RestaurantList";
import { getRestaurants } from "@/services/restaurants";
import { getCuratedLists } from "@/services/curated";
import { restaurantQuerySchema } from "@/lib/schemas/restaurant";

const VALUE_PROPS = [
  {
    icon: MapPin,
    label: "Location aware",
    title: "A map that knows where you stand",
    body: "Sort by walking distance from wherever you are. No pins to drop, no address to type.",
  },
  {
    icon: Compass,
    label: "Curated",
    title: "Lists built around a moment",
    body: "Late-night eats, rainy-day comfort food, first meal off the plane — themed collections, not endless scrolls.",
  },
  {
    icon: Star,
    label: "Honest signal",
    title: "Ratings that travelers actually trust",
    body: "Every place is scored on food, not on how many coupons it handed out.",
  },
];

export default async function HomePage() {
  const [{ items: topRestaurants }, curatedLists] = await Promise.all([
    getRestaurants(restaurantQuerySchema.parse({ sort: "rating", pageSize: 6 })),
    getCuratedLists(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <p className="eyebrow flex items-center gap-2 text-cobalt">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Seoul dining, decoded
        </p>
        <h1 className="display mt-5 max-w-3xl text-[2.75rem] sm:text-6xl">
          Every great meal, on the map.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          KeatSong helps travelers find Korea&apos;s best restaurants — curated collections,
          honest ratings, and a map that actually knows where you are.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/restaurants" className={buttonVariants({ size: "lg" })}>
            <MapPin className="h-4 w-4" aria-hidden />
            Explore restaurants
          </Link>
          <Link
            href="/curated"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Compass className="h-4 w-4" aria-hidden />
            Browse collections
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden bg-line sm:grid-cols-3">
          {VALUE_PROPS.map(({ icon: Icon, label, title, body }) => (
            <div key={label} className="bg-surface p-6 sm:p-8">
              <Icon className="h-5 w-5 text-cobalt" aria-hidden />
              <p className="eyebrow mt-4 text-ink-faint">{label}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark feature */}
      <section className="section-night">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div>
            <p className="eyebrow text-white/50">Why KeatSong</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              Skip the tourist traps.
            </h2>
            <p className="mt-5 max-w-md text-white/70">
              The best restaurants in Korea rarely have English menus or a spot on the
              first page of a search. KeatSong surfaces the places locals actually queue
              for, with just enough context to order confidently.
            </p>
            <Link
              href="/restaurants"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white hover:gap-3"
            >
              Start exploring <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ul className="grid gap-3 self-center">
            {[
              "Filter by cuisine, price in USD, parking and break times",
              "See the nearest subway station and walk time for every place",
              "Save collections for each neighbourhood you visit",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 rounded-2xl border border-night-line bg-night-soft p-4 text-sm text-white/80"
              >
                <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-20 sm:px-6">
        {/* Curated highlights */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-faint">Collections</p>
              <h2 className="display mt-2 text-3xl">Curated for the moment</h2>
            </div>
            <Link
              href="/curated"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-cobalt hover:gap-2"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {curatedLists.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink-faint">
              No collections published yet. Add entries to{" "}
              <code className="font-mono text-ink-soft">src/data/curated.json</code>.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {curatedLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/curated/${list.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-line"
                >
                  <div className="relative aspect-[16/10] bg-ink/[0.04]">
                    {list.coverImage && (
                      <Image
                        src={list.coverImage}
                        alt={list.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                    <div className="absolute bottom-0 p-4 text-white">
                      <p className="eyebrow text-white/70">{list.theme}</p>
                      <h3 className="mt-1 font-display font-semibold">{list.title}</h3>
                      <p className="mt-1 text-xs text-white/70">
                        {list.itemCount} {list.itemCount === 1 ? "place" : "places"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Top rated */}
        <section>
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
    </div>
  );
}
