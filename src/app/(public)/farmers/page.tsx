import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { PhotoHero } from "@/components/photo-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, ButtonLink, Container, ScopeNote } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Farmers and agricultural partners",
  "Farmer registration, produce procurement, farm collaboration, and contract farming enquiries with AGRO PARKS.",
  "/farmers",
);

export default function FarmersPage() {
  return (
    <article>
      <PhotoHero
        eyebrow="Farmers"
        title="A direct way to introduce your crop."
        lede="Registration creates a pending partner application. It is not a purchase contract, and it is not a contract farming agreement."
        image="/images/farmers.jpg"
        imageAlt="Illustrative photograph of people working in a field. These are not AGRO PARKS employees."
      >
        <Breadcrumbs
          light
          items={[{ href: "/", label: "Home" }, { label: "Farmers" }]}
        />
      </PhotoHero>

      <Container className="grid gap-14 py-20 lg:grid-cols-2">
        <ScrollReveal className="reveal-left">
          <div className="space-y-6">
            <h2 className="font-display text-3xl text-forest">What you can ask for</h2>

            <ul className="space-y-4">
              {[
                "A farmer partnership application, reviewed by the company",
                "A produce procurement enquiry for a crop you grow",
                "A conversation about farm collaboration or field services",
                "A contract farming enquiry, which still needs the law and a written agreement",
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
              Do not send identity documents through this form. Land arrangements, where they matter,
              can be described in words and checked later.
            </ScopeNote>

            <ButtonLink href="/register?role=farmer" variant="primary">
              Register as a farmer
            </ButtonLink>
          </div>
        </ScrollReveal>

        <ScrollReveal className="reveal-right">
          <EnquiryForm
            type="FARMER_REGISTRATION"
            allowed={["FARMER_REGISTRATION", "PRODUCE_PROCUREMENT", "FARM_COLLABORATION", "CONTRACT_FARMING"]}
            sourcePath="/farmers"
            heading="Farmer enquiry"
          />
        </ScrollReveal>
      </Container>

      {/* How the process works */}
      <section
        className="py-20 text-white"
        style={{ background: "linear-gradient(165deg, #061810 0%, #123d2b 100%)" }}
      >
        <Container>
          <ScrollReveal>
            <h2 className="font-display text-3xl text-white">How the process works</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Submit enquiry", text: "Fill the form above. Describe your crop, land, and what you are looking for." },
              { step: "02", title: "Company review", text: "The team reviews your application and contacts you at the email address you provide." },
              { step: "03", title: "Written agreement", text: "Any commercial arrangement — including contract farming — is confirmed only in a signed document." },
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
