"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button, Input } from "@/components/ui";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "" });

  return (
    <div>
      <h1 className="display text-3xl">Sign up</h1>
      <p className="mt-2 text-sm text-ink-soft">Takes about 30 seconds.</p>

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
          // TODO: wire up a dedicated sign-up API (currently a magic link stands in)
          signIn("email", { email: form.email, callbackUrl: "/" });
        }}
      >
        <Input
          placeholder="Display name"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          type="email"
          placeholder="Email address"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-cobalt hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
