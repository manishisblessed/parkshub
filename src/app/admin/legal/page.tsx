import { saveLegal } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function LegalAdmin() {
  await requirePermission("content.manage");
  const documents = await prisma.legalDocument.findMany({ orderBy: { title: "asc" } });
  return (
    <div className="space-y-10">
      <h1 className="font-display text-4xl text-forest">Legal documents</h1>
      <p className="max-w-2xl text-sm text-muted">Drafts stay marked for review until you explicitly publish them. Publishing is an editorial action, not a legal opinion.</p>
      {documents.map((document) => (
        <form key={document.id} action={saveLegal} className="grid max-w-3xl gap-3 border-t border-line pt-6">
          <input type="hidden" name="id" value={document.id} />
          <Field label="Title" name="title" defaultValue={document.title} />
          <Field label="Status" name="status" as="select" defaultValue={document.status} options={[{ value: "DRAFT", label: "Draft for review" }, { value: "PUBLISHED", label: "Published" }]} />
          <Field label="Review note" name="reviewNote" as="textarea" defaultValue={document.reviewNote} />
          <Field label="Meta description" name="metaDescription" defaultValue={document.metaDescription} />
          <Field label="Body" name="body" as="textarea" defaultValue={document.body} />
          <SubmitButton>Save document</SubmitButton>
        </form>
      ))}
    </div>
  );
}
