import { saveSection } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function PagesAdmin({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePermission("content.manage");
  const params = await searchParams;
  const pages = await prisma.page.findMany({ include: { sections: { orderBy: { sortOrder: "asc" } } }, orderBy: { title: "asc" } });
  const current = pages.find((page) => page.slug === params.page) || pages[0];
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Website pages</h1>
      <div className="mt-4 flex gap-4 text-sm">
        {pages.map((page) => (
          <a key={page.id} href={`/admin/pages?page=${page.slug}`} className={current?.id === page.id ? "text-forest underline" : "text-muted"}>
            {page.title}
          </a>
        ))}
      </div>
      <div className="mt-8 space-y-8">
        {current?.sections.map((section) => (
          <form key={section.id} action={saveSection} className="grid max-w-3xl gap-3 border-t border-line pt-4">
            <input type="hidden" name="id" value={section.id} />
            <input type="hidden" name="slug" value={current.slug} />
            <Field label="Heading" name="heading" defaultValue={section.heading} />
            <Field label="Body" name="body" as="textarea" defaultValue={section.body} />
            <label className="text-sm"><input type="checkbox" name="published" defaultChecked={section.published} /> Published</label>
            <SubmitButton>Save section</SubmitButton>
          </form>
        ))}
      </div>
    </div>
  );
}
