import { saveProduct } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { PRODUCT_AVAILABILITY } from "@/lib/constants";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import type { Product, ProductImage } from "@prisma/client";

export async function ProductEditor({ product }: { product?: Product & { images: ProductImage[] } }) {
  await requirePermission("products.manage");
  const categories = await prisma.productCategory.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  const image = product?.images[0];
  return (
    <form action={saveProduct} className="grid max-w-3xl gap-4">
      <h1 className="font-display text-4xl text-forest">{product ? product.name : "New product"}</h1>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <Field label="Name" name="name" defaultValue={product?.name} required />
      <Field label="Category" name="categoryId" as="select" defaultValue={product?.categoryId} options={categories.map((item) => ({ value: item.id, label: item.name }))} />
      <Field label="Summary" name="summary" as="textarea" defaultValue={product?.summary} />
      <Field label="Description" name="description" as="textarea" defaultValue={product?.description} />
      <Field label="Origin note" name="originNote" as="textarea" defaultValue={product?.originNote} />
      <Field label="Quality note" name="qualityNote" as="textarea" defaultValue={product?.qualityNote} />
      <Field label="Packaging note" name="packagingNote" as="textarea" defaultValue={product?.packagingNote} />
      <Field label="Availability" name="availabilityStatus" as="select" defaultValue={product?.availabilityStatus || "ENQUIRY_ONLY"} options={PRODUCT_AVAILABILITY.map((item) => ({ value: item, label: item }))} />
      <Field label="Image path" name="image" defaultValue={image?.url} placeholder="/images/produce.jpg" />
      <Field label="Image alt text" name="imageAlt" defaultValue={image?.alt} />
      <Field label="SEO title" name="metaTitle" defaultValue={product?.metaTitle} />
      <Field label="SEO description" name="metaDescription" defaultValue={product?.metaDescription} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="indicative" defaultChecked={product?.indicative ?? true} /> Indicative listing</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={product?.published ?? false} /> Published</label>
      <SubmitButton>Save product</SubmitButton>
    </form>
  );
}
