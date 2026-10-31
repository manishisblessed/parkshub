import { EnquiryForm } from "@/components/enquiry-form";
import { PhotoHero } from "@/components/photo-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, ButtonLink, Container, ScopeNote } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Buyers and business customers",
  "Buyer registration, bulk purchase, institutional procurement, distributor, and retailer enquiries with AGRO PARKS.",
  "/buyers",
);

export default function BuyersPage() {
  return (
    <article>
      <PhotoHero
        eyebrow="Buyers"
        title="Tell us the produce, the window, and the quantity range."
        lede="Institutions, distributors, retailers, and processors can register or send a sourcing enquiry. There is no checkout on this site."
        image="/images/produce.jpg"
        imageAlt="Illustrative photograph of fresh produce. This is not AGRO PARKS stock."
      >
        <Breadcrumbs
          light
          items={[{ href: "/", label: "Home" }, { label: "Buyers" }]}
        />
      </PhotoHero>

      <div id="bulk">
      <Container className="grid gap-14 py-20 lg:grid-cols-2">
        <ScrollReveal className="reveal-left">
          <div className="space-y-7">
            <h2 className="font-display text-3xl text-forest">Business relationships</h2>

            <ul className="space-y-4">
              {[
                "Buyer registration",
                "Bulk purchase enquiries",
                "Product sourcing",
                "Institutional procurement",
                "Distributor and retailer enquiries",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #b8924e, #e8c97a)" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>

            <ScopeNote>
              A reply is not a quotation unless it states price, quantity, quality, and delivery.
              None of those are assumed from a catalogue page.
            </ScopeNote>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/register?role=buyer" variant="primary">
                Register as a buyer
              </ButtonLink>
              <ButtonLink href="/register?role=vendor" variant="secondary">
                Register as a supplier
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="reveal-right">
          <EnquiryForm
            type="BULK_PURCHASE"
            allowed={["BULK_PURCHASE", "SOURCING", "INSTITUTIONAL", "DISTRIBUTOR", "RETAILER", "BUYER_REGISTRATION"]}
            sourcePath="/buyers"
            heading="Buyer enquiry"
          />
        </ScrollReveal>
      </Container>
      </div>

      {/* Process strip */}
      <section
        className="py-16 text-white"
        style={{ background: "linear-gradient(165deg, #061810 0%, #123d2b 100%)" }}
      >
        <Container>
          <ScrollReveal>
            <h2 className="font-display text-3xl text-white">How sourcing works</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Send an enquiry", text: "Name the produce, preferred quantity range, quality specification, and delivery window." },
              { step: "02", title: "Confirmation", text: "The team reviews availability and responds with details — this is not a binding offer until confirmed in writing." },
              { step: "03", title: "Formal arrangement", text: "Any purchase is documented with a written agreement stating price, quantity, quality, and delivery terms." },
            ].map((item, i) => (
              <ScrollReveal key={item.step} className={`reveal stagger-${i + 1}`}>
                <div className="border border-white/12 p-6">
                  <span className="font-display text-3xl text-gold/70">{item.step}</span>
                  <h3 className="mt-3 font-display text-xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}
