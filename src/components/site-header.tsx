"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/server/actions/public";
import { NAV_ITEMS } from "@/lib/constants";
import { Container } from "@/components/ui";

export function SiteHeader({
  cin,
  email,
  signedIn,
  staff,
  name,
}: {
  cin: string;
  email: string;
  signedIn: boolean;
  staff: boolean;
  name?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    onScroll(); // set initial state without waiting for first scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [menuOpen]);

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all duration-500",
        scrolled
          ? "border-b border-line bg-paper/96 shadow-[0_2px_24px_rgba(18,61,43,0.07)] backdrop-blur-md"
          : "border-b border-transparent bg-paper/80 backdrop-blur-sm",
      ].join(" ")}
    >
      {/* Top info bar — slides in on scroll */}
      <div
        className={[
          "overflow-hidden bg-ink text-white transition-all duration-500",
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
        ].join(" ")}
        aria-hidden={scrolled}
      >
        <Container className="flex flex-wrap items-center justify-between gap-2 py-2 text-[11px] uppercase tracking-[0.16em]">
          <span>New Delhi · India</span>
          <span className="hidden sm:inline">CIN {cin}</span>
          <a
            href={`mailto:${email}`}
            className="transition-colors hover:text-gold"
          >
            {email}
          </a>
        </Container>
      </div>

      {/* Main nav */}
      <Container className="flex items-center justify-between gap-6 py-4">
        {/* Logo */}
        <Link href="/" className="group leading-none">
          <span className="block font-display text-[1.75rem] text-forest transition-colors duration-300 group-hover:text-leaf">
            Agro Parks
          </span>
          <span className="mt-0.5 block whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-muted">
            Solution Private Limited
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-ink lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline-grow underline-gold py-1 transition-colors duration-200 hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="hidden items-center gap-4 text-sm lg:flex">
          {signedIn ? (
            <>
              <Link
                href={staff ? "/admin" : "/account"}
                className="underline-grow font-medium text-forest transition-colors hover:text-leaf"
              >
                {name?.split(" ")[0] || "Account"}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-muted underline-grow transition-colors hover:text-forest"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="underline-grow text-muted transition-colors hover:text-forest"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-shimmer inline-flex h-9 items-center bg-forest px-4 text-[13px] tracking-wide text-white transition-colors hover:bg-leaf"
              >
                Partner portal
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="relative lg:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            className={[
              "flex h-9 w-9 flex-col items-center justify-center gap-[5px] transition-colors",
              menuOpen ? "text-forest" : "text-ink",
            ].join(" ")}
          >
            <span
              className={[
                "block h-0.5 w-5 bg-current transition-all duration-300 origin-center",
                menuOpen ? "translate-y-[7px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-5 bg-current transition-all duration-300",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-5 bg-current transition-all duration-300 origin-center",
                menuOpen ? "-translate-y-[7px] -rotate-45" : "",
              ].join(" ")}
            />
          </button>

          {/* Mobile dropdown */}
          <div
            id="mobile-nav"
            className={[
              "absolute right-0 z-50 mt-3 w-64 origin-top-right overflow-hidden border border-line bg-paper shadow-xl transition-all duration-300",
              menuOpen
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0",
            ].join(" ")}
          >
            <nav aria-label="Mobile" className="p-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded px-3 py-2.5 text-sm text-ink transition-colors hover:bg-paper-deep hover:text-forest"
                >
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-line" />
              {signedIn ? (
                <>
                  <Link
                    href={staff ? "/admin" : "/account"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded px-3 py-2.5 text-sm text-forest"
                  >
                    {name?.split(" ")[0] || "Account"}
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded px-3 py-2.5 text-sm text-muted"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded px-3 py-2.5 text-sm text-muted"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 flex items-center justify-center bg-forest px-4 py-2.5 text-sm text-white transition-colors hover:bg-leaf"
                  >
                    Partner portal →
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}
