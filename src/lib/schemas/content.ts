import { z } from "zod";
import { FOOD_CATEGORY_VALUES, PRICE_RANGE_VALUES } from "@/lib/schemas/restaurant";

/**
 * An image reference: an absolute URL (external host — must be registered in
 * next.config.ts `images.remotePatterns`) or a site-root-relative path served
 * from `public/`, e.g. "/images/banner-1.jpg".
 */
const imageRef = z.union([z.string().url(), z.string().startsWith("/")]);

/** A landing target: an internal path ("/restaurants") or an absolute URL. */
const linkRef = z.union([z.string().url(), z.string().startsWith("/")]);

/** Optional string field that treats "" as absent. */
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

/** Optional latitude / longitude coming from a text input. */
const optionalLat = z
  .union([z.string(), z.number(), z.null()])
  .transform((v) => (v === "" || v === null || v === undefined ? null : Number(v)))
  .refine((v) => v === null || (Number.isFinite(v) && v >= -90 && v <= 90), "Latitude must be between -90 and 90.");
const optionalLng = z
  .union([z.string(), z.number(), z.null()])
  .transform((v) => (v === "" || v === null || v === undefined ? null : Number(v)))
  .refine((v) => v === null || (Number.isFinite(v) && v >= -180 && v <= 180), "Longitude must be between -180 and 180.");

/** Optional image reference that treats "" as absent. */
const optionalImageRef = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine(
    (v) => v === null || imageRef.safeParse(v).success,
    "Image must be an absolute URL or a /public path.",
  );

/* ------------------------------------------------------------------ *
 *  Home rolling banners
 * ------------------------------------------------------------------ */

export const bannerSchema = z.object({
  image: imageRef,
  href: linkRef,
  title: z.string().trim().min(1, "Banner title is required."),
  subtitle: z.string().trim().max(160).nullish(),
});

/** The full banner set — 1 to 10 slides. */
export const bannersSchema = z
  .array(bannerSchema)
  .min(1, "Add at least one banner.")
  .max(10, "Up to 10 banners.");

export type BannerInput = z.input<typeof bannerSchema>;

/* ------------------------------------------------------------------ *
 *  Share moments — post & comment creation
 * ------------------------------------------------------------------ */

export const createPostSchema = z.object({
  nickname: z.string().trim().min(1, "Enter a nickname.").max(40),
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(120),
  body: z.string().trim().min(5, "Write at least 5 characters.").max(5000),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createCommentSchema = z.object({
  nickname: z.string().trim().min(1, "Enter a nickname.").max(40),
  body: z.string().trim().min(1, "Comment cannot be empty.").max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/* ------------------------------------------------------------------ *
 *  Admin — create Restaurant / Activity / Place
 *  Inputs arrive from HTML forms (strings), so numbers are coerced and
 *  a comma/newline-separated string is accepted for the image gallery.
 * ------------------------------------------------------------------ */

const imageGallery = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => (Array.isArray(v) ? v : v.split(/[\n,]/)))
  .transform((list) => list.map((s) => s.trim()).filter(Boolean))
  .pipe(z.array(imageRef).max(12));

export const restaurantFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  category: z.enum(FOOD_CATEGORY_VALUES),
  priceRange: z.enum(PRICE_RANGE_VALUES),
  address: z.string().trim().min(1, "Address is required.").max(200),
  region: z.string().trim().min(1, "Region is required.").max(80),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  phone: optionalText,
  thumbnail: optionalImageRef,
  images: imageGallery.default([]),
  hasParking: z.boolean().default(false),
  hasBreakTime: z.boolean().default(false),
});

export type RestaurantFormInput = z.input<typeof restaurantFormSchema>;
export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

export const activityFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  category: z.string().trim().min(1, "Category is required.").max(40),
  region: z.string().trim().min(1, "Region is required.").max(80),
  schedule: z.string().trim().max(120).default(""),
  price: optionalText,
  thumbnail: optionalImageRef,
  images: imageGallery.default([]),
  link: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine((v) => v === null || z.string().url().safeParse(v).success, "Link must be a URL."),
  latitude: optionalLat,
  longitude: optionalLng,
});

export type ActivityFormInput = z.input<typeof activityFormSchema>;
export type ActivityFormValues = z.infer<typeof activityFormSchema>;

export const placeFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  category: z.string().trim().min(1, "Category is required.").max(40),
  region: z.string().trim().min(1, "Region is required.").max(80),
  address: optionalText,
  bestTime: optionalText,
  thumbnail: optionalImageRef,
  images: imageGallery.default([]),
  latitude: optionalLat,
  longitude: optionalLng,
});

export type PlaceFormInput = z.input<typeof placeFormSchema>;
export type PlaceFormValues = z.infer<typeof placeFormSchema>;
