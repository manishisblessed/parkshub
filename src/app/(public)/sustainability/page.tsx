import { Container, Prose, SectionHeading, Breadcrumbs } from "@/components/ui";
import { Paragraphs } from "@/components/rich-text";
import { pageMeta } from "@/lib/seo";
import { getPage, sectionMap } from "@/server/queries";

export const metadata = pageMeta(
  "Sustainable agriculture",
  "How AGRO PARKS approaches sustainable, natural, regenerative, and water-efficient farming without unsupported certification claims.",
  "/sustainability",
);

export default async function SustainabilityPage() {
  const page = await getPage("sustainability");
  const sections = sectionMap(page);
  return (
    <article className="py-16">
      <Container>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Sustainability" }]} />
        <div className="mt-8">
          <SectionHeading eyebrow="Sustainability" title="Practices we will describe. Claims we will not invent." lede={page?.metaDescription} />
        </div>
        <div className="mt-12 space-y-10">
          {[...sections.values()].map((section) => (
            <section key={section.heading} className="border-t border-line pt-8">
              <h2 className="font-display text-3xl text-forest">{section.heading}</h2>
              <Prose>
                <div className="mt-4">
                  <Paragraphs text={section.body} />
                </div>
              </Prose>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
