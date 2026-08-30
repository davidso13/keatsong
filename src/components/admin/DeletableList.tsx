"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { ApiResponse } from "@/types/api";

export interface DeletableRow {
  id: string;
  title: string;
  subtitle?: string | null;
  href?: string;
}

export function DeletableList({
  rows,
  endpoint,
  emptyMessage = "Nothing here yet.",
}: {
  rows: DeletableRow[];
  /** DELETE is sent to `${endpoint}/${id}` */
  endpoint: string;
  emptyMessage?: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) {
        setError(json.error.message);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/20 p-6 text-center text-sm text-ink-faint">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-3 p-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {row.href ? (
                  <Link href={row.href} className="hover:text-cobalt">
                    {row.title}
                  </Link>
                ) : (
                  row.title
                )}
              </p>
              {row.subtitle && (
                <p className="truncate text-xs text-ink-faint">{row.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(row.id)}
              disabled={busyId === row.id}
              aria-label={`Delete ${row.title}`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
