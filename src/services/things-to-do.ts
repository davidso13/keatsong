import "server-only";

import { LOCAL_ACTIVITIES } from "@/data/content";
import type { Activity } from "@/types";

/** Things to do 목록 (최신순). 데이터는 src/data/things-to-do.json 에서 관리합니다. */
export async function getActivities(): Promise<Activity[]> {
  return [...LOCAL_ACTIVITIES].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getActivityById(id: string): Promise<Activity | null> {
  return LOCAL_ACTIVITIES.find((a) => a.id === id) ?? null;
}

export async function getAllActivityIds(): Promise<string[]> {
  return LOCAL_ACTIVITIES.map((a) => a.id);
}
