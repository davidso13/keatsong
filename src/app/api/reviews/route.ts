import type { NextRequest } from "next/server";
import { ok, fail, handleRouteError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { createReviewSchema } from "@/lib/schemas/restaurant";
import { createReview } from "@/services/reviews";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return fail("UNAUTHORIZED", "You must be logged in.");
    }

    const body = await request.json();
    const input = createReviewSchema.parse(body);

    const review = await createReview({
      ...input,
      authorId: (session.user as { id?: string }).id ?? "unknown",
    });

    return ok(review, "Review posted.");
  } catch (error) {
    return handleRouteError(error);
  }
}
