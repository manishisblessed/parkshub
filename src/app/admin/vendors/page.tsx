import { setVendorStatus } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { PARTNER_STATUSES } from "@/lib/constants";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function VendorsAdmin() {
  await requirePermission("partners.manage");
  const rows = await prisma.vendor.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Vendors</h1>
      <div className="mt-6 space-y-6">
        {rows.map((row) => (
          <form key={row.id} action={setVendorStatus} className="border border-line bg-white p-4 text-sm">
            <input type="hidden" name="id" value={row.id} />
            <p className="font-medium">{row.businessName}</p>
            <p className="text-muted">{row.contactName} · {row.email} {row.gstin ? `· ${row.gstin}` : ""}</p>
            <p className="mt-2">{row.supplyNote}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-[200px_1fr_auto]">
              <Field label="Status" name="status" as="select" defaultValue={row.status} options={PARTNER_STATUSES.map((status) => ({ value: status, label: status }))} />
              <Field label="Review note" name="reviewNote" defaultValue={row.reviewNote} />
              <div className="self-end"><SubmitButton>Save</SubmitButton></div>
            </div>
          </form>
        ))}
        {rows.length === 0 ? <p className="text-sm text-muted">No supplier applications yet.</p> : null}
      </div>
    </div>
  );
}
