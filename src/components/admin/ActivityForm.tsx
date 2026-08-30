"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import type { ApiResponse } from "@/types/api";
import { TextAreaField, TextField } from "./fields";

const EMPTY = {
  name: "",
  description: "",
  category: "",
  region: "",
  schedule: "",
  price: "",
  thumbnail: "",
  images: "",
  link: "",
  latitude: "",
  longitude: "",
};

export function ActivityForm() {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/things-to-do", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) {
        setMessage({ kind: "error", text: json.error.message });
        return;
      }
      setForm({ ...EMPTY });
      setMessage({ kind: "ok", text: "Added. It now shows on the site." });
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Could not reach the server." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-6"
    >
      <TextField label="Name" value={form.name} onChange={(v) => set("name", v)} required />
      <TextAreaField
        label="Description"
        value={form.description}
        onChange={(v) => set("description", v)}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Category"
          value={form.category}
          onChange={(v) => set("category", v)}
          placeholder="Festival / Workshop / Tour"
          required
        />
        <TextField
          label="Region"
          value={form.region}
          onChange={(v) => set("region", v)}
          placeholder="Jung-gu, Seoul"
          required
        />
      </div>
      <TextField
        label="Schedule"
        value={form.schedule}
        onChange={(v) => set("schedule", v)}
        placeholder="May 3–5, 2026  ·  Year-round"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Price"
          value={form.price}
          onChange={(v) => set("price", v)}
          placeholder="Free / From $20"
        />
        <TextField
          label="Official link"
          value={form.link}
          onChange={(v) => set("link", v)}
          placeholder="https://…"
        />
      </div>
      <TextField
        label="Thumbnail"
        value={form.thumbnail}
        onChange={(v) => set("thumbnail", v)}
        placeholder="https://… or /images/foo.jpg"
      />
      <TextAreaField
        label="Gallery images"
        value={form.images}
        onChange={(v) => set("images", v)}
        rows={3}
        hint="One URL per line (or comma-separated)"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Latitude"
          value={form.latitude}
          onChange={(v) => set("latitude", v)}
          placeholder="Optional"
        />
        <TextField
          label="Longitude"
          value={form.longitude}
          onChange={(v) => set("longitude", v)}
          placeholder="Optional"
        />
      </div>

      {message && (
        <p className={message.kind === "ok" ? "text-sm text-cobalt" : "text-sm text-red-600"}>
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add activity"}
      </Button>
    </form>
  );
}
