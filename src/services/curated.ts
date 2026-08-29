import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { LOCAL_CURATED_LISTS } from "@/data/schema";
import type { CuratedList, CuratedListDetail, NearestStation } from "@/types";

/** 큐레이션 컬렉션 목록 */
export async function getCuratedLists(): Promise<CuratedList[]> {
  if (!isDatabaseConfigured) {
    return LOCAL_CURATED_LISTS.map(
      ({ items, ...rest }): CuratedList => ({ ...rest, itemCount: items.length }),
    );
  }

  const rows = await prisma.curatedList.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    theme: row.theme,
    itemCount: row._count.items,
    createdAt: row.createdAt.toISOString(),
  }));
}

/** 큐레이션 상세 (맛집 항목 포함) */
export async function getCuratedListBySlug(slug: string): Promise<CuratedListDetail | null> {
  if (!isDatabaseConfigured) {
    return LOCAL_CURATED_LISTS.find((list) => list.slug === slug) ?? null;
  }

  const row = await prisma.curatedList.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { restaurant: true },
      },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    theme: row.theme,
    itemCount: row.items.length,
    createdAt: row.createdAt.toISOString(),
    items: row.items.map((item) => ({
      id: item.id,
      order: item.order,
      comment: item.comment,
      restaurant: {
        ...item.restaurant,
        openingHours: (item.restaurant.openingHours as Record<string, string> | null) ?? null,
        nearestStation: (item.restaurant.nearestStation as NearestStation | null) ?? null,
        createdAt: item.restaurant.createdAt.toISOString(),
        updatedAt: item.restaurant.updatedAt.toISOString(),
      },
    })),
  };
}

export async function getAllCuratedSlugs(): Promise<string[]> {
  if (!isDatabaseConfigured) return LOCAL_CURATED_LISTS.map((l) => l.slug);
  const rows = await prisma.curatedList.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
