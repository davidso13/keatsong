"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Badge, Input } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FOOD_CATEGORIES,
  FOOD_CATEGORY_LABEL,
  PRICE_RANGES,
  PRICE_RANGE_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Restaurant filter bar.
 * State lives in the URL query string so the server component can read it.
 * The search box is debounced by 300ms. — CLAUDE.md §5
 */
export function RestaurantFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const debouncedKeyword = useDebounce(keyword);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    if ((searchParams.get("q") ?? "") !== debouncedKeyword) {
      updateParam("q", debouncedKeyword || null);
    }
  }, [debouncedKeyword, searchParams, updateParam]);

  const activeCategory = searchParams.get("category");
  const activePrice = searchParams.get("price");
  const parkingOnly = searchParams.get("parking") === "true";
  const breakTimeOnly = searchParams.get("breakTime") === "true";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name, area or dish"
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FOOD_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => updateParam("category", activeCategory === category ? null : category)}
          >
            <Badge
              variant={activeCategory === category ? "accent" : "outline"}
              className={cn(
                "cursor-pointer",
                activeCategory === category && "ring-1 ring-cobalt/40",
              )}
            >
              {FOOD_CATEGORY_LABEL[category]}
            </Badge>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRICE_RANGES.map((price) => (
          <button
            key={price}
            type="button"
            onClick={() => updateParam("price", activePrice === price ? null : price)}
          >
            <Badge
              variant={activePrice === price ? "accent" : "outline"}
              className="cursor-pointer"
            >
              {PRICE_RANGE_LABEL[price]}
            </Badge>
          </button>
        ))}

        <span className="mx-1 h-4 w-px bg-ink/15" />

        <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={parkingOnly}
            onChange={(e) => updateParam("parking", e.target.checked ? "true" : null)}
            className="accent-cobalt"
          />
          Parking
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={breakTimeOnly}
            onChange={(e) => updateParam("breakTime", e.target.checked ? "true" : null)}
            className="accent-cobalt"
          />
          Has break time
        </label>
      </div>
    </div>
  );
}
