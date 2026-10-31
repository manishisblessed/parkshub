import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BulletList, Paragraphs } from "@/components/rich-text";
import { Breadcrumbs, ButtonLink, Container, ScopeNote, StatusPill } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { getVerticalBySlug, getRelatedVerticals } from "@/server/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vertical = await getVerticalBySlug(slug);
  if (!vertical) return {};
  return pageMeta(
    vertical.metaTitle || vertical.title,
    vertical.metaDescription || vertical.summary,
    `/business/${vertical.slug}`,
    vertical.image,
  );
}

export default async function VerticalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vertical = await getVerticalBySlug(slug);
  if (!vertical) notFound();

  const related = await getRelatedVerticals(vertical.id);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Our business", item: "/business" },
            { "@type": "ListItem", position: 3, name: vertical.title, item: `/business/${vertical.slug}` },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[500px] overflow-hidden bg-[#061810] text-white">
        <Image
          src={vertical.image}
          alt={vertical.imageAlt}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to top,
              rgba(6,24,16,0.96) 0%,
              rgba(18,61,43,0.70) 40%,
              rgba(26,82,50,0.25) 70%,
              transparent 100%
            )`,
          }}
        />
        {/* Gold top line */}
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c6a15b 25%, #e8c97a 50%, #c6a15b 75%, transparent)",
          }}
        />

        <Container className="relative flex min-h-[500px] flex-col justify-end py-14">
          <div className="hero-child-1">
            <Breadcrumbs
              light
              items={[
                { href: "/", label: "Home" },
                { href: "/business", label: "Our business" },
                { label: vertical.title },
              ]}
            />
          </div>
          <div className="hero-child-2 mt-6">
            <StatusPill>Authorised scope · enquiry open</StatusPill>
          </div>
          <h1 className="hero-child-3 mt-4 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
            {vertical.title}
          </h1>
          <p className="hero-child-4 mt-5 max-w-2xl text-lg leading-8 text-white/80">
            {vertical.summary}
          </p>
        </Container>
      </section>

      {/* Content grid */}
      <Container className="grid gap-14 py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-12">
          <ScrollReveal>
            <section>
              <h2 className="font-display text-3xl text-forest">Overview</h2>
              <div className="mt-4 text-[1.05rem] leading-8 text-muted">
                <Paragraphs text={vertical.overview} />
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal className="reveal stagger-2">
            <section>
              <h2 className="font-display text-3xl text-forest">Capabilities</h2>
              <div className="mt-4">
                <BulletList text={vertical.capabilities} />
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal className="reveal stagger-3">
            <section>
              <h2 className="font-display text-3xl text-forest">Why it is structured this way</h2>
              <div className="mt-4">
                <BulletList text={vertical.benefits} />
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal className="reveal stagger-4">
            <ScopeNote>{vertical.availabilityNote}</ScopeNote>
          </ScrollReveal>
        </div>

        <div className="space-y-8">
          <ScrollReveal className="reveal-right">
            <EnquiryForm
              type="BUSINESS"
              sourcePath={`/business/${vertical.slug}`}
              heading="Enquire about this business"
            />
          </ScrollReveal>

          {related.length > 0 ? (
            <ScrollReveal className="reveal-right stagger-2">
              <div>
                <h2 className="font-display text-2xl text-forest">Related</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/business/${item.slug}`}
                        className="underline-grow text-forest transition-colors hover:text-leaf"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <ButtonLink href="/contact" variant="secondary">
                    Contact us
                  </ButtonLink>
                </div>
              </div>
            </ScrollReveal>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
