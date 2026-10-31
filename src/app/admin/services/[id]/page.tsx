import { notFound } from "next/navigation";
import { saveService } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ServiceEdit({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("content.manage");
  const { id } = await params;
  const item = await prisma.service.findFirst({ where: { id, deletedAt: null } });
  if (!item) notFound();
  return (
    <form action={saveService} className="grid max-w-3xl gap-4">
      <h1 className="font-display text-4xl text-forest">{item.title}</h1>
      <input type="hidden" name="id" value={item.id} />
      <Field label="Title" name="title" defaultValue={item.title} />
      <Field label="Summary" name="summary" as="textarea" defaultValue={item.summary} />
      <Field label="Overview" name="overview" as="textarea" defaultValue={item.overview} />
      <Field label="Scope note" name="scopeNote" as="textarea" defaultValue={item.scopeNote} />
      <Field label="Availability" name="availability" as="select" defaultValue={item.availability} options={[{ value: "ON_ENQUIRY", label: "On enquiry" }, { value: "PLANNED", label: "Planned" }, { value: "LIMITED", label: "Limited" }]} />
      <Field label="Image path" name="image" defaultValue={item.image} />
      <Field label="Image alt" name="imageAlt" defaultValue={item.imageAlt} />
      <Field label="Sort" name="sortOrder" defaultValue={String(item.sortOrder)} />
      <Field label="SEO title" name="metaTitle" defaultValue={item.metaTitle} />
      <Field label="SEO description" name="metaDescription" defaultValue={item.metaDescription} />
      <label className="text-sm"><input type="checkbox" name="published" defaultChecked={item.published} /> Published</label>
      <SubmitButton>Save service</SubmitButton>
    </form>
  );
}
