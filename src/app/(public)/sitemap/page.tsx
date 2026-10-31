import Link from "next/link";
import { Breadcrumbs, Container, SectionHeading } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { prisma } from "@/server/db";

export const metadata = pageMeta("Sitemap", "Public pages of the AGRO PARKS website.", "/sitemap");

const fixed = [
  ["/", "Home"],
  ["/about", "About"],
  ["/business", "Our business"],
  ["/products", "Products"],
  ["/services", "Services"],
  ["/farmers", "Farmers"],
  ["/buyers", "Buyers"],
  ["/sustainability", "Sustainability"],
  ["/insights", "Insights"],
  ["/contact", "Contact"],
  ["/faqs", "FAQs"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/cookies", "Cookies"],
  ["/disclaimer", "Disclaimer"],
  ["/register", "Partner registration"],
  ["/login", "Sign in"],
];

export default async function SitemapPage() {
  const [verticals, services, products, posts] = await Promise.all([
    prisma.businessVertical.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.service.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { published: true, deletedAt: null }, orderBy: { name: "asc" } }),
    prisma.blogPost.findMany({ where: { published: true, deletedAt: null }, orderBy: { title: "asc" } }),
  ]);
  const groups = [
    ["Pages", fixed],
    ["Business", verticals.map((item) => [`/business/${item.slug}`, item.title])],
    ["Services", services.map((item) => [`/services/${item.slug}`, item.title])],
    ["Products", products.map((item) => [`/products/${item.slug}`, item.name])],
    ["Insights", posts.map((item) => [`/insights/${item.slug}`, item.title])],
  ] as const;
  return (
    <article className="py-16">
      <Container>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Sitemap" }]} />
        <div className="mt-8">
          <SectionHeading eyebrow="Sitemap" title="Every public page." />
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {groups.map(([title, links]) => (
            <section key={title}>
              <h2 className="font-display text-2xl text-forest">{title}</h2>
              <ul className="mt-3 space-y-2">
                {links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-ink hover:text-leaf">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
