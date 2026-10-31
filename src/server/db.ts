import "server-only";

export const hasDatabase = !!process.env.DATABASE_URL;

let _prisma: any = null;

if (hasDatabase) {
  const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client");
  const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
  _prisma =
    g.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") g.prisma = _prisma;
}

export const prisma = _prisma as import("@prisma/client").PrismaClient;
