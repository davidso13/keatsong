import type { NextRequest } from "next/server";
import { ok, handleRouteError } from "@/lib/api";
import { restaurantQuerySchema } from "@/lib/schemas/restaurant";
import { getRestaurants } from "@/services/restaurants";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = restaurantQuerySchema.parse(params);
    const result = await getRestaurants(query);
    return ok(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
