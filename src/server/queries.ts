import "server-only";
import { cache } from "react";
import { prisma, hasDatabase } from "@/server/db";

/* ── Seed content for database-free mode ─────────────────────────── */

import {
  settingsSeed,
  verticals as verticalsSeed,
  services as servicesSeed,
  categories as categoriesSeed,
  products as productsSeed,
  posts as postsSeed,
  faqs as faqsSeed,
  pages as pagesSeed,
  legalDocuments as legalSeed,
} from "../../prisma/content";

const _now = new Date();
const _ts = { createdAt: _now, updatedAt: _now, deletedAt: null };

const _settings = { id: "default" as const, ...settingsSeed, updatedAt: _now };

const _verticals = verticalsSeed.map((v, i) => ({
  id: `v${i}`,
  published: true as const,
  ...v,
  ..._ts,
}));

const _services = servicesSeed.map((s, i) => ({
  id: `s${i}`,
  published: true as const,
  ...s,
  ..._ts,
}));

const _categories = categoriesSeed.map((c, i) => ({
  id: `c${i}`,
  published: true as const,
  parentId: null,
  ...c,
  ..._ts,
}));

const _products = productsSeed.map((p, i) => {
  const catIdx = categoriesSeed.findIndex((c) => c.slug === p.category);
  const cat = _categories[catIdx] ?? _categories[0];
  return {
    id: `p${i}`,
    published: true as const,
    categoryId: cat.id,
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    description: p.description,
    originNote: p.originNote,
    qualityNote: p.qualityNote,
    packagingNote: p.packagingNote,
    availabilityStatus: p.availabilityStatus,
    indicative: p.indicative,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    ..._ts,
    category: cat,
    images: [
      { id: `i${i}`, productId: `p${i}`, url: p.image, alt: p.imageAlt, sortOrder: 0 },
    ],
  };
});

const _posts = postsSeed.map((p, i) => ({
  id: `b${i}`,
  publishedAt: _now,
  ...p,
  ..._ts,
}));

const _faqs = (faqsSeed as [string, string][]).map(([question, answer], i) => ({
  id: `f${i}`,
  question,
  answer,
  sortOrder: i,
  published: true as const,
  updatedAt: _now,
}));

const _pages = Object.entries(pagesSeed).map(([slug, pg]) => ({
  id: `pg-${slug}`,
  slug,
  title: pg.title,
  metaTitle: pg.metaTitle,
  metaDescription: pg.metaDescription,
  published: true as const,
  ..._ts,
  sections: (pg.sections as [string, string, string][]).map(([key, heading, body], j) => ({
    id: `sec-${slug}-${j}`,
    pageId: `pg-${slug}`,
    key,
    heading,
    body,
    sortOrder: j,
    published: true as const,
    updatedAt: _now,
  })),
}));

const _legalDocs = legalSeed.map((doc, i) => ({
  id: `ld${i}`,
  ...doc,
  status: "DRAFT" as const,
  updatedAt: _now,
}));

/* ── Core query functions (used by many pages via import) ────────── */

export const getSettings = cache(async () => {
  if (!hasDatabase) return _settings as any;
  const settings = await prisma.companySettings.findUnique({ where: { id: "default" } });
  if (!settings) throw new Error("Company settings are missing. Run npm run db:setup.");
  return settings;
});

export const getPage = cache(async (slug: string) => {
  if (!hasDatabase) return (_pages.find((p) => p.slug === slug) ?? null) as any;
  return prisma.page.findFirst({
    where: { slug, published: true },
    include: { sections: { where: { published: true }, orderBy: { sortOrder: "asc" } } },
  });
});

export function sectionMap(
  page: { sections: { key: string; heading: string; body: string }[] } | null,
) {
  const map = new Map<string, { heading: string; body: string }>();
  page?.sections.forEach((section) => map.set(section.key, section));
  return map;
}

