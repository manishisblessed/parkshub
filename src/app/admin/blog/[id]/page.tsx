import { notFound } from "next/navigation";
import { savePost } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function BlogEdit({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("blog.manage");
  const { id } = await params;
  const post = id === "new" ? null : await prisma.blogPost.findFirst({ where: { id, deletedAt: null } });
  if (id !== "new" && !post) notFound();
  return (
    <form action={savePost} className="grid max-w-3xl gap-4">
      <h1 className="font-display text-4xl text-forest">{post ? "Edit insight" : "New insight"}</h1>
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <Field label="Title" name="title" defaultValue={post?.title} required />
      <Field label="Excerpt" name="excerpt" as="textarea" defaultValue={post?.excerpt} />
      <Field label="Body" name="body" as="textarea" defaultValue={post?.body} />
      <Field label="Cover image path" name="coverImage" defaultValue={post?.coverImage} />
      <Field label="Cover alt" name="coverAlt" defaultValue={post?.coverAlt} />
      <Field label="SEO title" name="metaTitle" defaultValue={post?.metaTitle} />
      <Field label="SEO description" name="metaDescription" defaultValue={post?.metaDescription} />
      <label className="text-sm"><input type="checkbox" name="published" defaultChecked={post?.published} /> Published</label>
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
