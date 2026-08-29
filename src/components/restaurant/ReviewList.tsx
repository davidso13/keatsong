import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/format";
import type { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-cobalt text-cobalt" : "text-ink/20",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-faint">Be the first to write a review.</p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {reviews.map((review) => (
        <li key={review.id} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/[0.07] text-xs font-medium text-ink-soft">
                {review.author.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span className="text-sm font-medium text-ink">
                {review.author.name ?? "Anonymous"}
              </span>
            </div>
            <time className="text-xs text-ink-faint">{formatRelativeTime(review.createdAt)}</time>
          </div>
          <div className="mt-2">
            <Stars rating={review.rating} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">{review.content}</p>
        </li>
      ))}
    </ul>
  );
}
