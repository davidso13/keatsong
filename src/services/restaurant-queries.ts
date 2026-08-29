"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher, toQueryString } from "@/lib/fetcher";
import type { Paginated, RestaurantWithReviews } from "@/types";
import type { RestaurantWithDistance } from "./restaurants";

export interface RestaurantListParams {
  q?: string;
  category?: string;
  price?: string;
  region?: string;
  parking?: boolean;
  breakTime?: boolean;
  lat?: number;
  lng?: number;
  sort?: "rating" | "distance" | "latest";
  page?: number;
  pageSize?: number;
}

export const restaurantKeys = {
  all: ["restaurants"] as const,
  list: (params: RestaurantListParams) => [...restaurantKeys.all, "list", params] as const,
  detail: (id: string) => [...restaurantKeys.all, "detail", id] as const,
};

/** 맛집 목록 (클라이언트 페칭 — 무한스크롤/실시간 필터 등에 사용) */
export function useRestaurantsQuery(params: RestaurantListParams) {
  return useQuery({
    queryKey: restaurantKeys.list(params),
    queryFn: () =>
      fetcher<Paginated<RestaurantWithDistance>>(
        `/api/restaurants${toQueryString(params as Record<string, string | number | boolean | undefined>)}`,
      ),
  });
}

/** 맛집 상세 */
export function useRestaurantQuery(id: string) {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => fetcher<RestaurantWithReviews>(`/api/restaurants/${id}`),
    enabled: Boolean(id),
  });
}
