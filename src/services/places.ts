import "server-only";

import { LOCAL_PLACES } from "@/data/content";
import type { Place } from "@/types";

/** Places 목록 (최신순). 데이터는 src/data/places.json 에서 관리합니다. */
export async function getPlaces(): Promise<Place[]> {
  return [...LOCAL_PLACES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPlaceById(id: string): Promise<Place | null> {
  return LOCAL_PLACES.find((p) => p.id === id) ?? null;
}

export async function getAllPlaceIds(): Promise<string[]> {
  return LOCAL_PLACES.map((p) => p.id);
}
