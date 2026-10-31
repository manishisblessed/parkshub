import Link from "next/link";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ProcurementAdmin() {
  await requirePermission("procurement.manage");
  const rows = await prisma.procurementRequest.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Procurement</h1>
      <p className="mt-2 text-sm text-muted">Requests and quotation notes. No commission or payment release is calculated.</p>
      <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
        {rows.map((row) => (
          <li key={row.id} className="py-3">
            <Link className="text-forest underline" href={`/admin/procurement/${row.id}`}>{row.reference}</Link>
            <span className="ml-3">{row.productName} · {row.organisation} · {row.status}</span>
          </li>
        ))}
        {rows.length === 0 ? <li className="py-4 text-muted">No procurement requests yet.</li> : null}
      </ul>
    </div>
  );
}
