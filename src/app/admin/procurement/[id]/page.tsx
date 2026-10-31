import { notFound } from "next/navigation";
import { addQuotation, saveProcurementStatus } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { PROCUREMENT_STATUSES, QUOTATION_STATUSES } from "@/lib/constants";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ProcurementDetail({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("procurement.manage");
  const { id } = await params;
  const row = await prisma.procurementRequest.findFirst({ where: { id, deletedAt: null }, include: { quotations: { include: { vendor: true } } } });
  if (!row) notFound();
  const vendors = await prisma.vendor.findMany({ where: { deletedAt: null, status: "APPROVED" }, orderBy: { businessName: "asc" } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-forest">{row.reference}</h1>
      <p className="mt-3">{row.organisation} · {row.contactName} · {row.email}</p>
      <p className="mt-2">{row.productName} · {row.quantityNote}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm">{row.details}</p>
      <form action={saveProcurementStatus} className="mt-6 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={row.id} />
        <Field label="Status" name="status" as="select" defaultValue={row.status} options={PROCUREMENT_STATUSES.map((status) => ({ value: status, label: status }))} />
        <SubmitButton>Update</SubmitButton>
      </form>
      <h2 className="mt-10 font-display text-2xl text-forest">Quotation notes</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {row.quotations.map((quote) => (
          <li key={quote.id} className="border border-line p-3">
            <p>{quote.status} {quote.vendor ? `· ${quote.vendor.businessName}` : ""}</p>
            <p className="mt-2 whitespace-pre-wrap">{quote.narrative}</p>
            {quote.terms ? <p className="mt-2 text-muted">{quote.terms}</p> : null}
          </li>
        ))}
      </ul>
      <form action={addQuotation} className="mt-6 space-y-4">
        <input type="hidden" name="procurementId" value={row.id} />
        <Field label="Supplier, if one is approved" name="vendorId" as="select" options={[{ value: "", label: "None recorded" }, ...vendors.map((vendor) => ({ value: vendor.id, label: vendor.businessName }))]} />
        <Field label="Narrative" name="narrative" as="textarea" required />
        <Field label="Terms" name="terms" as="textarea" />
        <Field label="Status" name="status" as="select" options={QUOTATION_STATUSES.map((status) => ({ value: status, label: status }))} />
        <SubmitButton>Add quotation note</SubmitButton>
      </form>
    </div>
  );
}
