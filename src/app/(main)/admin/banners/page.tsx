import type { Metadata } from "next";
import { BannerAdminForm } from "@/components/admin/BannerAdminForm";
import { getBanners } from "@/services/banners";

export const metadata: Metadata = {
  title: "Banner admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BannerAdminPage() {
  const banners = await getBanners();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Admin</p>
      <h1 className="display mt-2 text-4xl">Home banners</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Edit the five home-page rolling banners. Saving writes{" "}
        <code className="font-mono text-ink-soft">src/data/banners.json</code> — the single
        source of truth. Commit that file to publish the change.
      </p>

      <div className="mt-8">
        <BannerAdminForm initial={banners} />
      </div>
    </div>
  );
}
