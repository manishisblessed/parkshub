import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Paragraphs } from "@/components/rich-text";
import { ReadingProgress, ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, ButtonLink, Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { formatDate, readingTime, siteUrl } from "@/lib/text";
import { getBlogPostBySlug, publishedPosts } from "@/server/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return pageMeta(post.metaTitle, post.metaDescription, `/insights/${post.slug}`, post.coverImage || undefined);
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), publishedPosts(5)]);
  if (!post) notFound();

  const readTime = readingTime(post.body);
  const related = allPosts.filter((p: any) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* Reading progress bar fixed to top */}
      <ReadingProgress />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          datePublished: post.publishedAt?.toISOString(),
          author: { "@type": "Organization", name: "AGRO PARKS SOLUTION PRIVATE LIMITED" },
          image: post.coverImage ? `${siteUrl()}${post.coverImage}` : undefined,
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ARTICLE HERO
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative overflow-hidden pb-0 pt-16 text-white"
        style={{ background: "linear-gradient(165deg, #071811 0%, #0e3d28 40%, #1b5c36 100%)" }}>
        {/* Gold top accent */}
        <div className="gold-accent-line absolute inset-x-0 top-0 h-[3px]" />

        {/* Grain overlay */}
        <div className="grain-overlay opacity-[0.04]" />

        <Container className="relative z-10 max-w-4xl">
          {/* Back navigation */}
          <Link
            href="/insights"
            className="hero-child-1 mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60 transition-colors duration-300 hover:text-gold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All insights
          </Link>

          <div className="hero-child-2">
            <Breadcrumbs
              light
              items={[
                { href: "/", label: "Home" },
                { href: "/insights", label: "Insights" },
                { label: post.title },
              ]}
            />
          </div>

          {/* Meta row */}
          <div className="hero-child-3 mt-8 flex flex-wrap items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.16em] text-gold/80">
              {formatDate(post.publishedAt)}
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-sage">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {readTime}
            </span>
          </div>

          <h1 className="hero-child-4 mt-5 font-display text-4xl leading-tight text-white md:text-5xl">
            {post.title}
          </h1>
          <p className="hero-child-5 mt-4 max-w-2xl text-lg leading-8 text-white/70">
            {post.excerpt}
          </p>

          {/* Decorative bottom wave into cover image */}
          <div className="mt-12 h-6" />
        </Container>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          COVER IMAGE (full-bleed within a constrained wrapper)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {post.coverImage ? (
        <Container className="max-w-4xl -mt-0">
          <ScrollReveal className="reveal-scale">
            <div className="relative aspect-[16/9] overflow-hidden shadow-[0_24px_80px_rgba(14,61,40,0.22)]">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 896px, 100vw"
              />
            </div>
          </ScrollReveal>
        </Container>
      ) : null}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ARTICLE BODY
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-deep) 100%)" }}>
        <Container className="max-w-3xl">
          <ScrollReveal className="reveal stagger-1">
            <div className="prose-article">
              <Paragraphs text={post.body} />
            </div>
          </ScrollReveal>

          {/* Author / source note */}
          <ScrollReveal className="reveal stagger-2">
            <div className="mt-12 border-l-[3px] border-gold pl-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Published by</p>
              <p className="mt-1 font-display text-lg text-forest">Agro Parks</p>
              <p className="text-sm text-muted">AGRO PARKS SOLUTION PRIVATE LIMITED · New Delhi</p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RELATED INSIGHTS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {related.length > 0 && (
        <section className="border-t border-line py-20"
          style={{ background: "linear-gradient(180deg, var(--paper-deep) 0%, var(--paper) 100%)" }}>
          <Container>
            <ScrollReveal>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">
                    Continue reading
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-forest">More notes</h2>
                </div>
                <Link
                  href="/insights"
                  className="hidden text-sm text-gold underline-grow hover:text-gold-dark md:inline"
                >
                  All insights →
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel: any, i: number) => (
                <ScrollReveal key={rel.id} className={`reveal stagger-${i + 1}`}>
                  <article className="card-glow card-border-top group flex h-full flex-col border border-line bg-white">
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {rel.coverImage ? (
                        <>
                          <Image
                            src={rel.coverImage}
                            alt={rel.coverAlt || rel.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                          <div className="img-overlay-reveal" />
                        </>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, #0e3d28 0%, #1b5c36 50%, #2e8b57 100%)" }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white/20">
                            <path d="M12 2C7.5 5 4 9.5 5 15 6 20 9.5 22 12 22 14.5 22 18 20 19 15 20 9.5 16.5 5 12 2Z"
                              stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted">
                        {formatDate(rel.publishedAt)} · {readingTime(rel.body)}
                      </p>
                      <h3 className="font-display text-xl leading-snug text-forest transition-colors group-hover:text-leaf">
                        <Link href={`/insights/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted line-clamp-2">
                        {rel.excerpt}
                      </p>
                      <Link
                        href={`/insights/${rel.slug}`}
                        className="mt-4 inline-flex items-center gap-2 self-start text-sm text-gold transition-all duration-300 hover:gap-4"
                      >
                        Read →
                      </Link>
                    </div>
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
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CTA
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        className="relative overflow-hidden py-20 text-white"
        style={{ background: "linear-gradient(165deg, #071811 0%, #0e3d28 35%, #1b5c36 65%, #2e8b57 100%)" }}
      >
        <div className="gold-accent-line absolute inset-x-0 bottom-0 h-[3px]" />
        <div className="grain-overlay opacity-[0.04]" />
        <Container className="relative z-10 text-center">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold/80">
              Work with us
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Have a question or enquiry?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/70">
              We discuss every engagement through a written enquiry — no automated pricing, no invented stock levels.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/contact" variant="gold">
                Contact the company
              </ButtonLink>
              <ButtonLink href="/insights" variant="inverse">
                ← More insights
              </ButtonLink>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
