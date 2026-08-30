import type { Metadata } from "next";
import { ContentCard } from "@/components/content/ContentCard";
import { getActivities } from "@/services/things-to-do";

export const metadata: Metadata = {
  title: "Things to do",
  description: "Festivals, workshops and experiences worth planning a trip around.",
};

export const dynamic = "force-dynamic";

export default async function ThingsToDoPage() {
  const activities = await getActivities();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Experiences</p>
      <h1 className="display mt-2 text-4xl">Things to do</h1>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Festivals, hands-on workshops and guided tours across Korea — with dates, prices and
        where to go.
      </p>

      {activities.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink-faint">
          Nothing listed yet. Add entries to{" "}
          <code className="font-mono text-ink-soft">src/data/things-to-do.json</code>.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ContentCard
              key={activity.id}
              href={`/things-to-do/${activity.id}`}
              title={activity.name}
              description={activity.description}
              category={activity.category}
              region={activity.region}
              thumbnail={activity.thumbnail}
              meta={activity.schedule || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
