import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/server/db";

export async function clientIp() {
  try {
    const headerList = await headers();
    return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "";
  } catch {
    return "";
  }
}

export async function audit(input: {
  action: string;
  entity: string;
  entityId?: string;
  summary: string;
  actorId?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? "",
      summary: input.summary.slice(0, 500),
      actorId: input.actorId || null,
      ip: await clientIp(),
    },
  });
}
