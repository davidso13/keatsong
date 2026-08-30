"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/banners", label: "Home banners" },
  { href: "/admin/restaurants", label: "Restaurants" },
  { href: "/admin/things-to-do", label: "Things to do" },
  { href: "/admin/places", label: "Places" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const active =
          tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-night text-white"
                : "bg-ink/[0.06] text-ink-soft hover:bg-ink/[0.1]",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
