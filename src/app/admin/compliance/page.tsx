import { saveCompliance } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ComplianceAdmin() {
  await requirePermission("compliance.manage");
  const rows = await prisma.complianceRecord.findMany({ where: { deletedAt: null }, orderBy: { title: "asc" } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-forest">Compliance records</h1>
      <p className="mt-2 text-sm text-muted">Store registrations that have actually been issued, with an expiry date where one exists. Do not add a certificate in order to display a badge.</p>
      <ul className="mt-6 space-y-3 text-sm">
        {rows.map((row) => (
          <li key={row.id} className="border border-line p-3">
            <p className="font-medium">{row.title} · {row.status}</p>
            <p>{row.authority} {row.referenceNo ? `· ${row.referenceNo}` : ""}</p>
            <p className="text-muted">Issued {row.issuedOn || "—"} · Expires {row.expiresOn || "—"}</p>
            <p className="mt-2">{row.notes}</p>
          </li>
        ))}
      </ul>
      <form action={saveCompliance} className="mt-8 grid gap-3">
        <h2 className="font-display text-2xl text-forest">Add a record</h2>
        <Field label="Title" name="title" required />
        <Field label="Authority" name="authority" required />
        <Field label="Reference" name="referenceNo" />
        <Field label="Issued on" name="issuedOn" placeholder="2026-10-05" />
        <Field label="Expires on" name="expiresOn" />
        <Field label="Status" name="status" as="select" options={["RECORDED", "ACTIVE", "EXPIRED", "NOT_REQUIRED"].map((value) => ({ value, label: value }))} />
        <Field label="Notes" name="notes" as="textarea" />
        <SubmitButton>Save record</SubmitButton>
      </form>
    </div>
  );
}
