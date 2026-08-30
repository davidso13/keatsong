"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import {
  FOOD_CATEGORIES,
  FOOD_CATEGORY_LABEL,
  PRICE_RANGES,
  PRICE_RANGE_LABEL,
} from "@/lib/constants";
import type { ApiResponse } from "@/types/api";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";

const EMPTY = {
  name: "",
  description: "",
  category: FOOD_CATEGORIES[0],
  priceRange: PRICE_RANGES[0],
  address: "",
  region: "",
  latitude: "",
  longitude: "",
  phone: "",
  thumbnail: "",
  images: "",
  hasParking: false,
  hasBreakTime: false,
};

export function RestaurantForm() {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          images: form.images,
        }),
      });
      const json: ApiResponse<{ id: string }> = await res.json();
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
        <SelectField
          label="Type"
          value={form.category}
          onChange={(v) => set("category", v as (typeof form)["category"])}
          options={FOOD_CATEGORIES.map((c) => ({ value: c, label: FOOD_CATEGORY_LABEL[c] }))}
          required
        />
        <SelectField
          label="Price"
          value={form.priceRange}
          onChange={(v) => set("priceRange", v as (typeof form)["priceRange"])}
          options={PRICE_RANGES.map((p) => ({ value: p, label: PRICE_RANGE_LABEL[p] }))}
          required
        />
      </div>
      <TextField
        label="Address"
        value={form.address}
        onChange={(v) => set("address", v)}
        required
      />
      <TextField
        label="Region"
        value={form.region}
        onChange={(v) => set("region", v)}
        placeholder="Mapo-gu, Seoul"
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Latitude"
          value={form.latitude}
          onChange={(v) => set("latitude", v)}
          placeholder="37.5385"
          required
        />
        <TextField
          label="Longitude"
          value={form.longitude}
          onChange={(v) => set("longitude", v)}
          placeholder="126.9472"
          required
        />
      </div>
      <TextField
        label="Phone"
        value={form.phone}
        onChange={(v) => set("phone", v)}
        placeholder="Optional"
      />
      <TextField
        label="Thumbnail"
        value={form.thumbnail}
        onChange={(v) => set("thumbnail", v)}
        placeholder="https://… or /images/foo.jpg"
        hint="Absolute URL or a path under /public"
      />
      <TextAreaField
        label="Gallery images"
        value={form.images}
        onChange={(v) => set("images", v)}
        rows={3}
        hint="One URL per line (or comma-separated)"
      />
      <div className="flex gap-6">
        <CheckboxField
          label="Has parking"
          checked={form.hasParking}
          onChange={(v) => set("hasParking", v)}
        />
        <CheckboxField
          label="Has break time"
          checked={form.hasBreakTime}
          onChange={(v) => set("hasBreakTime", v)}
        />
      </div>

      {message && (
        <p className={message.kind === "ok" ? "text-sm text-cobalt" : "text-sm text-red-600"}>
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add restaurant"}
      </Button>
    </form>
  );
}
