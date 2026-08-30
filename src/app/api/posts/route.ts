import type { NextRequest } from "next/server";
import { ok, handleRouteError } from "@/lib/api";
import { createPostSchema } from "@/lib/schemas/content";
import { createPost, getPosts } from "@/services/posts";

export async function GET() {
  try {
    return ok(await getPosts());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = createPostSchema.parse(await request.json());
    const post = await createPost(input);
    return ok(post, "Posted.");
  } catch (error) {
    return handleRouteError(error);
  }
}
