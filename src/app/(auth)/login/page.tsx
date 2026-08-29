"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h1 className="display text-3xl">Log in</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Sign in to manage your reviews and saved collections.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-6 w-full"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          signIn("email", { email, callbackUrl: "/" });
        }}
      >
        <Input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Email me a login link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-cobalt hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
