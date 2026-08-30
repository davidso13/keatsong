import type { Metadata } from "next";
import { BannerAdminForm } from "@/components/admin/BannerAdminForm";
import { getBanners } from "@/services/banners";

export const metadata: Metadata = { title: "Home banners" };

export const dynamic = "force-dynamic";

export default async function BannerAdminPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Home rolling banners</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Attach an image and a landing URL for each slide. Reorder with the arrows, remove
          with the trash icon, then save.
        </p>
      </div>
      <BannerAdminForm initial={banners} />
    </div>
  );
}
