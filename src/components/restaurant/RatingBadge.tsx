import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRating } from "@/utils/format";

interface RatingBadgeProps {
  rating: number;
  count?: number;
  className?: string;
}

export function RatingBadge({ rating, count, className }: RatingBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium text-ink", className)}>
      <Star className="h-4 w-4 fill-cobalt text-cobalt" aria-hidden />
      <span>{formatRating(rating)}</span>
      {count !== undefined && (
        <span className="text-ink-faint">({count.toLocaleString("en-US")})</span>
      )}
    </span>
  );
}
