import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, Container, SectionHeading } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { publishedVerticals } from "@/server/queries";

export const metadata = pageMeta(
  "Our business",
  "Cultivation, nursery, procurement, distribution, post-harvest care, storage, and agricultural support services of AGRO PARKS.",
  "/business",
);

export default async function BusinessPage() {
  const verticals = await publishedVerticals();

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
            Our business
          </p>
          <h1 className="hero-child-2 mt-3 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
            The work the company is authorised to do.
          </h1>
          <p className="hero-child-3 mt-5 max-w-2xl text-lg leading-8 text-white/75">
            These pages follow the objects in the memorandum. An authorised activity is not the same
            as a site that is already operating.
          </p>
          <div className="hero-child-4 mt-6">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "Our business" }]}
            />
          </div>
        </Container>
      </div>

      {/* Vertical cards */}
      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {verticals.map((vertical, i) => (
              <ScrollReveal key={vertical.id} className={`reveal stagger-${(i % 4) + 1}`}>
                <Link
                  href={`/business/${vertical.slug}`}
                  className="card-lift card-border-top group block overflow-hidden border border-line bg-white"
                >
                  {/* Image strip */}
                  <div className="relative aspect-[16/7] overflow-hidden bg-line">
                    <Image
                      src={vertical.image}
                      alt={vertical.imageAlt}
                      fill
                      className="object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-gold/80">
                        Authorised scope
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-display text-2xl text-forest transition-colors group-hover:text-leaf">
                      {vertical.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{vertical.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-gold transition-all duration-300 group-hover:gap-3">
                      Explore
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}
