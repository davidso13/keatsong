import type { FoodCategory, PriceRange, Coordinates } from "@/types";

/** Fallback coordinates when the user's location is unavailable (Gangnam Stn, Seoul). */
export const DEFAULT_LOCATION: Coordinates = {
  latitude: 37.497942,
  longitude: 127.027621,
};

export const FOOD_CATEGORY_LABEL: Record<FoodCategory, string> = {
  KOREAN: "Korean",
  JAPANESE: "Japanese",
  CHINESE: "Chinese",
  WESTERN: "Western",
  ASIAN: "Asian",
  CAFE: "Cafe",
  BAR: "Bar",
  DESSERT: "Dessert",
  ETC: "Other",
};

/** Per-person price bands, in USD. */
export const PRICE_RANGE_LABEL: Record<PriceRange, string> = {
  UNDER_10: "Under $10",
  USD_10_20: "$10–20",
  USD_20_30: "$20–30",
  USD_30_50: "$30–50",
  USD_50_70: "$50–70",
  USD_70_100: "$70–100",
  OVER_100: "$100+",
};

export const FOOD_CATEGORIES = Object.keys(FOOD_CATEGORY_LABEL) as FoodCategory[];
export const PRICE_RANGES = Object.keys(PRICE_RANGE_LABEL) as PriceRange[];

/** Search input debounce (ms) — CLAUDE.md §5 */
export const SEARCH_DEBOUNCE_MS = 300;

export const DEFAULT_PAGE_SIZE = 12;
