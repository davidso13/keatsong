import type { Metadata } from "next";
import { ActivityForm } from "@/components/admin/ActivityForm";
import { DeletableList } from "@/components/admin/DeletableList";
import { getActivities } from "@/services/things-to-do";

export const metadata: Metadata = { title: "Things to do" };

export const dynamic = "force-dynamic";

export default async function AdminThingsToDoPage() {
  const activities = await getActivities();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-semibold text-ink">Add an activity</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Registered items appear on <code className="font-mono">/things-to-do</code>.
        </p>
        <div className="mt-4">
          <ActivityForm />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink">
          Existing <span className="text-ink-faint">{activities.length}</span>
        </h2>
        <div className="mt-4">
          <DeletableList
            endpoint="/api/admin/things-to-do"
            emptyMessage="Nothing yet."
            rows={activities.map((a) => ({
              id: a.id,
              title: a.name,
              subtitle: `${a.category} · ${a.region}`,
              href: `/things-to-do/${a.id}`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
