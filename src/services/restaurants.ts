import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { getLocalReviews, LOCAL_RESTAURANTS } from "@/data/schema";
import { getDistanceInMeters } from "@/utils/geo";
import type { RestaurantQuery } from "@/lib/schemas/restaurant";
import type {
  Coordinates,
  NearestStation,
  Paginated,
  Restaurant,
  RestaurantWithReviews,
} from "@/types";

function withDistance(list: Restaurant[], origin?: Coordinates) {
  if (!origin) return list.map((r) => ({ ...r, distance: null as number | null }));
  return list.map((r) => ({
    ...r,
    distance: getDistanceInMeters(origin, { latitude: r.latitude, longitude: r.longitude }),
  }));
}

function filterLocal(query: RestaurantQuery) {
  const keyword = query.q?.toLowerCase();
  return LOCAL_RESTAURANTS.filter((r) => {
    if (keyword && !`${r.name}${r.description}${r.region}`.toLowerCase().includes(keyword)) {
      return false;
    }
    if (query.category && r.category !== query.category) return false;
    if (query.price && r.priceRange !== query.price) return false;
    if (query.region && !r.region.includes(query.region)) return false;
    if (query.parking !== undefined && r.hasParking !== query.parking) return false;
    if (query.breakTime !== undefined && r.hasBreakTime !== query.breakTime) return false;
    return true;
  });
}

/** 맛집 목록 조회 (필터 + 정렬 + 페이지네이션) */
export async function getRestaurants(
  query: RestaurantQuery,
): Promise<Paginated<RestaurantWithDistance>> {
  const origin =
    query.lat !== undefined && query.lng !== undefined
      ? { latitude: query.lat, longitude: query.lng }
      : undefined;

  if (!isDatabaseConfigured) {
    let items = withDistance(filterLocal(query), origin);
    items = sortRestaurants(items, query.sort);

    const total = items.length;
    const start = (query.page - 1) * query.pageSize;
    const paged = items.slice(start, start + query.pageSize);

    return {
      items: paged,
      page: query.page,
      pageSize: query.pageSize,
      total,
      hasNext: start + query.pageSize < total,
    };
  }

  // --- DB 경로 ---
  const where = {
    ...(query.q && {
      OR: [
        { name: { contains: query.q, mode: "insensitive" as const } },
        { description: { contains: query.q, mode: "insensitive" as const } },
      ],
    }),
    ...(query.category && { category: query.category }),
    ...(query.price && { priceRange: query.price }),
    ...(query.region && { region: { contains: query.region } }),
    ...(query.parking !== undefined && { hasParking: query.parking }),
    ...(query.breakTime !== undefined && { hasBreakTime: query.breakTime }),
  };

  const [rows, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      orderBy: query.sort === "latest" ? { createdAt: "desc" } : { ratingAvg: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.restaurant.count({ where }),
  ]);

  const items = sortRestaurants(withDistance(rows.map(serializeRestaurant), origin), query.sort);

  return {
    items,
    page: query.page,
    pageSize: query.pageSize,
    total,
    hasNext: query.page * query.pageSize < total,
  };
}

type RestaurantWithDistance = Restaurant & { distance: number | null };

function sortRestaurants(items: RestaurantWithDistance[], sort: RestaurantQuery["sort"]) {
  const copy = [...items];
  if (sort === "distance") {
    copy.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  } else if (sort === "latest") {
    copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } else {
    copy.sort((a, b) => b.ratingAvg - a.ratingAvg);
  }
  return copy;
}

/** 맛집 상세 조회 (리뷰 포함) */
export async function getRestaurantById(
  id: string,
  origin?: Coordinates,
): Promise<RestaurantWithReviews | null> {
  if (!isDatabaseConfigured) {
    const found = LOCAL_RESTAURANTS.find((r) => r.id === id);
    if (!found) return null;
    return {
      ...found,
      reviews: getLocalReviews(id),
      distance: origin
        ? getDistanceInMeters(origin, { latitude: found.latitude, longitude: found.longitude })
        : null,
    };
  }

  const row = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!row) return null;

  return {
    ...serializeRestaurant(row),
    reviews: row.reviews.map((rev) => ({
      id: rev.id,
      rating: rev.rating,
      content: rev.content,
      images: rev.images,
      restaurantId: rev.restaurantId,
      author: rev.author,
      createdAt: rev.createdAt.toISOString(),
    })),
    distance: origin
      ? getDistanceInMeters(origin, { latitude: row.latitude, longitude: row.longitude })
      : null,
  };
}

/** 전체 맛집 id 목록 (generateStaticParams 용) */
export async function getAllRestaurantIds(): Promise<string[]> {
  if (!isDatabaseConfigured) return LOCAL_RESTAURANTS.map((r) => r.id);
  const rows = await prisma.restaurant.findMany({ select: { id: true } });
  return rows.map((r) => r.id);
}

// Prisma Row → 직렬화된 도메인 타입
function serializeRestaurant(row: {
  id: string;
  name: string;
  description: string;
  category: Restaurant["category"];
  priceRange: Restaurant["priceRange"];
  address: string;
  region: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  thumbnail: string | null;
  images: string[];
  hasParking: boolean;
  hasBreakTime: boolean;
  openingHours: unknown;
  nearestStation: unknown;
  ratingAvg: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}): Restaurant {
  return {
    ...row,
    openingHours: (row.openingHours as Record<string, string> | null) ?? null,
    nearestStation: (row.nearestStation as NearestStation | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export type { RestaurantWithDistance };
