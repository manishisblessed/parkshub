import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, Container, SectionHeading } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/text";
import { publishedPosts } from "@/server/queries";

export const metadata = pageMeta(
  "Insights",
  "Notes from AGRO PARKS on enquiries, farmer partnerships, and post-harvest records.",
  "/insights",
);

export default async function InsightsPage() {
  const posts = await publishedPosts();

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
            Insights
          </p>
          <h1 className="hero-child-2 mt-3 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
            Working notes, not company news invented for the page.
          </h1>
          <div className="hero-child-3 mt-6">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "Insights" }]}
            />
          </div>
        </Container>
      </div>

      {/* Posts */}
      <section className="py-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-muted">No insights published yet. Check back later.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} className={`reveal stagger-${(i % 4) + 1}`}>
                  <article className="card-lift group grid gap-6 border-t border-line pt-8 md:grid-cols-[280px_1fr]">
                    {/* Image */}
                    <div className="relative min-h-44 overflow-hidden bg-line">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.coverAlt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="280px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-line">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                        {formatDate(post.publishedAt)}
                      </p>
                      <h2 className="mt-2 font-display text-3xl text-forest transition-colors group-hover:text-leaf">
                        <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
                      <Link
                        href={`/insights/${post.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm text-gold transition-all duration-300 hover:gap-4"
                      >
                        Read insight →
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </article>
  );
}
