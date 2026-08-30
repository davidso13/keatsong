import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/prisma";
import { getRestaurantAdminRows } from "@/services/restaurants";
import { getActivities } from "@/services/things-to-do";
import { getPlaces } from "@/services/places";
import { getBanners } from "@/services/banners";

export const dynamic = "force-dynamic";

const SECTIONS = [
  { href: "/admin/banners", label: "Home banners", blurb: "Image + landing URL per slide" },
  { href: "/admin/restaurants", label: "Restaurants", blurb: "Add a restaurant to the directory" },
  { href: "/admin/things-to-do", label: "Things to do", blurb: "Festivals, workshops, tours" },
  { href: "/admin/places", label: "Places", blurb: "Landmarks, parks, museums" },
];

export default async function AdminOverviewPage() {
  const [restaurants, activities, places, banners] = await Promise.all([
    getRestaurantAdminRows(),
    getActivities(),
    getPlaces(),
    getBanners(),
  ]);

  const counts: Record<string, number> = {
    "/admin/banners": banners.length,
    "/admin/restaurants": restaurants.length,
    "/admin/things-to-do": activities.length,
    "/admin/places": places.length,
  };

  return (
    <div className="space-y-6">
      <div
        className={
          isDatabaseConfigured
            ? "rounded-xl border border-cobalt/20 bg-cobalt/[0.06] p-4 text-sm text-ink-soft"
            : "rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-ink-soft"
        }
      >
        {isDatabaseConfigured ? (
          <>Storage: <strong>database</strong>. Changes persist and are shared across visitors.</>
        ) : (
          <>
            Storage: <strong>local JSON files</strong> (no <code className="font-mono">DATABASE_URL</code>).
            Adds work when running locally and get written to{" "}
            <code className="font-mono">src/data/*.json</code>; on the read-only deployment they
            are rejected — connect a database to enable writes in production.
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/25"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink">{s.label}</h2>
              <span className="text-xs text-ink-faint">{counts[s.href]} entries</span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{s.blurb}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cobalt group-hover:gap-2">
              Manage <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
