import Link from "next/link";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/auth";
import { formatDateTime } from "@/lib/text";

export default async function DashboardPage() {
  await requirePermission("dashboard.view");
  const [enquiryGroups, farmerCount, buyerCount, vendorCount, productCount, activeProducts, recent] = await Promise.all([
    prisma.enquiry.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.farmer.count({ where: { deletedAt: null } }),
    prisma.buyer.count({ where: { deletedAt: null } }),
    prisma.vendor.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null, published: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { actor: true } }),
  ]);
  const count = (status: string) => enquiryGroups.find((item) => item.status === status)?._count._all ?? 0;
  const cards = [
    ["Enquiries", enquiryGroups.reduce((sum, item) => sum + item._count._all, 0), "/admin/enquiries"],
    ["New", count("NEW"), "/admin/enquiries"],
    ["In review", count("IN_REVIEW"), "/admin/enquiries"],
    ["Responded", count("RESPONDED"), "/admin/enquiries"],
    ["Closed", count("CLOSED"), "/admin/enquiries"],
    ["Farmers", farmerCount, "/admin/farmers"],
    ["Buyers", buyerCount, "/admin/buyers"],
    ["Vendors", vendorCount, "/admin/vendors"],
    ["Catalogue", productCount, "/admin/products"],
    ["Published products", activeProducts, "/admin/products"],
  ];
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Figures come from this database. Production, revenue, and stock are not shown because they are not claimed.</p>
      <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, href]) => (
          <Link key={String(label)} href={String(href)} className="bg-white p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
            <p className="mt-2 font-display text-4xl text-forest">{value}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl text-forest">Recent activity</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
        {recent.map((item) => (
          <li key={item.id} className="py-3">
            {formatDateTime(item.createdAt)} · {item.action} · {item.entity} · {item.summary}
            {item.actor ? ` · ${item.actor.name}` : ""}
          </li>
        ))}
        {recent.length === 0 ? <li className="py-3">No audit events yet.</li> : null}
      </ul>
    </div>
  );
}
