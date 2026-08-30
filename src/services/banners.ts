import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { LOCAL_BANNERS } from "@/data/content";
import { bannersSchema } from "@/lib/schemas/content";
import type { Banner } from "@/types";

const BANNERS_FILE = path.join(process.cwd(), "src", "data", "banners.json");

/** 홈 상단 롤링 배너 목록 (항상 src/data/banners.json 기준) */
export async function getBanners(): Promise<Banner[]> {
  // 런타임에 파일이 갱신됐을 수 있으므로 우선 파일을 읽고, 실패하면 번들된 값으로 폴백.
  try {
    const raw = await fs.readFile(BANNERS_FILE, "utf-8");
    const parsed = bannersSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      return parsed.data.map((b) => ({
        image: b.image,
        href: b.href,
        title: b.title,
        subtitle: b.subtitle ?? null,
      }));
    }
  } catch {
    // 파일 시스템 접근 불가(엣지 등) — 번들 값 사용
  }
  return LOCAL_BANNERS;
}

export class BannersReadOnlyError extends Error {
  constructor() {
    super(
      "Banners could not be saved: the file system is read-only in this environment. " +
        "Edit src/data/banners.json locally and redeploy.",
    );
    this.name = "BannersReadOnlyError";
  }
}

/**
 * 배너 저장 — src/data/banners.json 파일을 다시 씁니다.
 * 로컬 개발 환경에서만 동작하며, 읽기 전용 배포 환경에서는 BannersReadOnlyError 를 던집니다.
 */
export async function saveBanners(input: unknown): Promise<Banner[]> {
  const banners = bannersSchema.parse(input);
  const serialized = JSON.stringify(
    banners.map((b) => ({
      image: b.image,
      href: b.href,
      title: b.title,
      subtitle: b.subtitle?.trim() ? b.subtitle.trim() : null,
    })),
    null,
    2,
  );

  try {
    await fs.writeFile(BANNERS_FILE, `${serialized}\n`, "utf-8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      ["EROFS", "EACCES", "EPERM"].includes((error as NodeJS.ErrnoException).code ?? "")
    ) {
      throw new BannersReadOnlyError();
    }
    throw error;
  }

  return getBanners();
}
