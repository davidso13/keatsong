"use client";

import { Input } from "@/components/ui";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-ink-soft">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-ink-soft">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt/30"
      />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-ink-soft">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-ink/15 bg-surface px-3 text-sm text-ink focus-visible:border-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-cobalt"
      />
      {label}
    </label>
  );
}
