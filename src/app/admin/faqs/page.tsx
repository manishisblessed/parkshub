import { deleteFaq, saveFaq } from "@/server/actions/admin";
import { ConfirmForm } from "@/components/confirm-form";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function FaqsAdmin() {
  await requirePermission("content.manage");
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="font-display text-4xl text-forest">FAQs</h1>
      {faqs.map((faq) => (
        <div key={faq.id} className="border-t border-line pt-4">
          <form action={saveFaq} className="grid gap-3">
            <input type="hidden" name="id" value={faq.id} />
            <Field label="Question" name="question" defaultValue={faq.question} />
            <Field label="Answer" name="answer" as="textarea" defaultValue={faq.answer} />
            <Field label="Sort" name="sortOrder" defaultValue={String(faq.sortOrder)} />
            <label className="text-sm"><input type="checkbox" name="published" defaultChecked={faq.published} /> Published</label>
            <SubmitButton>Save</SubmitButton>
          </form>
          <ConfirmForm message="Delete this question?" action={deleteFaq}>
            <input type="hidden" name="id" value={faq.id} />
            <button type="submit" className="mt-2 text-sm text-[#8c3a32]">Delete</button>
          </ConfirmForm>
        </div>
      ))}
      <form action={saveFaq} className="grid gap-3">
        <h2 className="font-display text-2xl text-forest">New question</h2>
        <Field label="Question" name="question" required />
        <Field label="Answer" name="answer" as="textarea" required />
        <Field label="Sort" name="sortOrder" defaultValue="20" />
        <label className="text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
        <SubmitButton>Add</SubmitButton>
      </form>
    </div>
  );
}
