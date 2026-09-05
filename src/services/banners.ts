import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";
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

/** 홈 상단 롤링 배너 목록. DB 연결 시 DB 기준, 아니면 src/data/banners.json 기준. */
export async function getBanners(): Promise<Banner[]> {
  if (!isDatabaseConfigured) {
    const parsed = bannersSchema.safeParse(await readDataFile<unknown>(FILE, null));
    return parsed.success ? normalize(parsed.data) : LOCAL_BANNERS;
  }

  const rows = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    image: r.image,
    href: r.href,
    title: r.title,
    subtitle: r.subtitle,
  }));
}

/**
 * 배너 저장 — 전체 목록을 통째로 교체합니다.
 * DB 연결 시 Banner 테이블을 갱신하고, 아니면 src/data/banners.json 을 다시 씁니다
 * (읽기 전용 배포 환경에서는 DataReadOnlyError 를 던집니다).
 */
export async function saveBanners(input: unknown): Promise<Banner[]> {
  const banners = normalize(bannersSchema.parse(input));

  if (!isDatabaseConfigured) {
    await writeDataFile(FILE, banners);
    return banners;
  }

  await prisma.$transaction([
    prisma.banner.deleteMany({}),
    prisma.banner.createMany({
      data: banners.map((b, order) => ({ ...b, order })),
    }),
  ]);
  return banners;
}
