import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { DataReadOnlyError } from "@/data/store";
import { restaurantFormSchema } from "@/lib/schemas/content";
import { createRestaurant } from "@/services/restaurants";

export async function POST(request: NextRequest) {
  try {
    const input = restaurantFormSchema.parse(await request.json());
    const created = await createRestaurant(input);
    return ok(created, "Restaurant added.");
  } catch (error) {
    if (error instanceof DataReadOnlyError) return fail("FORBIDDEN", error.message);
    return handleRouteError(error);
  }
}
