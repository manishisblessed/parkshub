import { notFound } from "next/navigation";
import { openOrderFromEnquiry, replyEnquiry, setEnquiryStatus } from "@/server/actions/admin";
import { Field, Notice, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { formatDateTime } from "@/lib/text";
import { ENQUIRY_STATUSES } from "@/lib/constants";

export default async function EnquiryDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  await requirePermission("enquiries.manage");
  const { id } = await params;
  const query = await searchParams;
  const enquiry = await prisma.enquiry.findFirst({ where: { id, deletedAt: null }, include: { product: true, messages: { include: { author: true }, orderBy: { createdAt: "asc" } } } });
  if (!enquiry) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-forest">{enquiry.reference}</h1>
      <div className="mt-4">
        <Notice code={query.notice} />
      </div>
      <dl className="mt-6 space-y-2 text-sm">
        <div>{enquiry.name} {enquiry.company ? `· ${enquiry.company}` : ""}</div>
        <div>{enquiry.email} · {enquiry.phone}</div>
        <div>{enquiry.type} · {enquiry.status}</div>
        <div className="pt-2 font-medium">{enquiry.subject}</div>
        <p className="whitespace-pre-wrap">{enquiry.message}</p>
        {enquiry.product ? <p>Product: {enquiry.product.name}</p> : null}
      </dl>
      <form action={setEnquiryStatus} className="mt-6 flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={enquiry.id} />
        <Field label="Status" name="status" as="select" defaultValue={enquiry.status} options={ENQUIRY_STATUSES.map((status) => ({ value: status, label: status }))} />
        <SubmitButton>Update status</SubmitButton>
      </form>
      <h2 className="mt-10 font-display text-2xl text-forest">Messages</h2>
      <ul className="mt-4 space-y-4">
        {enquiry.messages.map((message) => (
          <li key={message.id} className="border border-line bg-white p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{message.internal ? "Internal" : "Reply"} · {message.author?.name || "Staff"} · {formatDateTime(message.createdAt)}</p>
            <p className="mt-2 whitespace-pre-wrap">{message.body}</p>
          </li>
        ))}
      </ul>
      <form action={replyEnquiry} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={enquiry.id} />
        <Field label="Reply or note" name="body" as="textarea" required />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="internal" /> Internal note (not emailed)
        </label>
        <SubmitButton>Save message</SubmitButton>
      </form>
      <form action={openOrderFromEnquiry} className="mt-8">
        <input type="hidden" name="id" value={enquiry.id} />
        <button type="submit" className="text-sm text-forest underline">
          Open an order enquiry from this message
        </button>
      </form>
    </div>
  );
}
