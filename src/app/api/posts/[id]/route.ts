import { ok, fail, handleRouteError } from "@/lib/api";
import { getPostById } from "@/services/posts";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) return fail("NOT_FOUND", "Post not found.");
    return ok(post);
  } catch (error) {
    return handleRouteError(error);
  }
}
