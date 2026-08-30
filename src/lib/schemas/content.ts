import { z } from "zod";

/**
 * An image reference: an absolute URL (external host — must be registered in
 * next.config.ts `images.remotePatterns`) or a site-root-relative path served
 * from `public/`, e.g. "/images/banner-1.jpg".
 */
const imageRef = z.union([z.string().url(), z.string().startsWith("/")]);

/** A landing target: an internal path ("/restaurants") or an absolute URL. */
const linkRef = z.union([z.string().url(), z.string().startsWith("/")]);

/* ------------------------------------------------------------------ *
 *  Home rolling banners
 * ------------------------------------------------------------------ */

export const bannerSchema = z.object({
  image: imageRef,
  href: linkRef,
  title: z.string().trim().min(1, "Banner title is required."),
  subtitle: z.string().trim().max(160).nullish(),
});

/** The full banner set — exactly 5 slides. */
export const bannersSchema = z.array(bannerSchema).length(5, "Provide exactly 5 banners.");

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
