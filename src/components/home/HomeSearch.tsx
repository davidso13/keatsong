"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomeSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/restaurants?q=${encodeURIComponent(q)}` : "/restaurants");
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className="mx-auto flex w-full max-w-4xl items-center gap-2 rounded-2xl border border-ink/15 bg-surface p-2 shadow-sm focus-within:border-cobalt focus-within:ring-2 focus-within:ring-cobalt/25"
    >
      <Search className="ml-2 h-5 w-5 shrink-0 text-ink-faint" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search restaurants by name, area or dish"
        aria-label="Search restaurants"
        className="h-11 w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none sm:text-base"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-xl bg-cobalt px-5 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover"
      >
        Search
      </button>
    </form>
  );
}
