import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { PostComposer } from "@/components/moments/PostComposer";
import { getPosts } from "@/services/posts";
import { formatRelativeTime } from "@/utils/format";

export const metadata: Metadata = {
  title: "Share moments",
  description: "A community board for travelers in Korea — post finds, ask for tips.",
};

export const dynamic = "force-dynamic";

export default async function MomentsPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-ink-faint">Community</p>
      <h1 className="display mt-2 text-4xl">Share moments</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Post what you found, ask for a recommendation, or answer someone else&apos;s question.
        No account needed — just pick a nickname.
      </p>

      <div className="mt-8">
        <PostComposer />
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink-faint">
          No posts yet. Be the first.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/moments/${post.id}`}
                className="block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/25"
              >
                <h2 className="font-display font-semibold text-ink">{post.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{post.body}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-faint">
                  <span>{post.nickname}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                    {post.commentCount}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
