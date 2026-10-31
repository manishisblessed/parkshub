import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Paragraphs } from "@/components/rich-text";
import { Breadcrumbs, Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { formatDate, siteUrl } from "@/lib/text";
import { getBlogPostBySlug } from "@/server/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return pageMeta(post.metaTitle, post.metaDescription, `/insights/${post.slug}`, post.coverImage || undefined);
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  return (
    <article className="py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          datePublished: post.publishedAt?.toISOString(),
          author: { "@type": "Organization", name: "AGRO PARKS SOLUTION PRIVATE LIMITED" },
          image: post.coverImage ? `${siteUrl()}${post.coverImage}` : undefined,
        }}
      />
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/insights", label: "Insights" }, { label: post.title }]} />
        <p className="mt-8 text-xs uppercase tracking-[0.14em] text-muted">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-forest">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9]">
            <Image src={post.coverImage} alt={post.coverAlt} fill className="object-cover" sizes="768px" priority />
          </div>
        ) : null}
        <div className="mt-8">
          <Paragraphs text={post.body} />
        </div>
      </Container>
    </article>
  );
}
