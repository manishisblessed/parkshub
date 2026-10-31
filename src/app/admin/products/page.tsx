import Link from "next/link";
import { archiveProduct } from "@/server/actions/admin";
import { ConfirmForm } from "@/components/confirm-form";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function ProductsAdminPage() {
  await requirePermission("products.manage");
  const products = await prisma.product.findMany({ where: { deletedAt: null }, include: { category: true }, orderBy: { name: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-forest">Products</h1>
        <Link href="/admin/products/new" className="bg-forest px-4 py-2 text-sm text-white">New product</Link>
      </div>
      <p className="mt-2 text-sm text-muted">Indicative listings have no price. Publishing a product does not create stock.</p>
      <table className="mt-6 w-full text-left text-sm">
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-line">
              <td className="py-3">
                <Link href={`/admin/products/${product.id}`} className="text-forest underline">{product.name}</Link>
                <span className="block text-muted">{product.category.name} · {product.published ? "Published" : "Draft"} · {product.availabilityStatus}</span>
              </td>
              <td className="text-right">
                <ConfirmForm message="Archive this product?" action={archiveProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className="text-sm text-[#8c3a32]">Archive</button>
                </ConfirmForm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
