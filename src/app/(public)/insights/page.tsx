import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/text";
import { publishedPosts } from "@/server/queries";

export const metadata = pageMeta(
  "Insights",
  "Notes from AGRO PARKS on enquiries, farmer partnerships, and post-harvest records.",
  "/insights",
);

/* ── Botanical leaf SVG decoration ──────────────────────────────── */
function LeafDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M100 10 C60 40 20 90 30 160 C40 220 80 260 100 270 C120 260 160 220 170 160 C180 90 140 40 100 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M100 10 C100 10 100 270 100 270"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="6 4"
      />
      <path d="M100 80 C80 90 55 110 50 130" stroke="currentColor" strokeWidth="0.8" />
      <path d="M100 110 C120 120 145 140 150 160" stroke="currentColor" strokeWidth="0.8" />
      <path d="M100 140 C80 150 60 165 58 185" stroke="currentColor" strokeWidth="0.8" />
      <path d="M100 165 C120 175 140 185 142 205" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

/* ── Image placeholder ───────────────────────────────────────────── */
function ImagePlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3"
      style={{ background: "linear-gradient(135deg, #0e3d28 0%, #1b5c36 50%, #2e8b57 100%)" }}>
      <LeafDecoration className="h-16 w-12 text-white/20" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Agro Parks</span>
    </div>
  );
}

