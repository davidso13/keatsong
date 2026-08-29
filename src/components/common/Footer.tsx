import Link from "next/link";
import { buttonVariants } from "@/components/ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-6 pt-16 sm:px-6">
      <div className="dot-grid relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-cobalt px-6 pt-14 text-white sm:px-12">
        <h2 className="display max-w-2xl text-3xl leading-tight sm:text-4xl">
          Turn every trip into a great meal.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/restaurants"
            className={buttonVariants({ variant: "dark", size: "md" })}
          >
            Explore restaurants
          </Link>
          <Link
            href="/curated"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/40 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Browse collections
          </Link>
        </div>

        <div className="mt-14 grid gap-8 border-t border-white/20 py-8 text-sm sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-base font-semibold">KeatSong</p>
            <p className="mt-1 max-w-xs text-white/70">
              A restaurant discovery guide for travelers in Korea.
            </p>
          </div>
          <div className="space-y-2">
            <p className="eyebrow text-white/60">Explore</p>
            <Link href="/restaurants" className="block text-white/85 hover:text-white">
              Restaurants
            </Link>
            <Link href="/curated" className="block text-white/85 hover:text-white">
              Collections
            </Link>
          </div>
          <div className="space-y-2">
            <p className="eyebrow text-white/60">Account</p>
            <Link href="/login" className="block text-white/85 hover:text-white">
              Log in
            </Link>
            <Link href="/signup" className="block text-white/85 hover:text-white">
              Sign up
            </Link>
          </div>
        </div>

        <p className="pb-8 text-xs text-white/60">
          © {year} KeatSong. A learning demo project.
        </p>

        <div
          className="pointer-events-none -mb-[0.16em] select-none whitespace-nowrap text-[22vw] font-bold leading-[0.7] tracking-tighter text-white/95 sm:text-[12rem]"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden
        >
          KeatSong
        </div>
      </div>
    </footer>
  );
}
