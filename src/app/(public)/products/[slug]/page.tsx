import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";
import { JsonLd } from "@/components/json-ld";
import { Paragraphs } from "@/components/rich-text";
import { Breadcrumbs, Container, StatusPill } from "@/components/ui";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/text";
import { getProductBySlug, getRelatedProducts } from "@/server/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return pageMeta(product.metaTitle || product.name, product.metaDescription || product.summary, `/products/${product.slug}`);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.categoryId, product.id);
  const image = product.images[0];
  const availability = AVAILABILITY_LABELS[product.availabilityStatus as keyof typeof AVAILABILITY_LABELS] || product.availabilityStatus;

  return (
    <article className="py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.summary,
          category: product.category.name,
          image: image ? `${siteUrl()}${image.url}` : undefined,
          brand: { "@type": "Organization", name: "AGRO PARKS SOLUTION PRIVATE LIMITED" },
        }}
      />
      <Container>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            { href: `/products?category=${product.category.slug}`, label: product.category.name },
            { label: product.name },
          ]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[360px] bg-line">
            {image ? <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" priority /> : null}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusPill>{availability}</StatusPill>
              {product.indicative ? <StatusPill>Indicative listing</StatusPill> : null}
            </div>
            <h1 className="mt-4 font-display text-5xl text-forest">{product.name}</h1>
            <p className="mt-4 text-lg text-muted">{product.summary}</p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="uppercase tracking-[0.14em] text-muted">Origin</dt>
                <dd className="mt-1">{product.originNote}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-muted">Quality</dt>
                <dd className="mt-1">{product.qualityNote}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-muted">Packaging</dt>
                <dd className="mt-1">{product.packagingNote}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-12 max-w-3xl">
          <h2 className="font-display text-3xl text-forest">Description</h2>
          <div className="mt-4">
            <Paragraphs text={product.description} />
          </div>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <EnquiryForm type="PRODUCT" productId={product.id} sourcePath={`/products/${product.slug}`} heading="Enquire about this produce" />
          <EnquiryForm
            type="BULK_PURCHASE"
            productId={product.id}
            sourcePath={`/products/${product.slug}`}
            allowed={["BULK_PURCHASE", "SOURCING", "INSTITUTIONAL"]}
            heading="Bulk enquiry"
          />
        </div>
        {related.length > 0 ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-forest">Related listings</h2>
            <ul className="mt-4 space-y-2">
              {related.map((item) => (
                <li key={item.id}>
                  <Link href={`/products/${item.slug}`} className="text-forest hover:text-leaf">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
