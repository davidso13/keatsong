import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui";

interface ContentCardProps {
  href: string;
  title: string;
  description: string;
  category: string;
  region: string;
  thumbnail: string | null;
  /** Small line under the region, e.g. schedule or best time */
  meta?: string | null;
}

export function ContentCard({
  href,
  title,
  description,
  category,
  region,
  thumbnail,
  meta,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-ink/25"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/[0.04]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-faint">
            No photo
          </div>
        )}
        <Badge variant="solid" className="absolute left-3 top-3">
          {category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display font-semibold text-ink">{title}</h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{description}</p>
        <div className="mt-auto flex flex-col gap-1 text-xs text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {region}
          </span>
          {meta && <span>{meta}</span>}
        </div>
      </div>
    </Link>
  );
}
