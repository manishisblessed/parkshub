import { Breadcrumbs, Container, SectionHeading } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { publishedFaqs } from "@/server/queries";

export const metadata = pageMeta("FAQs", "Answers about AGRO PARKS enquiries, listings, registration, and what the company does not claim.", "/faqs");

export default async function FaqPage() {
  const faqs = await publishedFaqs();
  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "FAQs" }]} />
        <div className="mt-8">
          <SectionHeading eyebrow="FAQs" title="Straight answers." />
        </div>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="cursor-pointer list-none font-display text-2xl text-forest">{faq.question}</summary>
              <p className="mt-3 leading-8 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </article>
  );
}
