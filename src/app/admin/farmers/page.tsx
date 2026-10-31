import { setFarmerStatus } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { PARTNER_STATUSES } from "@/lib/constants";

export default async function FarmersAdmin() {
  await requirePermission("partners.manage");
  const rows = await prisma.farmer.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Farmers</h1>
      <div className="mt-6 space-y-6">
        {rows.map((row) => (
          <form key={row.id} action={setFarmerStatus} className="border border-line bg-white p-4 text-sm">
            <input type="hidden" name="id" value={row.id} />
            <p className="font-medium">{row.fullName} · {row.district}, {row.state}</p>
            <p className="text-muted">{row.email} · {row.phone}</p>
            <p className="mt-2">{row.crops}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-[200px_1fr_auto]">
              <Field label="Status" name="status" as="select" defaultValue={row.status} options={PARTNER_STATUSES.map((status) => ({ value: status, label: status }))} />
              <Field label="Review note" name="reviewNote" defaultValue={row.reviewNote} />
              <div className="self-end"><SubmitButton>Save</SubmitButton></div>
            </div>
          </form>
        ))}
        {rows.length === 0 ? <p className="text-sm text-muted">No farmer applications yet.</p> : null}
      </div>
    </div>
  );
}
