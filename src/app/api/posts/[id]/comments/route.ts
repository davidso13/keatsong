import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { createCommentSchema } from "@/lib/schemas/content";
import { createComment } from "@/services/posts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = createCommentSchema.parse(await request.json());
    const comment = await createComment(id, input);
    if (!comment) return fail("NOT_FOUND", "Post not found.");
    return ok(comment, "Comment added.");
  } catch (error) {
    return handleRouteError(error);
  }
}
