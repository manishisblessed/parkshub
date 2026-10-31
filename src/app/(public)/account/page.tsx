import Link from "next/link";
import { addProduceForm, createProcurementForm } from "@/server/actions/public";
import { Field, Notice, SubmitButton } from "@/components/ui";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { formatDateTime } from "@/lib/text";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const [farmer, buyer, vendor, enquiries] = await Promise.all([
    prisma.farmer.findUnique({ where: { userId: user.id }, include: { produce: { orderBy: { createdAt: "desc" } } } }),
    prisma.buyer.findUnique({ where: { userId: user.id }, include: { procurement: { orderBy: { createdAt: "desc" }, take: 10 } } }),
    prisma.vendor.findUnique({ where: { userId: user.id } }),
    prisma.enquiry.findMany({ where: { email: user.email, deletedAt: null }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="text-xs uppercase tracking-[0.16em] text-leaf">{user.roles.join(", ") || "Account"}</p>
      <h1 className="mt-2 font-display text-5xl text-forest">Hello, {user.name}</h1>
      <div className="mt-4">
        <Notice code={params.notice} />
      </div>
      {user.permissions.length > 0 ? (
        <p className="mt-4">
          <Link href="/admin" className="text-forest underline">
            Open the admin dashboard
          </Link>
        </p>
      ) : null}

      {farmer ? (
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-3xl text-forest">Farmer application</h2>
          <p>Status: {farmer.status}. Partnership review is separate from email verification.</p>
          <p className="text-sm text-muted">{farmer.crops}</p>
          <h3 className="pt-4 font-display text-2xl text-forest">Produce interest</h3>
          <ul className="space-y-2 text-sm">
            {farmer.produce.map((item) => (
              <li key={item.id}>
                {item.crop} · {item.quantityNote || "Quantity to be discussed"} · {item.status}
              </li>
            ))}
            {farmer.produce.length === 0 ? <li>No produce notes yet.</li> : null}
          </ul>
          <form action={addProduceForm} className="grid gap-4 border border-line bg-white p-5 md:grid-cols-2">
            <Field label="Crop" name="crop" required />
            <Field label="Harvest window" name="harvestWindow" />
            <Field label="Location" name="location" />
            <Field label="Quantity note" name="quantityNote" />
            <div className="md:col-span-2">
              <SubmitButton>Save produce note</SubmitButton>
            </div>
          </form>
        </section>
      ) : null}

      {buyer ? (
        <section className="mt-10 space-y-4">
          <h2 className="font-display text-3xl text-forest">Buyer application</h2>
          <p>
            {buyer.organisation} · {buyer.buyerType} · {buyer.status}
          </p>
          <ul className="space-y-2 text-sm">
            {buyer.procurement.map((item) => (
              <li key={item.id}>
                {item.reference} · {item.productName} · {item.status}
              </li>
            ))}
          </ul>
          <form action={createProcurementForm} className="grid gap-4 border border-line bg-white p-5">
            <input type="hidden" name="organisation" value={buyer.organisation} />
            <input type="hidden" name="contactName" value={buyer.contactName} />
            <input type="hidden" name="email" value={buyer.email} />
            <input type="hidden" name="phone" value={buyer.phone} />
            <Field label="Produce" name="productName" required />
            <Field label="Quantity note" name="quantityNote" required />
            <Field label="Delivery note" name="deliveryNote" />
            <Field label="Details" name="details" as="textarea" required />
            <SubmitButton>Submit procurement request</SubmitButton>
          </form>
        </section>
      ) : null}

      {vendor ? (
        <section className="mt-10">
          <h2 className="font-display text-3xl text-forest">Supplier application</h2>
          <p className="mt-2">
            {vendor.businessName} · {vendor.status}
          </p>
          <p className="mt-2 text-sm text-muted">{vendor.supplyNote}</p>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-3xl text-forest">Enquiries from your email</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
          {enquiries.map((item) => (
            <li key={item.id} className="py-3">
              {item.reference} · {item.subject} · {item.status} · {formatDateTime(item.createdAt)}
            </li>
          ))}
          {enquiries.length === 0 ? <li className="py-3">No enquiries yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
