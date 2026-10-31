import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-leaf">404</p>
      <h1 className="mt-3 font-display text-5xl text-forest">This page is not on the site.</h1>
      <p className="mt-4 max-w-xl text-muted">The address may be mistyped, or the listing may have been withdrawn. The catalogue and the company pages are still available.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="inline-flex h-12 items-center bg-forest px-6 text-sm text-white">
          Home
        </Link>
        <Link href="/sitemap" className="inline-flex h-12 items-center border border-forest px-6 text-sm text-forest">
          Sitemap
        </Link>
      </div>
    </Container>
  );
}
