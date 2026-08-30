import "server-only";

import { LOCAL_BANNERS } from "@/data/content";
import { readDataFile, writeDataFile } from "@/data/store";
import { bannersSchema } from "@/lib/schemas/content";
import type { Banner } from "@/types";

const FILE = "banners.json";

interface RawBanner {
  image: string;
  href: string;
  title: string;
  subtitle?: string | null;
}

function normalize(list: RawBanner[]): Banner[] {
  return list.map((b) => ({
    image: b.image,
    href: b.href,
    title: b.title,
    subtitle: b.subtitle?.trim() ? b.subtitle.trim() : null,
  }));
}

/** 홈 상단 롤링 배너 목록 (항상 src/data/banners.json 기준, 실패 시 번들 값). */
export async function getBanners(): Promise<Banner[]> {
  const parsed = bannersSchema.safeParse(await readDataFile<unknown>(FILE, null));
  return parsed.success ? normalize(parsed.data) : LOCAL_BANNERS;
}

/**
 * 배너 저장 — src/data/banners.json 을 다시 씁니다.
 * 읽기 전용 배포 환경에서는 DataReadOnlyError 를 던집니다.
 */
export async function saveBanners(input: unknown): Promise<Banner[]> {
  const banners = normalize(bannersSchema.parse(input));
  await writeDataFile(FILE, banners);
  return banners;
}
