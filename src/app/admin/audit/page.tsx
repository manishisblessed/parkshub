import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { formatDateTime } from "@/lib/text";

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ entity?: string }> }) {
  await requirePermission("audit.view");
  const params = await searchParams;
  const rows = await prisma.auditLog.findMany({
    where: params.entity ? { entity: params.entity } : undefined,
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Audit log</h1>
      <form className="mt-4 flex gap-2" action="/admin/audit">
        <input name="entity" defaultValue={params.entity} placeholder="Entity, for example Enquiry" className="h-12 border border-line px-3" />
        <button className="h-12 bg-forest px-4 text-sm text-white" type="submit">Filter</button>
      </form>
      <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
        {rows.map((row) => (
          <li key={row.id} className="py-3">
            {formatDateTime(row.createdAt)} · {row.actor?.email || "system"} · {row.action} {row.entity} · {row.summary}
          </li>
        ))}
      </ul>
    </div>
  );
}
