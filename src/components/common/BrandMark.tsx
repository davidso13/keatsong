import { cn } from "@/lib/utils";

/** KeatSong mark — a cobalt tile with a pin cut out of it. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-[7px] bg-cobalt text-white",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none">
        <path
          d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
          fill="currentColor"
        />
        <circle cx="12" cy="11" r="2.2" className="fill-cobalt" />
      </svg>
    </span>
  );
}
