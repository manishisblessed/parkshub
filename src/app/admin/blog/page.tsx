import Link from "next/link";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function BlogAdmin() {
  await requirePermission("blog.manage");
  const posts = await prisma.blogPost.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-display text-4xl text-forest">Insights</h1>
        <Link href="/admin/blog/new" className="bg-forest px-4 py-2 text-sm text-white">New note</Link>
      </div>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.id} className="py-3">
            <Link className="text-forest underline" href={`/admin/blog/${post.id}`}>{post.title}</Link>
            <span className="ml-3 text-sm text-muted">{post.published ? "Published" : "Draft"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
