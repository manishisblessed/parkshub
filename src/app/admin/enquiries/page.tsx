import Link from "next/link";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/auth";
import { Notice } from "@/components/ui";
import { ENQUIRY_TYPE_LABELS, type EnquiryType } from "@/lib/constants";
import { formatDateTime } from "@/lib/text";

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ notice?: string; status?: string }> }) {
  await requirePermission("enquiries.manage");
  const params = await searchParams;
  const enquiries = await prisma.enquiry.findMany({
    where: { deletedAt: null, ...(params.status ? { status: params.status } : {}) },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { product: true },
  });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Enquiries</h1>
      <div className="mt-4">
        <Notice code={params.notice} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {["", "NEW", "IN_REVIEW", "RESPONDED", "CLOSED"].map((status) => (
          <Link key={status || "all"} href={status ? `/admin/enquiries?status=${status}` : "/admin/enquiries"} className="underline">
            {status || "All"}
          </Link>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="py-2">Reference</th>
              <th>Type</th>
              <th>From</th>
              <th>Status</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="py-3">
                  <Link href={`/admin/enquiries/${item.id}`} className="text-forest underline">
                    {item.reference}
                  </Link>
                </td>
                <td>{ENQUIRY_TYPE_LABELS[item.type as EnquiryType] || item.type}</td>
                <td>
                  {item.name}
                  <span className="block text-muted">{item.email}</span>
                </td>
                <td>{item.status}</td>
                <td>{formatDateTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {enquiries.length === 0 ? <p className="py-6 text-sm text-muted">No enquiries in this view.</p> : null}
      </div>
    </div>
  );
}
