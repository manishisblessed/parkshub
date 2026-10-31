import Link from "next/link";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ServicesAdmin() {
  await requirePermission("content.manage");
  const items = await prisma.service.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Services</h1>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className="py-3">
            <Link className="text-forest underline" href={`/admin/services/${item.id}`}>{item.title}</Link>
            <span className="ml-3 text-sm text-muted">{item.availability}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
