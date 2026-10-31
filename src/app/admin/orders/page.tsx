import { saveOrderStatus } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { ORDER_STATUSES } from "@/lib/constants";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function OrdersAdmin() {
  await requirePermission("enquiries.manage");
  const rows = await prisma.orderEnquiry.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Order enquiries</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">These records track a request. They are not invoices, and they do not collect payment.</p>
      <div className="mt-6 space-y-6">
        {rows.map((row) => (
          <form key={row.id} action={saveOrderStatus} className="border border-line bg-white p-4 text-sm">
            <input type="hidden" name="id" value={row.id} />
            <p className="font-medium">{row.reference} · {row.organisation}</p>
            <p className="mt-2 whitespace-pre-wrap">{row.itemsSummary}</p>
            <div className="mt-3 grid gap-3">
              <Field label="Status" name="status" as="select" defaultValue={row.status} options={ORDER_STATUSES.map((status) => ({ value: status, label: status }))} />
              <Field label="Notes" name="notes" as="textarea" defaultValue={row.notes} />
              <SubmitButton>Save</SubmitButton>
            </div>
          </form>
        ))}
        {rows.length === 0 ? <p className="text-sm text-muted">No order enquiries yet. Open one from an enquiry.</p> : null}
      </div>
    </div>
  );
}
