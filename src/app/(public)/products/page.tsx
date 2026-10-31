import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, ButtonLink, Container, EmptyState, SectionHeading, StatusPill } from "@/components/ui";
import { AVAILABILITY_LABELS, type PRODUCT_AVAILABILITY } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { publishedCategories, searchProducts } from "@/server/queries";

export const metadata = pageMeta(
  "Agricultural products",
  "Indicative catalogue of cereals, rice, pulses, oilseeds, vegetables, fruits, spices, seeds, and other produce open for enquiry.",
  "/products",
);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const category = params.category || "";
  const page = Math.max(1, Number(params.page || 1) || 1);
  const pageSize = 12;
  const [categories, { products, total }] = await Promise.all([
    publishedCategories(),
    searchProducts({ q, category, page, pageSize }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <article>
      {/* Hero band */}
      <div
        className="relative overflow-hidden py-20 text-white"
        style={{
          background: "linear-gradient(160deg, #061810 0%, #0f3320 40%, #1a5232 100%)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c6a15b 25%, #e8c97a 50%, #c6a15b 75%, transparent)",
          }}
        />
        <Container>
          <p className="hero-child-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold/80">
            Products
          </p>
          <h1 className="hero-child-2 mt-3 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
            An enquiry catalogue, not a shop.
          </h1>
          <p className="hero-child-3 mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Listings describe produce the company is prepared to discuss. They do not state a price,
            a stock figure, or a certificate.
          </p>
          <div className="hero-child-4 mt-6 flex flex-wrap items-center gap-4">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "Products" }]}
            />
            <ButtonLink href="/buyers#bulk" variant="gold">
              Bulk enquiry
            </ButtonLink>
          </div>
        </Container>
      </div>

      <section className="py-16">
        <Container>
          {/* Filter bar */}
          <ScrollReveal className="reveal">
            <form
              className="flex flex-col gap-3 border border-line bg-white p-4 shadow-sm md:flex-row"
              action="/products"
            >
              <label className="flex-1 text-sm">
                <span className="sr-only">Search products</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search produce…"
                  className="field-enhanced h-12 w-full border border-line px-3 text-ink outline-none"
                />
              </label>
              <label className="text-sm md:w-64">
                <span className="sr-only">Category</span>
                <select
                  name="category"
                  defaultValue={category}
                  className="field-enhanced h-12 w-full border border-line bg-white px-3"
                >
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="btn-shimmer h-12 bg-forest px-6 text-sm font-medium text-white transition-colors hover:bg-leaf"
              >
                Filter
              </button>
            </form>
          </ScrollReveal>

          <p className="mt-4 text-sm text-muted">
            {total} indicative listing{total === 1 ? "" : "s"}
          </p>

          {products.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No listings match."
                body="Try another word, or send a sourcing enquiry and name the crop in your own words."
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => {
                const image = product.images[0];
                const label =
                  AVAILABILITY_LABELS[
                    product.availabilityStatus as (typeof PRODUCT_AVAILABILITY)[number]
                  ] || product.availabilityStatus;
                return (
                  <ScrollReveal key={product.id} className={`reveal stagger-${(i % 6) + 1}`}>
                    <article className="card-lift card-border-top group border border-line bg-white overflow-hidden">
                      <Link href={`/products/${product.slug}`}>
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-line">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(min-width: 1024px) 33vw, 50vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-line" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                              </svg>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2">
                            <StatusPill>{product.indicative ? "Indicative" : label}</StatusPill>
                          </div>
                        </div>
                        {/* Content */}
                        <div className="p-5">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                            {product.category.name}
                          </p>
                          <h2 className="mt-1 font-display text-2xl text-forest transition-colors group-hover:text-leaf">
                            {product.name}
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-muted">{product.summary}</p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-gold transition-all duration-300 group-hover:gap-3">
                            View details →
                          </span>
                        </div>
                      </Link>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 ? (
            <nav className="mt-12 flex gap-4 text-sm" aria-label="Pagination">
              {page > 1 ? (
                <Link
                  href={`/products?q=${encodeURIComponent(q)}&category=${category}&page=${page - 1}`}
                  className="underline-grow text-forest"
                >
                  ← Previous
                </Link>
              ) : null}
              <span className="text-muted">
                Page {page} of {pageCount}
              </span>
              {page < pageCount ? (
                <Link
                  href={`/products?q=${encodeURIComponent(q)}&category=${category}&page=${page + 1}`}
                  className="underline-grow text-forest"
                >
                  Next →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </Container>
      </section>
    </article>
  );
}
