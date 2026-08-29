import { z } from "zod";
import {
  FOOD_CATEGORY_VALUES,
  PRICE_RANGE_VALUES,
} from "@/lib/schemas/restaurant";
import type {
  CuratedListDetail,
  Restaurant,
  Review,
} from "@/types";

import restaurantsJson from "./restaurants.json";
import reviewsJson from "./reviews.json";
import curatedJson from "./curated.json";

/* ------------------------------------------------------------------ *
 *  1. 입력(JSON) 스키마 정의
 *  - src/data/*.json 파일에 사람이 직접 작성하는 형식입니다.
 *  - 필수가 아닌 값은 생략 가능하며 아래 default 값이 채워집니다.
 * ------------------------------------------------------------------ */

const DEFAULT_CREATED_AT = "2025-01-01T00:00:00.000Z";

/**
 * An image reference: either an absolute URL (external host — must be registered in
 * next.config.ts `images.remotePatterns`) or a site-root-relative path served from
 * `public/`, e.g. "/images/001_부대옥.jpg".
 */
const imageRef = z.union([z.string().url(), z.string().startsWith("/")]);

export const restaurantInputSchema = z.object({
  /** 고유 식별자. 영문/숫자/하이픈 권장. URL 에 그대로 쓰입니다: /restaurants/<id> */
  id: z.string().min(1),
  /** 가게 이름 */
  name: z.string().min(1),
  /** 한 줄 소개 (상세 페이지·카드에 노출) */
  description: z.string().default(""),
  /** 음식 카테고리 */
  category: z.enum(FOOD_CATEGORY_VALUES),
  /** 가격대 */
  priceRange: z.enum(PRICE_RANGE_VALUES),
  /** 전체 주소 (도로명 or 지번) */
  address: z.string().min(1),
  /** 필터/표시에 쓰는 행정구역 문자열. 예: "서울 강남구 역삼동" */
  region: z.string().min(1),
  /** 위도 (WGS84) */
  latitude: z.number().min(-90).max(90),
  /** 경도 (WGS84) */
  longitude: z.number().min(-180).max(180),
  /** 전화번호 (선택) */
  phone: z.string().nullish(),
  /** 대표 이미지 (선택). 절대 URL 또는 public/ 기준 경로("/images/foo.jpg") */
  thumbnail: imageRef.nullish(),
  /** 추가 이미지 목록 (선택). 절대 URL 또는 public/ 기준 경로 */
  images: z.array(imageRef).default([]),
  /** 주차 가능 여부 */
  hasParking: z.boolean().default(false),
  /** 브레이크타임 존재 여부 */
  hasBreakTime: z.boolean().default(false),
  /** 영업시간 (선택). 자유 형식 key-value. 예: { "평일": "11:00-22:00", "주말": "휴무" } */
  openingHours: z.record(z.string(), z.string()).nullish(),
  /** 근처 지하철역 (선택). 예: { "name": "강남역", "line": "2호선", "exit": "5번 출구", "walkMinutes": 5 } */
  nearestStation: z
    .object({
      name: z.string().min(1),
      line: z.string().nullish(),
      exit: z.string().nullish(),
      walkMinutes: z.number().int().min(0).nullish(),
    })
    .nullish(),
  /** 평균 평점 0~5 (선택, 기본 0). 리뷰 기능 연동 전까지 수동 입력용 */
  ratingAvg: z.number().min(0).max(5).default(0),
  /** 평점 개수 (선택, 기본 0) */
  ratingCount: z.number().int().min(0).default(0),
  /** 등록일 ISO 문자열 (선택). "최신순" 정렬 기준 */
  createdAt: z.string().datetime().default(DEFAULT_CREATED_AT),
});

export type RestaurantInput = z.input<typeof restaurantInputSchema>;

export const reviewInputSchema = z.object({
  id: z.string().min(1),
  /** 어느 맛집의 리뷰인지 — restaurants.json 의 id 와 일치해야 함 */
  restaurantId: z.string().min(1),
  /** 1~5 정수 */
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
  images: z.array(z.string().url()).default([]),
  authorName: z.string().default("익명"),
  createdAt: z.string().datetime().default(DEFAULT_CREATED_AT),
});

