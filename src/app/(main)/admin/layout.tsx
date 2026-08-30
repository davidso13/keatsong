import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · KeatSong" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Admin</p>
      <h1 className="display mt-2 text-4xl">Content admin</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Add entries here and they appear on the site immediately.
      </p>
      <div className="mt-6">
        <AdminNav />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
