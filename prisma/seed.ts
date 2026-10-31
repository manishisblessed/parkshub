import { readFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { DEV_ADMIN_PASSWORD, PERMISSIONS, ROLE_DEFINITIONS } from "../src/lib/constants";
import {
  categories,
  emailTemplates,
  faqs,
  integrations,
  legalDocuments,
  pages,
  posts,
  products,
  services,
  settingsSeed,
  verticals,
} from "./content";

function loadEnv() {
  const file = path.join(process.cwd(), ".env");
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@agroparks.in").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || DEV_ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production" && adminPassword === DEV_ADMIN_PASSWORD) {
    throw new Error("Refusing to seed the development admin password in production.");
  }

  for (const [key, name] of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: { name, description: name },
      create: { key, name, description: name },
    });
  }

  for (const role of ROLE_DEFINITIONS) {
    const saved = await prisma.role.upsert({
      where: { key: role.key },
      update: { name: role.name, description: role.description },
      create: { key: role.key, name: role.name, description: role.description },
    });
    await prisma.rolePermission.deleteMany({ where: { roleId: saved.id } });
    for (const key of role.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.create({ data: { roleId: saved.id, permissionId: permission.id } });
    }
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const superAdmin = await prisma.role.findUniqueOrThrow({ where: { key: "SUPER_ADMIN" } });
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "AGRO PARKS Administrator",
        passwordHash: await bcrypt.hash(adminPassword, 12),
        emailVerifiedAt: new Date(),
        isActive: true,
        roles: { create: { roleId: superAdmin.id } },
      },
    });
  }

  const settings = await prisma.companySettings.findUnique({ where: { id: "default" } });
  if (!settings) await prisma.companySettings.create({ data: { id: "default", ...settingsSeed } });

  for (const category of categories) {
    const found = await prisma.productCategory.findUnique({ where: { slug: category.slug } });
    if (!found) await prisma.productCategory.create({ data: category });
  }

  for (const product of products) {
    const found = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (found) continue;
    const category = await prisma.productCategory.findUniqueOrThrow({ where: { slug: product.category } });
    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        summary: product.summary,
        description: product.description,
        categoryId: category.id,
        originNote: product.originNote,
        qualityNote: product.qualityNote,
        packagingNote: product.packagingNote,
        availabilityStatus: product.availabilityStatus,
        indicative: product.indicative,
        published: true,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        images: { create: [{ url: product.image, alt: product.imageAlt, sortOrder: 0 }] },
      },
    });
  }

  for (const vertical of verticals) {
    const found = await prisma.businessVertical.findUnique({ where: { slug: vertical.slug } });
    if (!found) await prisma.businessVertical.create({ data: vertical });
  }

  for (const service of services) {
    const found = await prisma.service.findUnique({ where: { slug: service.slug } });
    if (!found) await prisma.service.create({ data: service });
  }

  for (const [index, [question, answer]] of faqs.entries()) {
    const found = await prisma.faq.findFirst({ where: { question } });
    if (!found) await prisma.faq.create({ data: { question, answer, sortOrder: index, published: true } });
  }

  for (const post of posts) {
    const found = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!found) {
      await prisma.blogPost.create({
        data: { ...post, publishedAt: new Date() },
      });
    }
  }

  for (const [slug, page] of Object.entries(pages)) {
    let saved = await prisma.page.findUnique({ where: { slug } });
    if (!saved) {
      saved = await prisma.page.create({
        data: { slug, title: page.title, metaTitle: page.metaTitle, metaDescription: page.metaDescription },
      });
    }
    for (const [index, [key, heading, body]] of page.sections.entries()) {
      const section = await prisma.pageSection.findUnique({ where: { pageId_key: { pageId: saved.id, key } } });
      if (!section) {
        await prisma.pageSection.create({ data: { pageId: saved.id, key, heading, body, sortOrder: index } });
      }
    }
  }

  for (const document of legalDocuments) {
    const found = await prisma.legalDocument.findUnique({ where: { slug: document.slug } });
    if (!found) await prisma.legalDocument.create({ data: { ...document, status: "DRAFT" } });
  }

  for (const [key, subject, body] of emailTemplates) {
    const found = await prisma.emailTemplate.findUnique({ where: { key } });
    if (!found) await prisma.emailTemplate.create({ data: { key, subject, body } });
  }

  for (const [key, name, description] of integrations) {
    const found = await prisma.integrationConfig.findUnique({ where: { key } });
    if (!found) {
      await prisma.integrationConfig.create({
        data: {
          key,
          name,
          description,
          enabled: false,
          statusNote: "Not configured. Add the provider credentials to the server environment only after the business approves the integration.",
        },
      });
    }
  }

  const gst = await prisma.complianceRecord.findFirst({ where: { referenceNo: "07ABGCA8036N1Z9" } });
  if (!gst) {
    await prisma.complianceRecord.create({
      data: {
        title: "GST registration",
        authority: "Goods and Services Tax Network",
        referenceNo: "07ABGCA8036N1Z9",
        issuedOn: "2026-10-05",
        status: "ACTIVE",
        notes:
          "Regular registration. Principal place of business: 3rd Floor, TF-9, Eros Metro Mall, Sector 14 Dwarka, New Delhi 110078. This record is not a seed licence, FSSAI licence, or warehouse approval.",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
