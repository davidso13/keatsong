import { ok, handleRouteError } from "@/lib/api";
import { getCuratedLists } from "@/services/curated";

export async function GET() {
  try {
    const lists = await getCuratedLists();
    return ok(lists);
  } catch (error) {
    return handleRouteError(error);
  }
}
