import { z } from "zod";
import { bannerSchema } from "@/lib/schemas/content";
import type { Activity, Banner, Place } from "@/types";

import bannersJson from "./banners.json";
import thingsToDoJson from "./things-to-do.json";
import placesJson from "./places.json";

/* ------------------------------------------------------------------ *
 *  입력(JSON) 스키마 — src/data/*.json 에 사람이 직접 작성하는 형식
 * ------------------------------------------------------------------ */

const DEFAULT_CREATED_AT = "2026-01-01T00:00:00.000Z";

const imageRef = z.union([z.string().url(), z.string().startsWith("/")]);

export const activityInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  category: z.string().min(1),
  region: z.string().min(1),
  schedule: z.string().default(""),
  price: z.string().nullish(),
  thumbnail: imageRef.nullish(),
  images: z.array(imageRef).default([]),
  link: z.string().url().nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  createdAt: z.string().datetime().default(DEFAULT_CREATED_AT),
});

export const placeInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  category: z.string().min(1),
  region: z.string().min(1),
  address: z.string().nullish(),
  bestTime: z.string().nullish(),
  thumbnail: imageRef.nullish(),
  images: z.array(imageRef).default([]),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  createdAt: z.string().datetime().default(DEFAULT_CREATED_AT),
});

/* ------------------------------------------------------------------ *
 *  로드 + 검증 + 정규화
 * ------------------------------------------------------------------ */

function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`[src/data/${file}] invalid data format:\n${issues}`);
  }
  return result.data;
}

export const LOCAL_BANNERS: Banner[] = parseOrThrow(
  z.array(bannerSchema),
  bannersJson,
  "banners.json",
).map((b) => ({
  image: b.image,
  href: b.href,
  title: b.title,
  subtitle: b.subtitle ?? null,
}));

export const LOCAL_ACTIVITIES: Activity[] = parseOrThrow(
  z.array(activityInputSchema),
  thingsToDoJson,
  "things-to-do.json",
).map((a) => ({
  id: a.id,
  name: a.name,
  description: a.description,
  category: a.category,
  region: a.region,
  schedule: a.schedule,
  price: a.price ?? null,
  thumbnail: a.thumbnail ?? null,
  images: a.images,
  link: a.link ?? null,
  latitude: a.latitude ?? null,
  longitude: a.longitude ?? null,
  createdAt: a.createdAt,
}));

export const LOCAL_PLACES: Place[] = parseOrThrow(
  z.array(placeInputSchema),
  placesJson,
  "places.json",
).map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  category: p.category,
  region: p.region,
  address: p.address ?? null,
  bestTime: p.bestTime ?? null,
  thumbnail: p.thumbnail ?? null,
  images: p.images,
  latitude: p.latitude ?? null,
  longitude: p.longitude ?? null,
  createdAt: p.createdAt,
}));
