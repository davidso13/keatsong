import { PRICE_RANGE_LABEL } from "@/lib/constants";
import type { NearestStation, PriceRange } from "@/types";

/** Price band label */
export function formatPriceRange(range: PriceRange): string {
  return PRICE_RANGE_LABEL[range];
}

/** Distance in metres → human string */
export function formatDistance(meters: number | null | undefined): string {
  if (meters == null) return "";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** Rating → one decimal place */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Nearest station → e.g. "Line 2 Gangnam · Exit 5 · 5 min walk" */
export function formatNearestStation(station: NearestStation | null): string {
  if (!station) return "";
  const head = [station.line, station.name].filter(Boolean).join(" ");
  const parts = [head];
  if (station.exit) parts.push(station.exit);
  if (station.walkMinutes != null) parts.push(`${station.walkMinutes} min walk`);
  return parts.join(" · ");
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** ISO string / Date → "August 29, 2026" */
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

/** Relative time ("3 days ago") */
export function formatRelativeTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffSec) >= secondsInUnit) {
      return rtf.format(-Math.round(diffSec / secondsInUnit), unit);
    }
  }
  return rtf.format(0, "second");
}