export default async function InsightsPage() {
  const posts = await publishedPosts();
  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <article>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO BAND
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative overflow-hidden py-24 text-white">
        {/* Animated gradient base */}
        <div className="absolute inset-0 grad-animated" />

        {/* Grain texture overlay */}
        <div className="grain-overlay opacity-[0.055]" />

        {/* Radial vignettes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(7,24,17,0.6) 0%, transparent 55%), radial-gradient(ellipse at 100% 50%, rgba(7,24,17,0.6) 0%, transparent 55%)",
          }}
        />

        {/* Animated gold top accent */}
        <div className="gold-accent-line absolute inset-x-0 top-0 h-[3px]" />

        {/* Botanical decoration — right side */}
        <div className="leaf-sway pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 opacity-[0.07] lg:block">
          <LeafDecoration className="h-72 w-52 text-white" />
        </div>
        <div className="leaf-sway pointer-events-none absolute -left-6 bottom-4 hidden opacity-[0.05] lg:block"
          style={{ animationDelay: "2s", animationDuration: "8s" }}>
          <LeafDecoration className="h-44 w-32 text-white" />
        </div>

        <Container className="relative z-10">
          {/* Live badge */}
          <ScrollReveal className="reveal stagger-1">
            <div className="insight-badge mb-7 w-fit">
              <span className="dot-pulse inline-block h-1.5 w-1.5 rounded-full bg-gold-light" />
              {posts.length > 0
                ? `${posts.length} note${posts.length === 1 ? "" : "s"} published`
                : "Insights"}
            </div>
          </ScrollReveal>

          <p className="hero-child-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-gold/80">
            Insights
          </p>
          <h1 className="hero-child-2 mt-3 max-w-3xl font-display text-5xl leading-tight md:text-[3.75rem]">
            Working notes, not{" "}
            <span className="text-gradient-gold">company news</span>{" "}
            invented for the page.
          </h1>
          <p className="hero-child-3 mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Honest field observations, market notes, and working knowledge from the Agro Parks team.
          </p>
          <div className="hero-child-4 mt-6">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "Insights" }]}
            />
          </div>
        </Container>
      </div>

      {/* Wave divider */}
      <div className="wave-divider -mt-px" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "48px", background: "var(--paper)" }}>
          <path
            d="M0,48 L0,24 C180,48 360,0 540,24 C720,48 900,0 1080,24 C1260,48 1440,24 1440,24 L1440,48 Z"
            fill="var(--forest-deep)"
            opacity="0.06"
          />
          <path
            d="M0,48 L0,32 C240,8 480,56 720,32 C960,8 1200,56 1440,32 L1440,48 Z"
            fill="var(--forest-mid)"
            opacity="0.05"
          />
        </svg>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          POSTS SECTION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-deep) 100%)" }}>
        <Container>
          {posts.length === 0 ? (
            /* Empty state */
            <div className="border border-dashed border-line bg-white/60 px-8 py-20 text-center">
              <LeafDecoration className="mx-auto mb-6 h-20 w-14 text-leaf/30" />
              <h2 className="font-display text-3xl text-forest">No insights yet</h2>
              <p className="mx-auto mt-3 max-w-sm text-muted">
                Working notes and field observations will appear here when published.
              </p>
            </div>
          ) : (
            <>
              {/* ── FEATURED POST (full-width magazine card) ─── */}
              {featured && (
                <ScrollReveal className="reveal stagger-1">
                  <article className="card-glow card-featured group mb-12 overflow-hidden border border-line bg-white">
                    <Link href={`/insights/${featured.slug}`} className="grid md:grid-cols-[1.1fr_0.9fr]">
                      {/* Image */}
                      <div className="relative min-h-72 overflow-hidden md:min-h-[420px]">
                        {featured.coverImage ? (
                          <>
                            <Image
                              src={featured.coverImage}
                              alt={featured.coverAlt || featured.title}
                              fill
                              priority
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(min-width: 768px) 55vw, 100vw"
                            />
                            <div className="img-overlay-reveal" />
                          </>
                        ) : (
                          <ImagePlaceholder />
                        )}

                        {/* Featured label floating on image */}
                        <div className="glass-dark absolute left-5 top-5 px-3 py-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                            ★ Featured
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-center p-8 md:p-12">
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                          <span className="tag-pill text-gold border-gold/40 hover:bg-gold/10">
                            Insight
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                            {readingTime(featured.body)}
                          </span>
                        </div>

                        <h2 className="font-display text-3xl leading-snug text-forest transition-colors duration-300 group-hover:text-leaf md:text-4xl">
                          {featured.title}
                        </h2>
                        <p className="mt-4 leading-7 text-muted">{featured.excerpt}</p>

                        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                            {formatDate(featured.publishedAt)}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-all duration-300 group-hover:gap-4">
                            Read insight
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                </ScrollReveal>
              )}

              {/* ── REST: 3-column magazine grid ─── */}
              {rest.length > 0 && (
                <>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-line" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                      More notes
                    </span>
                    <div className="h-px flex-1 bg-line" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, i) => (
                      <ScrollReveal
                        key={post.id}
                        className={`reveal stagger-${(i % 6) + 1}`}
                      >
                        <article className="card-glow card-border-top group flex h-full flex-col border border-line bg-white">
                          {/* Thumbnail */}
                          <Link href={`/insights/${post.slug}`} className="block">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              {post.coverImage ? (
                                <>
                                  <Image
                                    src={post.coverImage}
                                    alt={post.coverAlt || post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                  />
                                  <div className="img-overlay-reveal" />
                                  {/* Hover read label */}
                                  <div className="absolute inset-0 flex items-end justify-start p-4 opacity-0 transition-all duration-400 group-hover:opacity-100">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                                      Read note →
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <ImagePlaceholder />
                              )}
                            </div>
                          </Link>

                          {/* Body */}
                          <div className="flex flex-1 flex-col p-6">
                            <div className="mb-3 flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
                                {formatDate(post.publishedAt)}
                              </span>
                              <span className="text-line">·</span>
                              <span className="text-[10px] uppercase tracking-[0.16em] text-sage">
                                {readingTime(post.body)}
                              </span>
                            </div>

                            <h2 className="font-display text-2xl leading-snug text-forest transition-colors duration-300 group-hover:text-leaf">
                              <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                            </h2>

                            <p className="mt-3 flex-1 text-sm leading-7 text-muted line-clamp-3">
                              {post.excerpt}
                            </p>

                            <Link
                              href={`/insights/${post.slug}`}
                              className="mt-5 inline-flex items-center gap-2 self-start text-sm font-medium text-gold transition-all duration-300 hover:gap-4"
                            >
                              Read insight →
                            </Link>
                          </div>
                        </article>
                      </ScrollReveal>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </Container>
      </section>
    </article>
  );
}
