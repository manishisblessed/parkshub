import { saveCategory } from "@/server/actions/admin";
import { Field, Notice, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  await requirePermission("products.manage");
  const params = await searchParams;
  const categories = await prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl text-forest">Categories</h1>
      <div className="mt-4"><Notice code={params.notice} /></div>
      <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
        {categories.map((category) => (
          <li key={category.id} className="py-3">{category.name} · {category._count.products} products · {category.published ? "Published" : "Hidden"}</li>
        ))}
      </ul>
      <form action={saveCategory} className="mt-8 space-y-4">
        <h2 className="font-display text-2xl text-forest">Add a category</h2>
        <Field label="Name" name="name" required />
        <Field label="Description" name="description" as="textarea" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
        <SubmitButton>Add category</SubmitButton>
      </form>
    </div>
  );
}
