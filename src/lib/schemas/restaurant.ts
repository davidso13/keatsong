import { z } from "zod";

export const FOOD_CATEGORY_VALUES = [
  "KOREAN",
  "JAPANESE",
  "CHINESE",
  "WESTERN",
  "ASIAN",
  "CAFE",
  "BAR",
  "DESSERT",
  "ETC",
] as const;

export const PRICE_RANGE_VALUES = [
  "UNDER_10",
  "USD_10_20",
  "USD_20_30",
  "USD_30_50",
  "USD_50_70",
  "USD_70_100",
  "OVER_100",
] as const;

/** GET /api/restaurants 쿼리 파라미터 */
export const restaurantQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum(FOOD_CATEGORY_VALUES).optional(),
  price: z.enum(PRICE_RANGE_VALUES).optional(),
  region: z.string().trim().max(60).optional(),
  parking: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  breakTime: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  sort: z.enum(["rating", "distance", "latest"]).default("rating"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export type RestaurantQuery = z.infer<typeof restaurantQuerySchema>;

/** POST /api/reviews body */
export const createReviewSchema = z.object({
  restaurantId: z.string().min(1),
  rating: z.number().int().min(1, "Rating must be at least 1 star.").max(5),
  content: z.string().trim().min(5, "Reviews must be at least 5 characters.").max(2000),
  images: z.array(z.string().url()).max(5).default([]),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
