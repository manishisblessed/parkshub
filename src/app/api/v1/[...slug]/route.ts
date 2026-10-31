import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { ApiError, assertSameOrigin, jsonError, jsonOk, pageQuery } from "@/server/http";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { rateLimit } from "@/server/rate-limit";
import { enquirySchema, fieldErrors } from "@/lib/validation";
import { nextReference } from "@/server/reference";
import { notifyStaff } from "@/server/mail";
import { audit } from "@/server/audit";
import type { PermissionKey } from "@/lib/constants";

async function requireApiPermission(key: PermissionKey) {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "UNAUTHENTICATED", "Sign in required.");
  if (!user.permissions.includes(key)) throw new ApiError(403, "FORBIDDEN", "You do not have access to this resource.");
  return user;
}

async function handle(request: NextRequest, slug: string[]) {
  const key = slug.join("/");
  const url = request.nextUrl;
  if (request.method === "GET" && key === "health") return jsonOk({ status: "ok" });

  if (request.method === "GET" && key === "products") {
    const { page, pageSize, skip } = pageQuery(url);
    const q = url.searchParams.get("q")?.trim();
    const category = url.searchParams.get("category") || undefined;
    const where = {
      deletedAt: null,
      published: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { OR: [{ name: { contains: q } }, { summary: { contains: q } }] } : {}),
    };
    const [total, items] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({ where, include: { category: true, images: true }, orderBy: { name: "asc" }, skip, take: pageSize }),
    ]);
    return jsonOk(items.map(publicProduct), { page, pageSize, total, pageCount: Math.ceil(total / pageSize) });
  }

  if (request.method === "GET" && slug[0] === "products" && slug[1]) {
    const product = await prisma.product.findFirst({ where: { slug: slug[1], published: true, deletedAt: null }, include: { category: true, images: true } });
    if (!product) throw new ApiError(404, "NOT_FOUND", "Product not found.");
    return jsonOk(publicProduct(product));
  }

  if (request.method === "GET" && key === "categories") {
    const items = await prisma.productCategory.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } });
    return jsonOk(items);
  }
  if (request.method === "GET" && key === "verticals") {
    const items = await prisma.businessVertical.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } });
    return jsonOk(items);
  }
  if (request.method === "GET" && key === "services") {
    const items = await prisma.service.findMany({ where: { published: true, deletedAt: null }, orderBy: { sortOrder: "asc" } });
    return jsonOk(items);
  }
  if (request.method === "GET" && key === "blog") {
    const items = await prisma.blogPost.findMany({ where: { published: true, deletedAt: null }, orderBy: { publishedAt: "desc" } });
    return jsonOk(items);
  }
  if (request.method === "GET" && slug[0] === "blog" && slug[1]) {
    const post = await prisma.blogPost.findFirst({ where: { slug: slug[1], published: true, deletedAt: null } });
    if (!post) throw new ApiError(404, "NOT_FOUND", "Article not found.");
    return jsonOk(post);
  }

  if (request.method === "POST" && key === "enquiries") {
    if (!assertSameOrigin(request)) throw new ApiError(403, "ORIGIN", "Cross-site submission was rejected.");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!rateLimit(`api-enquiry:${ip}`, 6, 10 * 60 * 1000).ok) throw new ApiError(429, "RATE_LIMIT", "Too many enquiries.");
    const body = await request.json().catch(() => null);
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) throw new ApiError(422, "VALIDATION", "Check the submitted fields.", fieldErrors(parsed.error));
    if (parsed.data.website_url) return jsonOk({ accepted: true });
    const reference = await nextReference("AP-ENQ");
    const enquiry = await prisma.enquiry.create({
      data: {
        reference,
        type: parsed.data.type,
        name: parsed.data.name,
        company: parsed.data.company || "",
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        message: parsed.data.message,
        sourcePath: parsed.data.sourcePath || "/api/v1/enquiries",
      },
    });
    await notifyStaff("ENQUIRY", `New enquiry ${reference}`, parsed.data.subject);
    await audit({ action: "CREATE", entity: "Enquiry", entityId: enquiry.id, summary: reference });
    return jsonOk({ reference }, undefined, 201);
  }

  if (request.method === "GET" && key === "admin/dashboard") {
    await requireApiPermission("dashboard.view");
    const [enquiries, products, farmers, buyers, vendors] = await Promise.all([
      prisma.enquiry.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null, published: true } }),
      prisma.farmer.count({ where: { deletedAt: null } }),
      prisma.buyer.count({ where: { deletedAt: null } }),
      prisma.vendor.count({ where: { deletedAt: null } }),
    ]);
    return jsonOk({ enquiries, products, farmers, buyers, vendors });
  }

  if (request.method === "GET" && key === "admin/enquiries") {
    await requireApiPermission("enquiries.manage");
    const { page, pageSize, skip } = pageQuery(url, 20);
    const where = { deletedAt: null };
    const [total, items] = await prisma.$transaction([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    ]);
    return jsonOk(items, { page, pageSize, total, pageCount: Math.ceil(total / pageSize) });
  }

  if (request.method === "GET" && key === "admin/reports") {
    await requireApiPermission("reports.view");
    const byStatus = await prisma.enquiry.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } });
    return jsonOk({ enquiriesByStatus: byStatus });
  }

  if (request.method === "GET" && slug[0] === "media" && slug[1]) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id: slug[1], deletedAt: null } });
    if (!asset) throw new ApiError(404, "NOT_FOUND", "File not found.");
    if (!asset.isPublic) await requireApiPermission("media.manage");
    if (asset.isPublic) return Response.redirect(new URL(asset.path, request.url));
    const file = await readFile(path.join(process.cwd(), "storage", "private", asset.path));
    return new Response(file, { headers: { "Content-Type": asset.mime, "X-Content-Type-Options": "nosniff" } });
  }

  throw new ApiError(404, "NOT_FOUND", "Resource not found.");
}

function publicProduct(product: {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  availabilityStatus: string;
  indicative: boolean;
  originNote: string;
  qualityNote: string;
  packagingNote: string;
  category?: { slug: string; name: string };
  images?: { url: string; alt: string }[];
}) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    summary: product.summary,
    description: product.description,
    availabilityStatus: product.availabilityStatus,
    indicative: product.indicative,
    originNote: product.originNote,
    qualityNote: product.qualityNote,
    packagingNote: product.packagingNote,
    category: product.category ? { slug: product.category.slug, name: product.category.name } : null,
    images: product.images ?? [],
  };
}

async function dispatch(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  const started = Date.now();
  const { slug } = await context.params;
  try {
    const response = await handle(request, slug);
    console.info(JSON.stringify({ method: request.method, path: `/api/v1/${slug.join("/")}`, status: response.status, ms: Date.now() - started }));
    return response;
  } catch (error) {
    const response = jsonError(error);
    console.info(JSON.stringify({ method: request.method, path: `/api/v1/${slug.join("/")}`, status: response.status, ms: Date.now() - started }));
    return response;
  }
}

export const GET = dispatch;
export const POST = dispatch;
