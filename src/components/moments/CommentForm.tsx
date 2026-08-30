"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import type { ApiResponse } from "@/types/api";
import type { PostComment } from "@/types";

export function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, body }),
      });
      const json: ApiResponse<PostComment> = await res.json();
      if (!json.success) {
        setError(json.error.message);
        return;
      }
      setBody("");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-line bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          maxLength={40}
          required
        />
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment"
          maxLength={2000}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" size="sm" disabled={submitting}>
        {submitting ? "Sending…" : "Comment"}
      </Button>
    </form>
  );
}
