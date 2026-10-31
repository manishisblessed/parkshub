import { notFound } from "next/navigation";
import { addCrop, addCropNote, addExpense, addPlot, saveFarm } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function FarmDetail({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("farms.manage");
  const { id } = await params;
  const farm = await prisma.farm.findFirst({
    where: { id, deletedAt: null },
    include: {
      expenses: { orderBy: { createdAt: "desc" } },
      plots: { include: { crops: { include: { irrigation: true, inputs: true, harvests: true } } } },
    },
  });
  if (!farm) notFound();
  return (
    <div className="max-w-3xl space-y-10">
      <form action={saveFarm} className="grid gap-4">
        <h1 className="font-display text-4xl text-forest">{farm.name}</h1>
        <input type="hidden" name="id" value={farm.id} />
        <Field label="Name" name="name" defaultValue={farm.name} />
        <Field label="Code" name="code" defaultValue={farm.code} />
        <Field label="Location" name="location" defaultValue={farm.location} />
        <Field label="District" name="district" defaultValue={farm.district} />
        <Field label="State" name="state" defaultValue={farm.state} />
        <Field label="Area note" name="areaNote" defaultValue={farm.areaNote} />
        <Field label="Status" name="status" as="select" defaultValue={farm.status} options={["DRAFT", "ACTIVE", "CLOSED"].map((value) => ({ value, label: value }))} />
        <Field label="Notes" name="notes" as="textarea" defaultValue={farm.notes} />
        <SubmitButton>Update farm</SubmitButton>
      </form>
      <form action={addPlot} className="grid gap-3 border border-line bg-white p-4">
        <h2 className="font-display text-2xl text-forest">Add a plot</h2>
        <input type="hidden" name="farmId" value={farm.id} />
        <Field label="Plot name" name="name" required />
        <Field label="Area note" name="areaNote" />
        <Field label="Soil note" name="soilNote" />
        <SubmitButton>Add plot</SubmitButton>
      </form>
      {farm.plots.map((plot) => (
        <section key={plot.id} className="border-t border-line pt-6">
          <h2 className="font-display text-2xl text-forest">{plot.name}</h2>
          <p className="text-sm text-muted">{plot.areaNote} {plot.soilNote}</p>
          {plot.crops.map((crop) => (
            <div key={crop.id} className="mt-4 text-sm">
              <p className="font-medium">{crop.crop} · {crop.season} · {crop.status}</p>
              <p>Irrigation records: {crop.irrigation.length}. Input records: {crop.inputs.length}. Harvest records: {crop.harvests.length}.</p>
              <form action={addCropNote} className="mt-3 grid gap-3 md:grid-cols-2">
                <input type="hidden" name="cropId" value={crop.id} />
                <input type="hidden" name="farmId" value={farm.id} />
                <Field label="Record type" name="kind" as="select" options={[{ value: "irrigation", label: "Irrigation" }, { value: "input", label: "Input" }, { value: "harvest", label: "Harvest" }]} />
                <Field label="Date" name="date" placeholder="2026-11-01" />
                <Field label="Method or input" name="method" />
                <Field label="Quantity note" name="quantityNote" />
                <Field label="Unit" name="unit" />
                <Field label="Notes" name="notes" />
                <SubmitButton>Add record</SubmitButton>
              </form>
            </div>
          ))}
          <form action={addCrop} className="mt-4 grid gap-3">
            <input type="hidden" name="plotId" value={plot.id} />
            <input type="hidden" name="farmId" value={farm.id} />
            <Field label="Crop" name="crop" />
            <Field label="Season" name="season" />
            <Field label="Sowing date" name="sowingDate" />
            <Field label="Status" name="status" as="select" options={["PLANNED", "SOWN", "GROWING", "HARVESTED"].map((value) => ({ value, label: value }))} />
            <Field label="Notes" name="notes" />
            <SubmitButton>Add crop</SubmitButton>
          </form>
        </section>
      ))}
      <form action={addExpense} className="grid gap-3 border border-line p-4">
        <h2 className="font-display text-2xl text-forest">Expense note</h2>
        <input type="hidden" name="farmId" value={farm.id} />
        <Field label="Date" name="date" />
        <Field label="Category" name="category" />
        <Field label="Amount note" name="amountNote" />
        <Field label="Notes" name="notes" />
        <SubmitButton>Add expense</SubmitButton>
      </form>
      <ul className="text-sm">
        {farm.expenses.map((expense) => (
          <li key={expense.id}>{expense.date} · {expense.category} · {expense.amountNote}</li>
        ))}
      </ul>
    </div>
  );
}
