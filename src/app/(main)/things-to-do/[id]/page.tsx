import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui";
import { MapView } from "@/components/restaurant/MapView";
import { getActivityById, getAllActivityIds } from "@/services/things-to-do";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getAllActivityIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity) return { title: "Not found" };
  return { title: activity.name, description: activity.description };
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/things-to-do"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Things to do
      </Link>

      {activity.thumbnail && (
        <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ink/[0.04]">
          <Image
            src={activity.thumbnail}
            alt={activity.name}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mt-7">
        <Badge variant="accent">{activity.category}</Badge>
        <h1 className="display mt-4 text-4xl">{activity.name}</h1>
        <p className="mt-4 text-ink-soft">{activity.description}</p>
      </header>

      <dl className="mt-7 space-y-2 rounded-2xl border border-line bg-surface p-5 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-ink-faint" aria-hidden />
          <dd>{activity.region}</dd>
        </div>
        {activity.schedule && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-ink-faint" aria-hidden />
            <dd>{activity.schedule}</dd>
          </div>
        )}
        {activity.price && (
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-ink-faint" aria-hidden />
            <dd>{activity.price}</dd>
          </div>
        )}
        {activity.link && (
          <div className="flex items-center gap-2 pt-1">
            <ExternalLink className="h-4 w-4 text-ink-faint" aria-hidden />
            <a
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cobalt hover:underline"
            >
              Official page
            </a>
          </div>
        )}
      </dl>

      {activity.latitude != null && activity.longitude != null && (
        <section className="mt-9">
          <h2 className="mb-3 font-display text-lg font-semibold">Location</h2>
          <MapView
            center={{ latitude: activity.latitude, longitude: activity.longitude }}
            markers={[
              {
                id: activity.id,
                latitude: activity.latitude,
                longitude: activity.longitude,
                label: activity.name,
              },
            ]}
            level={4}
          />
        </section>
      )}
    </article>
  );
}