export type ReviewInput = z.input<typeof reviewInputSchema>;

export const curatedInputSchema = z.object({
  id: z.string().min(1),
  /** URL 에 쓰이는 슬러그: /curated/<slug> */
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  /** 테마 라벨. 예: "비 오는 날", "혼밥" */
  theme: z.string().min(1),
  coverImage: z.string().url().nullish(),
  createdAt: z.string().datetime().default(DEFAULT_CREATED_AT),
  /** 이 컬렉션에 담긴 맛집들. restaurantId 는 restaurants.json 의 id 와 일치해야 함 */
  items: z
    .array(
      z.object({
        restaurantId: z.string().min(1),
        /** 한 줄 코멘트 (선택) */
        comment: z.string().nullish(),
      }),
    )
    .default([]),
});

export type CuratedInput = z.input<typeof curatedInputSchema>;

/* ------------------------------------------------------------------ *
 *  2. 로드 + 검증 + 정규화
 *  - 앱이 켜질 때 한 번 실행됩니다. 형식이 틀리면 여기서 에러가 납니다.
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

const restaurantInputs = parseOrThrow(
  z.array(restaurantInputSchema),
  restaurantsJson,
  "restaurants.json",
);
const reviewInputs = parseOrThrow(z.array(reviewInputSchema), reviewsJson, "reviews.json");
const curatedInputs = parseOrThrow(z.array(curatedInputSchema), curatedJson, "curated.json");

/** 정규화된 맛집 목록 (앱 전역에서 사용) */
export const LOCAL_RESTAURANTS: Restaurant[] = restaurantInputs.map((r) => ({
  id: r.id,
  name: r.name,
  description: r.description,
  category: r.category,
  priceRange: r.priceRange,
  address: r.address,
  region: r.region,
  latitude: r.latitude,
  longitude: r.longitude,
  phone: r.phone ?? null,
  thumbnail: r.thumbnail ?? null,
  images: r.images,
  hasParking: r.hasParking,
  hasBreakTime: r.hasBreakTime,
  openingHours: r.openingHours ?? null,
  nearestStation: r.nearestStation
    ? {
        name: r.nearestStation.name,
        line: r.nearestStation.line ?? null,
        exit: r.nearestStation.exit ?? null,
        walkMinutes: r.nearestStation.walkMinutes ?? null,
      }
    : null,
  ratingAvg: r.ratingAvg,
  ratingCount: r.ratingCount,
  createdAt: r.createdAt,
  updatedAt: r.createdAt,
}));

const restaurantById = new Map(LOCAL_RESTAURANTS.map((r) => [r.id, r]));

/** 특정 맛집의 리뷰 목록 */
export function getLocalReviews(restaurantId: string): Review[] {
  return reviewInputs
    .filter((rev) => rev.restaurantId === restaurantId)
    .map((rev) => ({
      id: rev.id,
      rating: rev.rating,
      content: rev.content,
      images: rev.images,
      restaurantId: rev.restaurantId,
      author: { id: `local-${rev.id}`, name: rev.authorName, image: null },
      createdAt: rev.createdAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 정규화된 큐레이션 목록. 존재하지 않는 restaurantId 는 건너뜁니다. */
export const LOCAL_CURATED_LISTS: CuratedListDetail[] = curatedInputs.map((list) => {
  const items = list.items
    .map((item, index) => {
      const restaurant = restaurantById.get(item.restaurantId);
      if (!restaurant) {
        console.warn(
          `[src/data/curated.json] "${list.slug}": restaurantId "${item.restaurantId}" not found in restaurants.json — skipping.`,
        );
        return null;
      }
      return {
        id: `${list.id}-${item.restaurantId}`,
        order: index,
        comment: item.comment ?? null,
        restaurant,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  return {
    id: list.id,
    slug: list.slug,
    title: list.title,
    description: list.description,
    coverImage: list.coverImage ?? null,
    theme: list.theme,
    itemCount: items.length,
    createdAt: list.createdAt,
    items,
  };
});
