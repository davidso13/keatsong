import Link from "next/link";
import { buttonVariants } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="display text-6xl text-cobalt">404</p>
      <h1 className="mt-4 font-display text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-ink-soft">
        The address may have changed, or the page no longer exists.
      </p>
      <Link href="/" className={`${buttonVariants()} mt-6`}>
        Back to home
      </Link>
    </div>
  );
}
