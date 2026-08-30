import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { BannersReadOnlyError, getBanners, saveBanners } from "@/services/banners";

export async function GET() {
  try {
    return ok(await getBanners());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const banners = await saveBanners(await request.json());
    return ok(banners, "Banners saved to src/data/banners.json.");
  } catch (error) {
    if (error instanceof BannersReadOnlyError) {
      return fail("FORBIDDEN", error.message);
    }
    return handleRouteError(error);
  }
}
