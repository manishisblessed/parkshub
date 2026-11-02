"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

/**
 * Adds the class `in-view` to the wrapper element once it enters the
 * viewport. Combined with the CSS utilities defined in globals.css
 * (`.reveal`, `.reveal-fade`, `.reveal-left`, `.reveal-right`, `.reveal-scale`,
 * `.stagger-N`), this drives all scroll-triggered entrance animations.
 *
 * @example
 * <ScrollReveal className="reveal stagger-2">
 *   <p>Appears on scroll</p>
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  className = "reveal",
  threshold = 0.14,
  rootMargin = "0px 0px -40px 0px",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** CSS classes to apply to the wrapper element (default: "reveal") */
  className?: string;
  /** IntersectionObserver threshold (0–1) */
  threshold?: number;
  /** IntersectionObserver rootMargin */
  rootMargin?: string;
  /** HTML tag for the wrapper element (default: "div") */
  as?: IntrinsicTag;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const Wrapper = Tag as "div";
  return (
    <Wrapper ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Wrapper>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   READING PROGRESS BAR
   Tracks scroll depth on an article page and renders a thin progress bar
   fixed to the top of the viewport (below the sticky header).
   ══════════════════════════════════════════════════════════════════════ */

/**
 * A fixed reading-progress bar that grows as the user scrolls down the page.
 * Place this at the top of an article page component.
 */
export function ReadingProgress() {
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setWidth(`${progress.toFixed(1)}%`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="reading-progress-bar"
      role="progressbar"
      aria-label="Reading progress"
      style={{ width, top: "var(--header-height, 0px)" }}
    />
  );
}

/**
 * Convenience: renders a list of children each wrapped in a `ScrollReveal`
 * with staggered delays (stagger-1 … stagger-8).
 *
 * @example
 * <StaggerReveal itemClass="reveal" wrapperClass="space-y-4">
 *   {items.map(item => <p key={item.id}>{item.text}</p>)}
 * </StaggerReveal>
 */
export function StaggerReveal({
  children,
  itemClass = "reveal",
  wrapperClass = "",
  as = "div",
}: {
  children: ReactNode[];
  itemClass?: string;
  wrapperClass?: string;
  as?: IntrinsicTag;
}) {
  const staggerClasses = [
    "stagger-1", "stagger-2", "stagger-3", "stagger-4",
    "stagger-5", "stagger-6", "stagger-7", "stagger-8",
  ];
  const Wrapper = as as "div";
  return (
    <Wrapper className={wrapperClass}>
      {children.map((child, i) => (
        <ScrollReveal
          key={i}
          className={`${itemClass} ${staggerClasses[i % staggerClasses.length]}`}
        >
          {child}
        </ScrollReveal>
      ))}
    </Wrapper>
  );
}
