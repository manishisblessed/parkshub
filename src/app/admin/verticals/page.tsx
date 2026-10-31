import Link from "next/link";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function VerticalsAdmin() {
  await requirePermission("content.manage");
  const items = await prisma.businessVertical.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Business verticals</h1>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className="py-3">
            <Link className="text-forest underline" href={`/admin/verticals/${item.id}`}>{item.title}</Link>
            <span className="ml-3 text-sm text-muted">{item.published ? "Published" : "Hidden"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
