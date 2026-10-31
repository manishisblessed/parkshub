import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/product-editor";
import { prisma } from "@/server/db";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({ where: { id, deletedAt: null }, include: { images: true } });
  if (!product) notFound();
  return <ProductEditor product={product} />;
}
