import { ok, fail, handleRouteError } from "@/lib/api";
import { DataReadOnlyError } from "@/data/store";
import { deleteActivity } from "@/services/things-to-do";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const removed = await deleteActivity(id);
    if (!removed) return fail("NOT_FOUND", "Activity not found.");
    return ok({ id }, "Activity deleted.");
  } catch (error) {
    if (error instanceof DataReadOnlyError) return fail("FORBIDDEN", error.message);
    return handleRouteError(error);
  }
}
