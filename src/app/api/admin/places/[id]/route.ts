import { ok, fail, handleRouteError } from "@/lib/api";
import { DataReadOnlyError } from "@/data/store";
import { deletePlace } from "@/services/places";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const removed = await deletePlace(id);
    if (!removed) return fail("NOT_FOUND", "Place not found.");
    return ok({ id }, "Place deleted.");
  } catch (error) {
    if (error instanceof DataReadOnlyError) return fail("FORBIDDEN", error.message);
    return handleRouteError(error);
  }
}
