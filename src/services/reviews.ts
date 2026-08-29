import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import type { CreateReviewInput } from "@/lib/schemas/restaurant";
import type { Review } from "@/types";

interface CreateReviewParams extends CreateReviewInput {
  authorId: string;
}

/** 리뷰 생성 + 맛집 평점 통계 갱신 */
export async function createReview(params: CreateReviewParams): Promise<Review> {
  if (!isDatabaseConfigured) {
    // Mock mode: return a response without persisting anything
    return {
      id: `mock-${Date.now()}`,
      rating: params.rating,
      content: params.content,
      images: params.images,
      restaurantId: params.restaurantId,
      author: { id: params.authorId, name: "You", image: null },
      createdAt: new Date().toISOString(),
    };
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        rating: params.rating,
        content: params.content,
        images: params.images,
        restaurantId: params.restaurantId,
        authorId: params.authorId,
      },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    const agg = await tx.review.aggregate({
      where: { restaurantId: params.restaurantId },
      _avg: { rating: true },
      _count: true,
    });

    await tx.restaurant.update({
      where: { id: params.restaurantId },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count,
      },
    });

    return {
      id: created.id,
      rating: created.rating,
      content: created.content,
      images: created.images,
      restaurantId: created.restaurantId,
      author: created.author,
      createdAt: created.createdAt.toISOString(),
    };
  });
}
