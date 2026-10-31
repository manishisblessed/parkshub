import { notFound } from "next/navigation";
import { Paragraphs } from "@/components/rich-text";
import { Breadcrumbs, Container, ScopeNote } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { prisma } from "@/server/db";

export async function LegalArticle({ slug }: { slug: string }) {
  const document = await prisma.legalDocument.findUnique({ where: { slug } });
  if (!document) notFound();
  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: document.title }]} />
        <h1 className="mt-8 font-display text-5xl text-forest">{document.title}</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.14em] text-leaf">Status: {document.status === "PUBLISHED" ? "Published" : "Draft for legal review"}</p>
        {document.status !== "PUBLISHED" ? (
          <div className="mt-6">
            <ScopeNote>{document.reviewNote} This page is editable in the admin legal register and should be reviewed by counsel before it is marked published.</ScopeNote>
          </div>
        ) : null}
        <div className="mt-8">
          <Paragraphs text={document.body} />
        </div>
      </Container>
    </article>
  );
}

export function legalMetadata(title: string, description: string, path: string) {
  return pageMeta(title, description, path);
}
