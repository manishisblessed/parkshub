import { moveStock, saveBatch, saveItem, saveWarehouse } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { parseFeatures } from "@/lib/features";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { getSettings } from "@/server/queries";

export default async function InventoryAdmin() {
  await requirePermission("inventory.manage");
  const settings = await getSettings();
  const enabled = parseFeatures(settings.featuresJson).inventory;
  const [warehouses, items, batches] = await Promise.all([
    prisma.warehouse.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } }),
    prisma.inventoryItem.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } }),
    prisma.inventoryBatch.findMany({ include: { item: true, warehouse: true }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl text-forest">Inventory and storage</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">{enabled ? "Record a location only when it exists or is genuinely planned." : "The inventory module is switched off in settings."} Public catalogue quantities are not taken from these batches.</p>
      </div>
      <ul className="text-sm">
        {warehouses.map((warehouse) => <li key={warehouse.id}>{warehouse.name} · {warehouse.kind} · {warehouse.status} · {warehouse.location}</li>)}
        {warehouses.length === 0 ? <li>No warehouses recorded.</li> : null}
      </ul>
      <form action={saveWarehouse} className="grid max-w-xl gap-3 border border-line bg-white p-4">
        <h2 className="font-display text-2xl">Warehouse or collection point</h2>
        <Field label="Name" name="name" required />
        <Field label="Location" name="location" required />
        <Field label="Kind" name="kind" as="select" options={["COLLECTION", "WAREHOUSE", "COLD_STORAGE"].map((value) => ({ value, label: value }))} />
        <Field label="Status" name="status" as="select" options={["PLANNED", "ACTIVE", "CLOSED"].map((value) => ({ value, label: value }))} />
        <Field label="Notes" name="notes" />
        <SubmitButton>Save location</SubmitButton>
      </form>
      <form action={saveItem} className="grid max-w-xl gap-3 border border-line bg-white p-4">
        <h2 className="font-display text-2xl">Item</h2>
        <Field label="SKU" name="sku" required />
        <Field label="Name" name="name" required />
        <Field label="Category" name="category" />
        <Field label="Unit" name="unit" required />
        <SubmitButton>Save item</SubmitButton>
      </form>
      <form action={saveBatch} className="grid max-w-xl gap-3 border border-line bg-white p-4">
        <h2 className="font-display text-2xl">Batch</h2>
        <Field label="Item" name="itemId" as="select" options={items.map((item) => ({ value: item.id, label: `${item.sku} · ${item.name}` }))} />
        <Field label="Warehouse" name="warehouseId" as="select" options={[{ value: "", label: "Unassigned" }, ...warehouses.map((item) => ({ value: item.id, label: item.name }))]} />
        <Field label="Batch number" name="batchNumber" required />
        <Field label="Source" name="sourceNote" />
        <Field label="Received on" name="receivedOn" placeholder="2026-11-01" />
        <Field label="Quantity" name="quantity" required />
        <Field label="Unit" name="unit" required />
        <Field label="Quality note" name="qualityNote" />
        <SubmitButton>Receive batch</SubmitButton>
      </form>
      <div className="space-y-4">
        {batches.map((batch) => (
          <form key={batch.id} action={moveStock} className="border border-line p-4 text-sm">
            <input type="hidden" name="batchId" value={batch.id} />
            <p className="font-medium">{batch.batchNumber} · {batch.item.name} · {batch.quantity} {batch.unit}</p>
            <p className="text-muted">{batch.warehouse?.name || "No location"} · {batch.sourceNote} · {batch.status}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <Field label="Movement" name="type" as="select" options={[{ value: "IN", label: "In" }, { value: "OUT", label: "Out" }, { value: "ADJUSTMENT", label: "Adjustment" }]} />
              <Field label="Quantity" name="quantity" />
              <Field label="Note" name="note" />
              <div className="self-end"><SubmitButton>Move</SubmitButton></div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
