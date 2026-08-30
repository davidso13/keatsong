import "server-only";

import { randomUUID } from "node:crypto";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import type { CreateCommentInput, CreatePostInput } from "@/lib/schemas/content";
import type { Post, PostComment, PostDetail } from "@/types";

import postsSeed from "@/data/posts.json";

/* ------------------------------------------------------------------ *
 *  Fallback 저장소 (DATABASE_URL 미설정 시)
 *  - 서버 인스턴스 메모리에만 유지됩니다. 재배포/스케일 시 초기화됩니다.
 * ------------------------------------------------------------------ */

interface MemPost {
  id: string;
  nickname: string;
  title: string;
  body: string;
  createdAt: string;
  comments: PostComment[];
}

const globalForPosts = globalThis as unknown as { __keatsongPosts?: MemPost[] };

function memStore(): MemPost[] {
  if (!globalForPosts.__keatsongPosts) {
    globalForPosts.__keatsongPosts = postsSeed.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      title: p.title,
      body: p.body,
      createdAt: p.createdAt,
      comments: p.comments.map((c) => ({
        id: c.id,
        postId: p.id,
        nickname: c.nickname,
        body: c.body,
        createdAt: c.createdAt,
      })),
    }));
  }
  return globalForPosts.__keatsongPosts;
}

function byNewest<T extends { createdAt: string }>(a: T, b: T) {
  return b.createdAt.localeCompare(a.createdAt);
}

/* ------------------------------------------------------------------ *
 *  Public API
 * ------------------------------------------------------------------ */

export async function getPosts(): Promise<Post[]> {
  if (!isDatabaseConfigured) {
    return [...memStore()].sort(byNewest).map((p) => ({
      id: p.id,
      nickname: p.nickname,
      title: p.title,
      body: p.body,
      commentCount: p.comments.length,
      createdAt: p.createdAt,
    }));
  }

  const rows = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });
  return rows.map((row) => ({
    id: row.id,
    nickname: row.nickname,
    title: row.title,
    body: row.body,
    commentCount: row._count.comments,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getPostById(id: string): Promise<PostDetail | null> {
  if (!isDatabaseConfigured) {
    const found = memStore().find((p) => p.id === id);
    if (!found) return null;
    return {
      id: found.id,
      nickname: found.nickname,
      title: found.title,
      body: found.body,
      commentCount: found.comments.length,
      createdAt: found.createdAt,
      comments: [...found.comments].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    };
  }

  const row = await prisma.post.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
  if (!row) return null;
  return {
    id: row.id,
    nickname: row.nickname,
    title: row.title,
    body: row.body,
    commentCount: row.comments.length,
    createdAt: row.createdAt.toISOString(),
    comments: row.comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      nickname: c.nickname,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  if (!isDatabaseConfigured) {
    const post: MemPost = {
      id: randomUUID(),
      nickname: input.nickname,
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    memStore().unshift(post);
    return { ...post, commentCount: 0 };
  }

  const row = await prisma.post.create({
    data: { nickname: input.nickname, title: input.title, body: input.body },
  });
  return {
    id: row.id,
    nickname: row.nickname,
    title: row.title,
    body: row.body,
    commentCount: 0,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createComment(
  postId: string,
  input: CreateCommentInput,
): Promise<PostComment | null> {
  if (!isDatabaseConfigured) {
    const post = memStore().find((p) => p.id === postId);
    if (!post) return null;
    const comment: PostComment = {
      id: randomUUID(),
      postId,
      nickname: input.nickname,
      body: input.body,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    return comment;
  }

  const exists = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!exists) return null;

  const row = await prisma.postComment.create({
    data: { postId, nickname: input.nickname, body: input.body },
  });
  return {
    id: row.id,
    postId: row.postId,
    nickname: row.nickname,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAllPostIds(): Promise<string[]> {
  if (!isDatabaseConfigured) return memStore().map((p) => p.id);
  const rows = await prisma.post.findMany({ select: { id: true } });
  return rows.map((r) => r.id);
}
