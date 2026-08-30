import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { DataReadOnlyError } from "@/data/store";
import { placeFormSchema } from "@/lib/schemas/content";
import { createPlace } from "@/services/places";

export async function POST(request: NextRequest) {
  try {
    const input = placeFormSchema.parse(await request.json());
    const created = await createPlace(input);
    return ok(created, "Place added.");
  } catch (error) {
    if (error instanceof DataReadOnlyError) return fail("FORBIDDEN", error.message);
    return handleRouteError(error);
  }
}
