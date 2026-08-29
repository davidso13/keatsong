import Link from "next/link";
import { buttonVariants } from "@/components/ui";
import { Navigation } from "./Navigation";
import { BrandMark } from "./BrandMark";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/75 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark className="h-7 w-7" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            KeatSong
          </span>
        </Link>

        <Navigation />

        <div className="flex items-center gap-1.5">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
