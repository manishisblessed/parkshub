import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/enquiry-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Paragraphs } from "@/components/rich-text";
import { Breadcrumbs, Container, ScopeNote } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { prisma } from "@/server/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findFirst({ where: { slug, published: true, deletedAt: null } });
  if (!service) return {};
  return pageMeta(service.metaTitle, service.metaDescription, `/services/${service.slug}`, service.image);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findFirst({
    where: { slug, published: true, deletedAt: null },
  });
  if (!service) notFound();

  const related = await prisma.service.findMany({
    where: { published: true, deletedAt: null, NOT: { id: service.id } },
    take: 4,
    orderBy: { sortOrder: "asc" },
  });

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[460px] overflow-hidden bg-[#061810] text-white">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          className="object-cover opacity-50"
          sizes="100vw"
          priority
        />
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
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c6a15b 25%, #e8c97a 50%, #c6a15b 75%, transparent)",
          }}
        />

        <Container className="relative flex min-h-[460px] flex-col justify-end py-14">
          <div className="hero-child-1">
            <Breadcrumbs
              light
              items={[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { label: service.title },
              ]}
            />
          </div>
          <h1 className="hero-child-2 mt-5 font-display text-5xl leading-tight md:text-6xl">
            {service.title}
          </h1>
          <p className="hero-child-3 mt-4 max-w-2xl text-lg leading-8 text-white/80">
            {service.summary}
          </p>
        </Container>
      </section>

      {/* Content */}
      <Container className="grid gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <ScrollReveal>
            <div className="text-[1.05rem] leading-8 text-muted">
              <Paragraphs text={service.overview} />
            </div>
          </ScrollReveal>

          <ScrollReveal className="reveal stagger-2">
            <ScopeNote>
              Availability: offered on enquiry. {service.scopeNote} This page does not confirm a
              crew, a machine, or a date.
            </ScopeNote>
          </ScrollReveal>

          {related.length > 0 ? (
            <ScrollReveal className="reveal stagger-3">
              <div>
                <h2 className="font-display text-2xl text-forest">Other services</h2>
                <ul className="mt-4 space-y-2.5">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/services/${item.slug}`}
                        className="underline-grow text-forest transition-colors hover:text-leaf"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ) : null}
        </div>

        <ScrollReveal className="reveal-right">
          <EnquiryForm
            type="SERVICE"
            sourcePath={`/services/${service.slug}`}
            heading="Request this service"
          />
        </ScrollReveal>
      </Container>
    </article>
  );
}
