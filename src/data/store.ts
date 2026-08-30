import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

/** Thrown when a data file cannot be written because the filesystem is read-only. */
export class DataReadOnlyError extends Error {
  constructor(file: string) {
    super(
      `Could not save ${file}: the filesystem is read-only in this environment. ` +
        `Connect a database (set DATABASE_URL) or edit src/data/${file} locally and redeploy.`,
    );
    this.name = "DataReadOnlyError";
  }
}

const READ_ONLY_CODES = new Set(["EROFS", "EACCES", "EPERM"]);

/** Read and JSON-parse a file in src/data/. Returns `fallback` if it cannot be read. */
export async function readDataFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Pretty-write JSON to a file in src/data/. Throws DataReadOnlyError on a read-only FS. */
export async function writeDataFile(file: string, data: unknown): Promise<void> {
  try {
    await fs.writeFile(path.join(DATA_DIR, file), `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code ?? "";
    if (READ_ONLY_CODES.has(code)) throw new DataReadOnlyError(file);
    throw error;
  }
}

/** Turn a display name into a URL-safe id, with a short random suffix for uniqueness. */
export function slugId(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : suffix;
}
