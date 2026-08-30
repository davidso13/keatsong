import "server-only";

import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import { LOCAL_PLACES, placeInputSchema } from "@/data/content";
import { readDataFile, slugId, writeDataFile } from "@/data/store";
import type { PlaceFormValues } from "@/lib/schemas/content";
import type { Place } from "@/types";

const FILE = "places.json";

function normalize(p: z.infer<typeof placeInputSchema>): Place {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    region: p.region,
    address: p.address ?? null,
    bestTime: p.bestTime ?? null,
    thumbnail: p.thumbnail ?? null,
    images: p.images,
    latitude: p.latitude ?? null,
    longitude: p.longitude ?? null,
    createdAt: p.createdAt,
  };
}

async function readLocal(): Promise<Place[]> {
  const parsed = z.array(placeInputSchema).safeParse(await readDataFile<unknown>(FILE, null));
  return parsed.success ? parsed.data.map(normalize) : LOCAL_PLACES;
}

export async function getPlaces(): Promise<Place[]> {
  if (!isDatabaseConfigured) {
    return (await readLocal()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = await prisma.place.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    region: r.region,
    address: r.address,
    bestTime: r.bestTime,
    thumbnail: r.thumbnail,
    images: r.images,
    latitude: r.latitude,
    longitude: r.longitude,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getPlaceById(id: string): Promise<Place | null> {
  return (await getPlaces()).find((p) => p.id === id) ?? null;
}

export async function getAllPlaceIds(): Promise<string[]> {
  return (await getPlaces()).map((p) => p.id);
}

export async function createPlace(input: PlaceFormValues): Promise<Place> {
  if (!isDatabaseConfigured) {
    const list = await readLocal();
    const place: Place = {
      id: slugId(input.name),
      name: input.name,
      description: input.description,
      category: input.category,
      region: input.region,
      address: input.address,
      bestTime: input.bestTime,
      thumbnail: input.thumbnail,
      images: input.images,
      latitude: input.latitude,
      longitude: input.longitude,
      createdAt: new Date().toISOString(),
    };
    await writeDataFile(FILE, [place, ...list]);
    return place;
  }

  const row = await prisma.place.create({
    data: {
      name: input.name,
      description: input.description,
      category: input.category,
      region: input.region,
      address: input.address,
      bestTime: input.bestTime,
      thumbnail: input.thumbnail,
      images: input.images,
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
    address: row.address,
    bestTime: row.bestTime,
    thumbnail: row.thumbnail,
    images: row.images,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deletePlace(id: string): Promise<boolean> {
  if (!isDatabaseConfigured) {
    const list = await readLocal();
    const next = list.filter((p) => p.id !== id);
    if (next.length === list.length) return false;
    await writeDataFile(
      FILE,
      next.map((p) => ({ ...p })),
    );
    return true;
  }
  const deleted = await prisma.place.deleteMany({ where: { id } });
  return deleted.count > 0;
}
