import type { Metadata } from "next";
import { RestaurantForm } from "@/components/admin/RestaurantForm";
import { DeletableList } from "@/components/admin/DeletableList";
import { getRestaurantAdminRows } from "@/services/restaurants";
import { FOOD_CATEGORY_LABEL } from "@/lib/constants";

export const metadata: Metadata = { title: "Restaurants" };

export const dynamic = "force-dynamic";

export default async function AdminRestaurantsPage() {
  const rows = await getRestaurantAdminRows();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-semibold text-ink">Add a restaurant</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Registered restaurants appear on <code className="font-mono">/restaurants</code> and,
          when highly rated, on the home page.
        </p>
        <div className="mt-4">
          <RestaurantForm />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink">
          Existing <span className="text-ink-faint">{rows.length}</span>
        </h2>
        <div className="mt-4">
          <DeletableList
            endpoint="/api/admin/restaurants"
            emptyMessage="No restaurants yet."
            rows={rows.map((r) => ({
              id: r.id,
              title: r.name,
              subtitle: `${FOOD_CATEGORY_LABEL[r.category]} · ${r.region}`,
              href: `/restaurants/${r.id}`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
