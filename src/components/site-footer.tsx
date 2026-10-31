import Link from "next/link";
import { Container } from "@/components/ui";

const columns = [
  {
    title: "Company",
    links: [
      ["/about", "About"],
      ["/business", "Our business"],
      ["/sustainability", "Sustainability"],
      ["/insights", "Insights"],
      ["/contact", "Contact"],
    ],
  },
  {
    title: "Work with us",
    links: [
      ["/products", "Products"],
      ["/services", "Services"],
      ["/farmers", "Farmers"],
      ["/buyers", "Buyers"],
      ["/register", "Partner registration"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
      ["/cookies", "Cookies"],
      ["/disclaimer", "Disclaimer"],
      ["/faqs", "FAQs"],
      ["/sitemap", "Sitemap"],
    ],
  },
] as const;

export function SiteFooter({
  legalName,
  address,
  email,
  cin,
  gstin,
}: {
  legalName: string;
  address: string;
  email: string;
  cin: string;
  gstin: string;
}) {
  return (
    <footer className="mt-auto" style={{ background: "linear-gradient(165deg, #061810 0%, #0d2d1c 40%, #123d2b 100%)" }}>
      {/* Gold top accent line */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #c6a15b 20%, #e8c97a 50%, #c6a15b 80%, transparent 100%)",
        }}
      />

      <Container className="grid gap-12 py-16 md:grid-cols-4">
        {/* Brand column */}
        <div>
          <p className="font-display text-[2rem] leading-none text-white">Agro Parks</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
            Solution Private Limited
          </p>
          <p className="mt-5 text-sm leading-7 text-white/65">{legalName}</p>
          <p className="mt-3 text-sm leading-7 text-white/55">{address}</p>
          <a
            href={`mailto:${email}`}
            className="underline-grow underline-gold mt-4 block text-sm text-gold transition-colors hover:text-[#e8c97a]"
          >
            {email}
          </a>

          {/* Social / certification placeholder */}
          <div className="mt-6 flex gap-3">
            <span
              className="inline-flex h-8 w-8 items-center justify-center border border-white/15 text-white/40 transition-colors hover:border-gold/40 hover:text-gold"
              aria-label="Ministry of Corporate Affairs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>

        {/* Nav columns */}
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {column.title}
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="underline-grow inline-block text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <Container className="flex flex-col gap-4 py-6 text-xs leading-6 text-white/40 md:flex-row md:justify-between">
          <p>
            CIN {cin} · GSTIN {gstin}
          </p>
          <p className="max-w-xl text-right">
            Photographs are illustrative stock images. They do not show AGRO PARKS land, facilities,
            or people. Business pages describe authorised activities, not a claim that every activity
            is licensed or operating.
          </p>
        </Container>
      </div>
    </footer>
  );
}
