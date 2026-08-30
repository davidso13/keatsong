import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { DataReadOnlyError } from "@/data/store";
import { activityFormSchema } from "@/lib/schemas/content";
import { createActivity } from "@/services/things-to-do";

export async function POST(request: NextRequest) {
  try {
    const input = activityFormSchema.parse(await request.json());
    const created = await createActivity(input);
    return ok(created, "Activity added.");
  } catch (error) {
    if (error instanceof DataReadOnlyError) return fail("FORBIDDEN", error.message);
    return handleRouteError(error);
  }
}
