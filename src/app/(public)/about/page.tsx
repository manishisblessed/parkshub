import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, Container, Prose, SectionHeading } from "@/components/ui";
import { Paragraphs } from "@/components/rich-text";
import { pageMeta } from "@/lib/seo";
import { getPage, sectionMap } from "@/server/queries";

export const metadata = pageMeta(
  "About us",
  "Overview, purpose, and corporate information for AGRO PARKS SOLUTION PRIVATE LIMITED, incorporated in New Delhi in 2026.",
  "/about",
);

const order = [
  "overview",
  "background",
  "vision",
  "mission",
  "values",
  "philosophy",
  "commitment",
  "objectives",
  "sustainability",
  "corporate",
];

export default async function AboutPage() {
  const page = await getPage("about");
  const sections = sectionMap(page);

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
            About
          </p>
          <h1 className="hero-child-2 mt-3 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
            A new company with a defined agricultural purpose.
          </h1>
          {page?.metaDescription ? (
            <p className="hero-child-3 mt-5 max-w-2xl text-lg leading-8 text-white/75">
              {page.metaDescription}
            </p>
          ) : null}
          <div className="hero-child-4 mt-6">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "About" }]}
            />
          </div>
        </Container>
      </div>

      {/* Sections */}
      <div className="py-20">
        <Container>
          <div className="space-y-16">
            {order.map((key, i) => {
              const section = sections.get(key);
              if (!section) return null;
              return (
                <ScrollReveal
                  key={key}
                  className={`reveal stagger-${Math.min(i + 1, 8)} grid gap-8 border-t border-line pt-10 md:grid-cols-[240px_1fr]`}
                >
                  <h2 className="font-display text-3xl text-forest">{section.heading}</h2>
                  <Prose>
                    <Paragraphs text={section.body} />
                  </Prose>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal className="reveal mt-14">
            <p className="text-sm text-muted">
              Corporate facts on this page are taken from the certificate of incorporation and the GST
              registration.{" "}
              <Link href="/contact" className="underline-grow text-forest">
                Contact the company
              </Link>
            </p>
          </ScrollReveal>
        </Container>
      </div>
    </article>
  );
}
