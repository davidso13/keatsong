import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** DATABASE_URL 이 설정되어 있으면 실제 DB, 아니면 src/data/*.json 으로 동작합니다. */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);
