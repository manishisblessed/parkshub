import "server-only";
import { cache } from "react";
import { prisma } from "@/server/db";

export const getSettings = cache(async () => {
  const settings = await prisma.companySettings.findUnique({ where: { id: "default" } });
  if (!settings) throw new Error("Company settings are missing. Run npm run db:setup.");
  return settings;
});

export const getPage = cache(async (slug: string) => {
  return prisma.page.findFirst({
    where: { slug, published: true },
    include: { sections: { where: { published: true }, orderBy: { sortOrder: "asc" } } },
  });
});

export function sectionMap(page: { sections: { key: string; heading: string; body: string }[] } | null) {
  const map = new Map<string, { heading: string; body: string }>();
  page?.sections.forEach((section) => map.set(section.key, section));
  return map;
}

export async function publishedVerticals() {
  return prisma.businessVertical.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function publishedServices() {
  return prisma.service.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function publishedCategories() {
  return prisma.productCategory.findMany({
    where: { published: true, deletedAt: null, parentId: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function publishedPosts(limit?: number) {
  return prisma.blogPost.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function publishedFaqs() {
  return prisma.faq.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
}
