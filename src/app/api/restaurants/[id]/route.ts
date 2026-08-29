import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { getRestaurantById } from "@/services/restaurants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const lat = Number(request.nextUrl.searchParams.get("lat"));
    const lng = Number(request.nextUrl.searchParams.get("lng"));
    const origin =
      Number.isFinite(lat) && Number.isFinite(lng)
        ? { latitude: lat, longitude: lng }
        : undefined;

    const restaurant = await getRestaurantById(id, origin);
    if (!restaurant) return fail("NOT_FOUND", "Restaurant not found.");

    return ok(restaurant);
  } catch (error) {
    return handleRouteError(error);
  }
}