export async function publishedVerticals() {
  if (!hasDatabase) return _verticals as any[];
  return prisma.businessVertical.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function publishedServices() {
  if (!hasDatabase) return _services as any[];
  return prisma.service.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function publishedCategories() {
  if (!hasDatabase) return _categories as any[];
  return prisma.productCategory.findMany({
    where: { published: true, deletedAt: null, parentId: null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function publishedPosts(limit?: number) {
  if (!hasDatabase) return (limit ? _posts.slice(0, limit) : _posts) as any[];
  return prisma.blogPost.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function publishedFaqs() {
  if (!hasDatabase) return _faqs as any[];
  return prisma.faq.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
}

/* ── Slug lookup functions (replace direct prisma usage in pages) ── */

export async function getVerticalBySlug(slug: string) {
  if (!hasDatabase) return (_verticals.find((v) => v.slug === slug) ?? null) as any;
  return prisma.businessVertical.findFirst({
    where: { slug, published: true, deletedAt: null },
  });
}

export async function getRelatedVerticals(excludeId: string, limit = 4) {
  if (!hasDatabase) return _verticals.filter((v) => v.id !== excludeId).slice(0, limit) as any[];
  return prisma.businessVertical.findMany({
    where: { published: true, deletedAt: null, NOT: { id: excludeId } },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getServiceBySlug(slug: string) {
  if (!hasDatabase) return (_services.find((s) => s.slug === slug) ?? null) as any;
  return prisma.service.findFirst({
    where: { slug, published: true, deletedAt: null },
  });
}

export async function getRelatedServices(excludeId: string, limit = 4) {
  if (!hasDatabase) return _services.filter((s) => s.id !== excludeId).slice(0, limit) as any[];
  return prisma.service.findMany({
    where: { published: true, deletedAt: null, NOT: { id: excludeId } },
    take: limit,
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  if (!hasDatabase) return (_products.find((p) => p.slug === slug) ?? null) as any;
  return prisma.product.findFirst({
    where: { slug, published: true, deletedAt: null },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 3,
) {
  if (!hasDatabase)
    return _products
      .filter((p) => p.categoryId === categoryId && p.id !== excludeId)
      .slice(0, limit) as any[];
  return prisma.product.findMany({
    where: { published: true, deletedAt: null, categoryId, NOT: { id: excludeId } },
    take: limit,
  });
}

export async function searchProducts(opts: {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  const { q = "", category = "", page = 1, pageSize = 12 } = opts;

  if (!hasDatabase) {
    let items = _products.filter((p) => {
      if (category && p.category.slug !== category) return false;
      if (q) {
        const lower = q.toLowerCase();
        if (
          !p.name.toLowerCase().includes(lower) &&
          !p.summary.toLowerCase().includes(lower)
        )
          return false;
      }
      return true;
    });
    const total = items.length;
    items = items.slice((page - 1) * pageSize, page * pageSize);
    return { products: items as any[], total };
  }

  const where: any = {
    deletedAt: null,
    published: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? { OR: [{ name: { contains: q } }, { summary: { contains: q } }] }
      : {}),
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { products, total };
}

export async function getBlogPostBySlug(slug: string) {
  if (!hasDatabase) return (_posts.find((p) => p.slug === slug) ?? null) as any;
  return prisma.blogPost.findFirst({
    where: { slug, published: true, deletedAt: null },
  });
}

export async function getLegalDocument(slug: string) {
  if (!hasDatabase) return (_legalDocs.find((d) => d.slug === slug) ?? null) as any;
  return prisma.legalDocument.findUnique({ where: { slug } });
}

export async function sitemapEntries() {
  if (!hasDatabase) {
    return {
      verticals: _verticals.map((v) => ({ slug: v.slug, updatedAt: v.updatedAt })),
      services: _services.map((s) => ({ slug: s.slug, updatedAt: s.updatedAt })),
      products: _products.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })),
      posts: _posts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })),
    };
  }
  const [verticals, services, products, posts] = await Promise.all([
    prisma.businessVertical.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
  ]);
  return { verticals, services, products, posts };
}

export async function sitemapPageData() {
  if (!hasDatabase) {
    return {
      verticals: _verticals as any[],
      services: _services as any[],
      products: _products as any[],
      posts: _posts as any[],
    };
  }
  const [verticals, services, products, posts] = await Promise.all([
    prisma.businessVertical.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.service.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { published: true, deletedAt: null }, orderBy: { name: "asc" } }),
    prisma.blogPost.findMany({ where: { published: true, deletedAt: null }, orderBy: { title: "asc" } }),
  ]);
  return { verticals, services, products, posts };
}
