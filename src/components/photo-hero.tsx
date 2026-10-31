import Image from "next/image";
import { Container } from "@/components/ui";

export function PhotoHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  /** Optional slot rendered below the lede — e.g. breadcrumbs, status pills */
  children?: React.ReactNode;
}) {
  return (
    <section className="relative min-h-[480px] overflow-hidden bg-[#061810] text-white">
      {/* Background image with subtle scale for depth */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover opacity-55 transition-transform duration-[8s] ease-out"
        sizes="100vw"
      />

      {/* Multi-stop gradient overlay — rich depth */}
      <div className="absolute inset-0 grad-hero-overlay" />

      {/* Subtle radial vignette at edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 55%, rgba(6,24,16,0.6) 100%)",
        }}
      />

      {/* Gold accent line at top */}
      <div className="absolute inset-x-0 top-0 h-[3px] grad-gold" />

      <Container className="relative flex min-h-[480px] flex-col justify-end py-14">
        {/* Optional slot (breadcrumbs, status) above the heading */}
        {children ? <div className="hero-child-1 mb-5">{children}</div> : null}

        <p className="hero-child-2 text-xs uppercase tracking-[0.22em] text-white/75">
          {eyebrow}
        </p>

        <h1 className="hero-child-3 mt-3 max-w-3xl font-display text-4xl leading-[1.08] md:text-6xl">
          {title}
        </h1>

        <p className="hero-child-4 mt-5 max-w-2xl text-lg leading-8 text-white/85">
          {lede}
        </p>

        {/* Animated scroll indicator */}
        <div className="hero-child-5 mt-10 flex items-center gap-3">
          <div className="scroll-bounce text-white/40">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 4v12M5 11l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Scroll to explore
          </span>
        </div>
      </Container>
    </section>
  );
}
