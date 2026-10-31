import "server-only";
import { prisma } from "@/server/db";

export async function nextReference(prefix: string) {
  const key = `${prefix}-${new Date().getFullYear()}`;
  const counter = await prisma.counter.upsert({
    where: { key },
    create: { key, value: 1 },
    update: { value: { increment: 1 } },
  });
  return `${key}-${String(counter.value).padStart(4, "0")}`;
}
