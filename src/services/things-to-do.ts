import "server-only";

import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { activityInputSchema, LOCAL_ACTIVITIES } from "@/data/content";
import { readDataFile, slugId, writeDataFile } from "@/data/store";
import type { ActivityFormValues } from "@/lib/schemas/content";
import type { Activity } from "@/types";

const FILE = "things-to-do.json";

function normalize(a: z.infer<typeof activityInputSchema>): Activity {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    category: a.category,
    region: a.region,
    schedule: a.schedule,
    price: a.price ?? null,
    thumbnail: a.thumbnail ?? null,
    images: a.images,
    link: a.link ?? null,
    latitude: a.latitude ?? null,
    longitude: a.longitude ?? null,
    createdAt: a.createdAt,
  };
}

/** Live read of the data file, falling back to the value bundled at build time. */
async function readLocal(): Promise<Activity[]> {
  const parsed = z
    .array(activityInputSchema)
    .safeParse(await readDataFile<unknown>(FILE, null));
  return parsed.success ? parsed.data.map(normalize) : LOCAL_ACTIVITIES;
}

export async function getActivities(): Promise<Activity[]> {
  if (!isDatabaseConfigured) {
    return (await readLocal()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = await prisma.activity.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    region: r.region,
    schedule: r.schedule,
    price: r.price,
    thumbnail: r.thumbnail,
    images: r.images,
    link: r.link,
    latitude: r.latitude,
    longitude: r.longitude,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getActivityById(id: string): Promise<Activity | null> {
  return (await getActivities()).find((a) => a.id === id) ?? null;
}

export async function getAllActivityIds(): Promise<string[]> {
  return (await getActivities()).map((a) => a.id);
}

export async function createActivity(input: ActivityFormValues): Promise<Activity> {
  if (!isDatabaseConfigured) {
    const current = z
      .array(activityInputSchema)
      .safeParse(await readDataFile<unknown>(FILE, []));
    const list = current.success ? current.data.map(normalize) : await readLocal();
    const activity: Activity = {
      id: slugId(input.name),
      name: input.name,
      description: input.description,
      category: input.category,
      region: input.region,
      schedule: input.schedule,
      price: input.price,
      thumbnail: input.thumbnail,
      images: input.images,
      link: input.link,
      latitude: input.latitude,
      longitude: input.longitude,
      createdAt: new Date().toISOString(),
    };
    await writeDataFile(FILE, [activity, ...list]);
    return activity;
  }

  const row = await prisma.activity.create({
    data: {
      name: input.name,
      description: input.description,
      category: input.category,
      region: input.region,
      schedule: input.schedule,
      price: input.price,
      thumbnail: input.thumbnail,
      images: input.images,
      link: input.link,
      latitude: input.latitude,
      longitude: input.longitude,
    },
  });
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    region: row.region,
    schedule: row.schedule,
    price: row.price,
    thumbnail: row.thumbnail,
    images: row.images,
    link: row.link,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteActivity(id: string): Promise<boolean> {
  if (!isDatabaseConfigured) {
    const list = await readLocal();
    const next = list.filter((a) => a.id !== id);
    if (next.length === list.length) return false;
    await writeDataFile(
      FILE,
      next.map((a) => ({ ...a })),
    );
    return true;
  }
  const deleted = await prisma.activity.deleteMany({ where: { id } });
  return deleted.count > 0;
}
