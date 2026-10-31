import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ReportsPage() {
  await requirePermission("reports.view");
  const [enquiries, products, farmers, buyers, vendors, procurement, farms, batches] = await Promise.all([
    prisma.enquiry.groupBy({ by: ["type"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.product.count({ where: { deletedAt: null, published: true } }),
    prisma.farmer.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.buyer.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.vendor.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.procurementRequest.count({ where: { deletedAt: null } }),
    prisma.farm.count({ where: { deletedAt: null } }),
    prisma.inventoryBatch.count(),
  ]);
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Reports</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Counts from recorded rows. There is no revenue, yield, or capacity report because those figures are not kept as claims.</p>
      <h2 className="mt-8 font-display text-2xl text-forest">Enquiries by type</h2>
      <ul className="mt-3 text-sm">{enquiries.map((row) => <li key={row.type}>{row.type}: {row._count._all}</li>)}</ul>
      <h2 className="mt-8 font-display text-2xl text-forest">Partners</h2>
      <ul className="mt-3 text-sm">
        {farmers.map((row) => <li key={`f-${row.status}`}>Farmers {row.status}: {row._count._all}</li>)}
        {buyers.map((row) => <li key={`b-${row.status}`}>Buyers {row.status}: {row._count._all}</li>)}
        {vendors.map((row) => <li key={`v-${row.status}`}>Vendors {row.status}: {row._count._all}</li>)}
      </ul>
      <ul className="mt-6 text-sm">
        <li>Published products: {products}</li>
        <li>Procurement requests: {procurement}</li>
        <li>Farm records: {farms}</li>
        <li>Inventory batches: {batches}</li>
      </ul>
    </div>
  );
}
