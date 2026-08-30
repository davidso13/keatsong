import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CommentForm } from "@/components/moments/CommentForm";
import { getPostById } from "@/services/posts";
import { formatRelativeTime } from "@/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.body.slice(0, 150) };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/moments"
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Share moments
      </Link>

      <header className="mt-5">
        <h1 className="display text-3xl">{post.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
          <span>{post.nickname}</span>
          <span>·</span>
          <span>{formatRelativeTime(post.createdAt)}</span>
        </div>
      </header>

      <p className="mt-6 whitespace-pre-wrap text-ink-soft">{post.body}</p>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">
          Comments <span className="text-ink-faint">{post.comments.length}</span>
        </h2>

        <ul className="mt-4 space-y-3">
          {post.comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-line bg-surface p-4 text-sm"
            >
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <span className="font-medium text-ink-soft">{comment.nickname}</span>
                <span>·</span>
                <span>{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-ink-soft">{comment.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <CommentForm postId={post.id} />
        </div>
      </section>
    </article>
  );
}
