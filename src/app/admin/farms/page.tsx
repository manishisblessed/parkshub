import Link from "next/link";
import { saveFarm } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { parseFeatures } from "@/lib/features";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { getSettings } from "@/server/queries";

export default async function FarmsAdmin() {
  await requirePermission("farms.manage");
  const settings = await getSettings();
  const enabled = parseFeatures(settings.featuresJson).farmOperations;
  const farms = await prisma.farm.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-forest">Farms</h1>
      {!enabled ? <p className="mt-3 text-sm text-muted">The farm module is switched off in settings. Existing records stay stored.</p> : null}
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {farms.map((farm) => (
          <li key={farm.id} className="py-3">
            <Link className="text-forest underline" href={`/admin/farms/${farm.id}`}>{farm.code} · {farm.name}</Link>
            <span className="ml-3 text-sm text-muted">{farm.status}</span>
          </li>
        ))}
        {farms.length === 0 ? <li className="py-4 text-sm text-muted">No farms recorded. Add one only when the land arrangement is real.</li> : null}
      </ul>
      <form action={saveFarm} className="mt-8 grid gap-4">
        <h2 className="font-display text-2xl text-forest">Register a farm</h2>
        <Field label="Name" name="name" required />
        <Field label="Code" name="code" required />
        <Field label="Location" name="location" required />
        <Field label="District" name="district" />
        <Field label="State" name="state" />
        <Field label="Area note" name="areaNote" />
        <Field label="Status" name="status" as="select" options={["DRAFT", "ACTIVE", "CLOSED"].map((value) => ({ value, label: value }))} />
        <Field label="Notes" name="notes" as="textarea" />
        <SubmitButton>Save farm</SubmitButton>
      </form>
    </div>
  );
}
