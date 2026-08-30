"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import type { ApiResponse } from "@/types/api";
import type { Banner } from "@/types";

type Draft = { image: string; href: string; title: string; subtitle: string };

function toDraft(b: Banner): Draft {
  return { image: b.image, href: b.href, title: b.title, subtitle: b.subtitle ?? "" };
}

export function BannerAdminForm({ initial }: { initial: Banner[] }) {
  const [rows, setRows] = useState<Draft[]>(initial.map(toDraft));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const update = (i: number, key: keyof Draft, value: string) => {
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = rows.map((r) => ({
        image: r.image.trim(),
        href: r.href.trim(),
        title: r.title.trim(),
        subtitle: r.subtitle.trim() || null,
      }));
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<Banner[]> = await res.json();
      if (!json.success) {
        setMessage({ kind: "error", text: json.error.message });
        return;
      }
      setRows(json.data.map(toDraft));
      setMessage({ kind: "ok", text: json.message ?? "Saved." });
    } catch {
      setMessage({ kind: "error", text: "Could not reach the server." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {rows.map((row, i) => (
        <div key={i} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <p className="eyebrow text-ink-faint">Slide {i + 1}</p>
          <div className="mt-3 grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-ink-soft">Image URL or /public path</span>
              <Input
                value={row.image}
                onChange={(e) => update(i, "image", e.target.value)}
                placeholder="https://… or /images/banner-1.jpg"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-ink-soft">Landing URL</span>
              <Input
                value={row.href}
                onChange={(e) => update(i, "href", e.target.value)}
                placeholder="/restaurants or https://…"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-ink-soft">Title</span>
                <Input
                  value={row.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-ink-soft">Subtitle (optional)</span>
                <Input
                  value={row.subtitle}
                  onChange={(e) => update(i, "subtitle", e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      ))}

      {message && (
        <p
          className={
            message.kind === "ok" ? "text-sm text-cobalt" : "text-sm text-red-600"
          }
        >
          {message.text}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save to banners.json"}
        </Button>
        <p className="text-xs text-ink-faint">
          Writes <code className="font-mono">src/data/banners.json</code>. On a read-only
          deployment, edit the file locally and redeploy.
        </p>
      </div>
    </div>
  );
}
