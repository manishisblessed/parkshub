import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Breadcrumbs, ButtonLink, Container, SectionHeading, StatusPill } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { publishedServices } from "@/server/queries";

export const metadata = pageMeta(
  "Agricultural services",
  "Land preparation, sowing, irrigation, crop monitoring, harvesting, machinery hiring, advisory, and post-harvest services from AGRO PARKS.",
  "/services",
);

/* Service images mapped by slug — falls back gracefully */
const SERVICE_IMAGES: Record<string, string> = {
  "land-preparation":      "/images/soil.jpg",
  "sowing-transplanting":  "/images/seeds.jpg",
  "irrigation-support":    "/images/irrigation.jpg",
  "crop-monitoring":       "/images/cultivation.jpg",
  "harvesting":            "/images/harvest.jpg",
  "machinery-hiring":      "/images/warehouse.jpg",
  "soil-crop-advisory":    "/images/soil-hands.jpg",
  "precision-agriculture": "/images/greenhouse.jpg",
  "farm-management":       "/images/hero-landscape.jpg",
  "post-harvest-services": "/images/produce.jpg",
};

export default async function ServicesPage() {
  const services = await publishedServices();

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
            Services
          </p>
          <h1 className="hero-child-2 mt-3 max-w-3xl font-display text-5xl leading-tight md:text-6xl">
            Field and post-harvest support, scoped before it is booked.
          </h1>
          <p className="hero-child-3 mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Each service is offered on enquiry. Availability depends on location, people, equipment,
            and the permissions that apply.
          </p>
          <div className="hero-child-4 mt-6">
            <Breadcrumbs
              light
              items={[{ href: "/", label: "Home" }, { label: "Services" }]}
            />
          </div>
        </Container>
      </div>

      {/* Service grid */}
      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const img = SERVICE_IMAGES[service.slug];
              return (
                <ScrollReveal key={service.id} className={`reveal stagger-${(i % 6) + 1}`}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="card-lift card-border-top group block overflow-hidden border border-line bg-white"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-line">
                      {img ? (
                        <Image
                          src={img}
                          alt={service.title}
                          fill
                          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, 50vw"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <StatusPill>On enquiry</StatusPill>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="font-display text-2xl text-forest transition-colors group-hover:text-leaf">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted">{service.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-gold transition-all duration-300 group-hover:gap-3">
                        View details
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA strip */}
      <section
        className="py-16 text-white"
        style={{ background: "linear-gradient(160deg, #0a2118 0%, #123d2b 100%)" }}
      >
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl">Need a specific service?</h2>
            <p className="mt-3 text-white/70">
              Describe your requirement in an enquiry and the team will confirm availability.
            </p>
          </div>
          <ButtonLink href="/contact" variant="gold">
            Send an enquiry
          </ButtonLink>
        </Container>
      </section>
    </article>
  );
}
