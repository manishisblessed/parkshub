import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="font-display text-5xl text-forest">Page not found</h1>
      <p className="mt-4 text-muted">That address is not part of the AGRO PARKS site.</p>
      <Link href="/" className="mt-6 inline-flex h-12 items-center bg-forest px-6 text-sm text-white">
        Home
      </Link>
    </div>
  );
}
