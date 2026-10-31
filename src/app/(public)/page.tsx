import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/text";
import { getSettings, publishedPosts, publishedServices, publishedVerticals } from "@/server/queries";

export const metadata = pageMeta(
  "Agriculture company in India",
  "AGRO PARKS SOLUTION PRIVATE LIMITED is a New Delhi company for cultivation, nursery, agricultural procurement, distribution, post-harvest care, and farm support services.",
  "/",
);

/* ── Objective icons (SVG inline — no external library) ─────────────── */
const icons: Record<string, React.ReactNode> = {
  cultivation: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 3v9l4-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  seed: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="4" ry="7" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M12 5C9 3 5 5 5 9c0 3 2 5 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  supply: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M16 7V5a4 4 0 0 0-8 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  consulting: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

const COMPANY_OBJECTIVES = [
  { icon: icons.cultivation, label: "Cultivation & crop growing", text: "Authorised to cultivate all major crops — cereals, pulses, vegetables, fruits, spices, and flowers — on owned or leased land." },
  { icon: icons.seed, label: "Nursery & seed production", text: "Establishment of nurseries and seed farms; production and sale of certified planting material under statutory rules." },
  { icon: icons.supply, label: "Procurement & distribution", text: "Direct procurement from farm-gate, grading, cold-chain handling, and distribution to institutional buyers." },
  { icon: icons.consulting, label: "Technology & consulting", text: "Farm advisory, precision-agriculture technology deployment, and knowledge transfer to partner growers." },
  { icon: icons.supply, label: "Agro-processing", text: "Post-harvest cleaning, grading, primary processing, and packaging of agricultural commodities." },
  { icon: icons.cultivation, label: "Exports & trade", text: "Exports of agricultural produce in compliance with APEDA and FSSAI guidelines; domestic wholesale trading." },
  { icon: icons.seed, label: "Contract farming & collaboration", text: "Written contract-farming arrangements with individual and group farmers under applicable state regulations." },
];

export default async function HomePage() {
  const [settings, verticals, services, posts] = await Promise.all([
    getSettings(),
    publishedVerticals(),
    publishedServices(),
    publishedPosts(3),
  ]);
  const url = siteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: settings.legalName,
          url,
          email: settings.email,
          identifier: settings.cin,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Plot No. 8, Sector-14, Dwarka City Centre, Amberhai",
            addressLocality: "New Delhi",
            addressRegion: "Delhi",
            postalCode: "110075",
            addressCountry: "IN",
          },
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-[92vh] overflow-hidden bg-[#061810] text-white">
        {/* Background image */}
        <Image
          src="/images/hero-landscape.jpg"
          alt="Illustrative photograph of open farmland. This is not an AGRO PARKS farm."
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />

        {/* Multi-stop gradient — sky to rich earth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to top,
              rgba(6,24,16,0.97) 0%,
              rgba(12,40,28,0.82) 28%,
              rgba(18,61,43,0.55) 55%,
              rgba(26,82,50,0.20) 78%,
              transparent 100%
            )`,
          }}
        />

        {/* Side vignettes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(6,24,16,0.5) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(6,24,16,0.5) 0%, transparent 50%)",
          }}
        />

        {/* Gold accent top line */}
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c6a15b 25%, #e8c97a 50%, #c6a15b 75%, transparent)",
          }}
        />

        <Container className="relative flex min-h-[92vh] flex-col justify-end pb-20 pt-32">
          <p className="hero-child-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold/90">
            {settings.heroEyebrow}
          </p>

          <h1 className="hero-child-2 mt-4 max-w-4xl font-display text-5xl leading-[1.04] md:text-[4.5rem]">
            {settings.heroTitle}
          </h1>

          <p className="hero-child-3 mt-6 max-w-2xl text-lg leading-8 text-white/80">
            {settings.heroLede}
          </p>

          <div className="hero-child-4 mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/business" variant="gold">
              Explore our business
            </ButtonLink>
            <ButtonLink href="/services" variant="inverse">
              Our services
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverse">
              Contact us
            </ButtonLink>
          </div>

          {/* Scroll cue */}
          <div className="hero-child-5 mt-14 flex items-center gap-3">
            <div className="scroll-bounce text-white/35">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">
              Scroll to discover
            </span>
          </div>

          {/* Disclaimer */}
          <p className="hero-child-5 mt-5 text-[11px] uppercase tracking-[0.12em] text-white/30">
            Illustrative photograph · not AGRO PARKS land
          </p>
        </Container>
      </section>

      {/* Public notice (if set) */}
      {settings.publicNotice ? (
        <div className="border-b border-line bg-gold/10">
          <Container className="py-4 text-sm leading-6 text-forest">
            {settings.publicNotice}
          </Container>
        </div>
      ) : null}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COMPANY INTRO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, #f8faf6 0%, #ecf3e8 100%)" }}>
        <Container className="grid gap-14 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <ScrollReveal className="reveal-left">
            <SectionHeading eyebrow="The company" title={settings.introHeading} />
          </ScrollReveal>

          <ScrollReveal className="reveal-right">
            <div className="space-y-5 text-lg leading-8 text-muted">
              {settings.introBody.split("\n\n").map((paragraph: string) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </ScrollReveal>
        </Container>

        {/* Company identity stats */}
        <Container className="mt-16">
          <div className="grid border border-line bg-white/70 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Incorporated", settings.incorporationDate],
                ["CIN", settings.cin],
                ["GSTIN", settings.gstin],
                ["Registered office", "New Delhi 110075"],
              ] as [string, string][]
            ).map(([label, value], i) => (
              <ScrollReveal
                key={label}
                className={`reveal stagger-${i + 1} border-line px-6 py-7 lg:border-l lg:first:border-l-0`}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
                <p className="count-pop mt-2 font-display text-xl leading-snug text-forest">{value}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BUSINESS VERTICALS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <Container>
          <ScrollReveal>
            <SectionHeading
              eyebrow="Business"
              title="Twelve authorised lines of work."
              lede="Each page describes an object of the company. It also says what is still subject to land, licence, and a written enquiry."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {verticals.map((vertical, index) => (
              <ScrollReveal
                key={vertical.id}
                className={`reveal stagger-${(index % 6) + 1}`}
              >
                <Link
                  href={`/business/${vertical.slug}`}
                  className="card-lift card-border-top group block overflow-hidden border border-line bg-white p-6 transition-colors hover:border-leaf/30"
                >
                  {/* Gold number badge */}
                  <span
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center font-display text-lg text-white"
                    style={{
                      background: "linear-gradient(135deg, #b8924e, #c6a15b, #e8c97a)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display text-2xl text-forest transition-colors group-hover:text-leaf">
                    {vertical.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{vertical.summary}</p>

                  {/* Arrow indicator */}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-gold transition-all duration-300 group-hover:gap-3">
                    Explore
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          GREENHOUSE / CAPABILITY SECTION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24"
        style={{ background: "linear-gradient(180deg, #ecf3e8 0%, #dbebd4 100%)" }}
      >
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ScrollReveal className="reveal-left">
            <div className="relative min-h-[440px] overflow-hidden">
              <Image
                src="/images/greenhouse.jpg"
                alt="Illustrative photograph of protected cultivation. This is not an AGRO PARKS greenhouse."
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              {/* Corner badge */}
              <div
                className="glass-dark absolute bottom-5 left-5 px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Capability
                </p>
                <p className="mt-0.5 font-display text-lg text-white">
                  Field to store
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div>
            <ScrollReveal>
              <SectionHeading
                eyebrow="Capability"
                title="From the field to the store, only as far as the engagement goes."
              />
            </ScrollReveal>

            <ul className="mt-10 space-y-1">
              {services.slice(0, 5).map((service, i) => (
                <ScrollReveal key={service.id} className={`reveal stagger-${i + 1}`}>
                  <li>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex items-center justify-between gap-4 border-b border-line py-4 transition-colors hover:border-leaf/30"
                    >
                      <div>
                        <span className="font-display text-xl text-forest transition-colors group-hover:text-leaf">
                          {service.title}
                        </span>
                        <p className="mt-0.5 text-sm text-muted">{service.summary}</p>
                      </div>
                      <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-gold opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                </ScrollReveal>
              ))}
            </ul>

            <ScrollReveal className="reveal stagger-6">
              <div className="mt-8">
                <ButtonLink href="/services" variant="secondary">
                  All services
                </ButtonLink>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7 COMPANY OBJECTIVES
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24">
        <Container>
          <ScrollReveal>
            <SectionHeading
              eyebrow="Company objectives"
              title="Seven statutory mandates shaping every engagement."
              lede="These are not aspirations — they are the objects stated in the Memorandum of Association filed with the Ministry of Corporate Affairs."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {COMPANY_OBJECTIVES.slice(0, 6).map((obj, i) => (
              <ScrollReveal key={obj.label} className={`reveal stagger-${i + 1}`}>
                <article className="card-lift card-border-top group border border-line bg-white p-6 transition-colors hover:border-forest/20">
                  <div className="mb-4 text-leaf">{obj.icon}</div>
                  <h3 className="font-display text-xl text-forest group-hover:text-leaf transition-colors">
                    {obj.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{obj.text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* 7th objective — full-width highlight */}
          {COMPANY_OBJECTIVES[6] ? (
            <ScrollReveal className="reveal stagger-7">
              <article
                className="mt-5 border border-gold/30 p-8 transition-colors hover:border-gold/60"
                style={{
                  background: "linear-gradient(135deg, rgba(198,161,91,0.07) 0%, rgba(232,201,122,0.04) 100%)",
                }}
              >
                <div className="flex items-start gap-5 lg:items-center">
                  <div className="shrink-0 text-gold">{COMPANY_OBJECTIVES[6].icon}</div>
                  <div>
                    <h3 className="font-display text-2xl text-forest">
                      {COMPANY_OBJECTIVES[6].label}
                    </h3>
                    <p className="mt-2 max-w-3xl text-muted">{COMPANY_OBJECTIVES[6].text}</p>
                  </div>
                  <div className="ml-auto hidden shrink-0 lg:block">
                    <ButtonLink href="/farmers" variant="secondary">
                      Partner with us
                    </ButtonLink>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ) : null}
        </Container>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WHY AGRO PARKS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="py-24"
        style={{ background: "linear-gradient(180deg, #f8faf6 0%, #ecf3e8 100%)" }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeading
              eyebrow="Why Agro Parks"
              title="Trust is a matter of what we are willing to write down."
            />
          </ScrollReveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              {
                title: "A company on the record",
                body: "Incorporated under the Companies Act, 2013, with a published CIN, GSTIN, and registered office. Every claim on this site is traceable to a filed document.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ),
              },
              {
                title: "Scope before slogans",
                body: "Business pages follow the memorandum of association. They separate an authorised activity from an operating site, so you always know what stage the company is at.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M14 2v6h6M10 13h4M10 17h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: "Enquiry before checkout",
                body: "Produce is discussed against a requirement. The site does not invent prices, stock levels, or certificates. Every transaction starts with a written enquiry.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ),
              },
              {
                title: "A place for partners",
                body: "Farmers, buyers, and vendors can apply through the portal. Applications remain pending until a company representative reviews them — no automatic approvals.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map((card, i) => (
              <ScrollReveal key={card.title} className={`reveal stagger-${i + 1}`}>
                <article className="card-lift card-border-top group border border-line bg-white p-8 transition-colors hover:border-forest/25">
                  <div className="mb-5 flex items-center gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center text-white"
                      style={{ background: "linear-gradient(135deg, #123d2b, #347a45)" }}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-display text-2xl text-forest transition-colors group-hover:text-leaf">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-muted leading-7">{card.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          INSIGHTS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {posts.length > 0 ? (
        <section className="border-t border-line py-24">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <ScrollReveal>
                <SectionHeading eyebrow="Insights" title="Notes on how we work." />
              </ScrollReveal>
              <ScrollReveal className="reveal-fade">
                <Link
                  href="/insights"
                  className="underline-grow hidden text-sm text-forest md:inline"
                >
                  All insights
                </Link>
              </ScrollReveal>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} className={`reveal stagger-${i + 1}`}>
                  <article className="card-lift group">
                    <Link href={`/insights/${post.slug}`}>
                      {/* Image with hover zoom + overlay */}
                      <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-line">
                        {post.coverImage ? (
                          <>
                            <Image
                              src={post.coverImage}
                              alt={post.coverAlt || ""}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(min-width: 768px) 33vw, 100vw"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-forest/0 transition-all duration-400 group-hover:bg-forest/40">
                              <span className="translate-y-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                                Read insight →
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-line">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="font-display text-2xl leading-snug text-forest transition-colors group-hover:text-leaf">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
                    </Link>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="reveal stagger-4">
              <div className="mt-10 flex justify-center md:hidden">
                <ButtonLink href="/insights" variant="secondary">
                  All insights
                </ButtonLink>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      ) : null}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CTA BANNER
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative overflow-hidden py-20 text-white"
        style={{
          background: "linear-gradient(165deg, #061810 0%, #0f3320 35%, #1a5232 65%, #2d7a42 100%)",
        }}
      >
        {/* Subtle grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Gold accent bottom line */}
        <div
          className="absolute inset-x-0 bottom-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c6a15b 25%, #e8c97a 50%, #c6a15b 75%, transparent)",
          }}
        />

        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <ScrollReveal className="reveal-left max-w-2xl">
              <div>
                <h2 className="font-display text-4xl md:text-5xl">{settings.ctaHeading}</h2>
                <p className="mt-4 text-lg leading-8 text-white/75">{settings.ctaBody}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="reveal-right shrink-0">
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" variant="gold">
                  Contact the company
                </ButtonLink>
                <ButtonLink href="/register" variant="inverse">
                  Partner registration
                </ButtonLink>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
