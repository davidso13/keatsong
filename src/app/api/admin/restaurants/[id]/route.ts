import { ok, fail, handleRouteError } from "@/lib/api";
import { DataReadOnlyError } from "@/data/store";
import { deleteRestaurant } from "@/services/restaurants";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const removed = await deleteRestaurant(id);
    if (!removed) return fail("NOT_FOUND", "Restaurant not found.");
    return ok({ id }, "Restaurant deleted.");
  } catch (error) {
    if (error instanceof DataReadOnlyError) return fail("FORBIDDEN", error.message);
    return handleRouteError(error);
  }
}
