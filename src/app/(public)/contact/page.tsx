import { EnquiryForm } from "@/components/enquiry-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, Container, SectionHeading } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/server/queries";

export const metadata = pageMeta(
  "Contact",
  "Contact AGRO PARKS SOLUTION PRIVATE LIMITED in New Delhi for business, product, and partnership enquiries.",
  "/contact",
);

export default async function ContactPage() {
  const settings = await getSettings();
  const mapQuery = encodeURIComponent(settings.registeredAddress);
  const embed = settings.mapsEmbedUrl.startsWith("https://") ? settings.mapsEmbedUrl : "";

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
            Contact
          </p>
          <h1 className="hero-child-2 mt-3 max-w-2xl font-display text-5xl leading-tight md:text-6xl">
            Write to the company.
          </h1>
          <p className="hero-child-3 mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Use the form for a business, product, or partnership enquiry. We reply to the email
            address you give.
          </p>
          <div className="hero-child-4 mt-6">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "Contact" }]}
            />
          </div>
        </Container>
      </div>

      <section className="py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Company info */}
            <ScrollReveal className="reveal-left">
              <div className="space-y-7">
                {[
                  { label: "Company", value: settings.legalName, isLarge: true },
                  { label: "Registered office", value: settings.registeredAddress },
                  { label: "GST principal place of business", value: settings.principalPlace },
                  { label: "Email", value: settings.email, isEmail: true },
                  { label: "Website", value: "www.agroparks.in" },
                  { label: "CIN · GSTIN", value: `${settings.cin}\n${settings.gstin}` },
                ].map((item) => (
                  <div key={item.label} className="border-b border-line pb-5 last:border-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      {item.label}
                    </p>
                    {item.isEmail ? (
                      <a
                        href={`mailto:${item.value}`}
                        className="underline-grow mt-1.5 block text-forest transition-colors hover:text-leaf"
                      >
                        {item.value}
                      </a>
                    ) : item.isLarge ? (
                      <p className="mt-1.5 font-display text-xl text-forest">{item.value}</p>
                    ) : (
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-7 text-ink">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}

                {/* Map */}
                {embed ? (
                  <iframe
                    title="Map of the registered office"
                    src={embed}
                    className="mt-2 h-64 w-full border border-line"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="border border-dashed border-line bg-white/60 p-6 text-center">
                    <p className="font-display text-xl text-forest">Registered office</p>
                    <p className="mt-1 text-sm text-muted">
                      Plot No. 8, Sector-14, Dwarka City Centre, Amberhai, New Delhi – 110075
                    </p>
                    <a
                      className="mt-4 inline-block text-sm text-forest underline-grow"
                      href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Enquiry form */}
            <ScrollReveal className="reveal-right">
              <EnquiryForm
                type="GENERAL"
                allowed={["GENERAL", "BUSINESS", "PRODUCT", "PARTNERSHIP", "SERVICE"]}
                sourcePath="/contact"
                heading="Enquiry form"
              />
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </article>
  );
}
