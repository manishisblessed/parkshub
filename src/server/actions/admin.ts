"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { audit } from "@/server/audit";
import { getCurrentUser, hashPassword } from "@/server/auth";
import { notifyStaff, sendTemplate } from "@/server/mail";
import { nextReference } from "@/server/reference";
import { storeUpload } from "@/server/storage";
import { applyMovement, siteUrl, slugify } from "@/lib/text";
import type { PermissionKey } from "@/lib/constants";
import { PUBLIC_ROLES } from "@/lib/constants";

async function gate(permission: PermissionKey) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.permissions.includes(permission)) redirect("/account?notice=forbidden");
  return user;
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function back(path: string, notice = "saved"): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}notice=${notice}`);
}

export async function saveSettings(formData: FormData) {
  const user = await gate("settings.manage");
  const features = {
    marketplace: checked(formData, "marketplace"),
    payments: false,
    farmOperations: checked(formData, "farmOperations"),
    inventory: checked(formData, "inventory"),
    logistics: false,
    sms: false,
    whatsapp: false,
  };
  await prisma.companySettings.update({
    where: { id: "default" },
    data: {
      phone: text(formData, "phone"),
      heroEyebrow: text(formData, "heroEyebrow"),
      heroTitle: text(formData, "heroTitle"),
      heroLede: text(formData, "heroLede"),
      introHeading: text(formData, "introHeading"),
      introBody: text(formData, "introBody"),
      ctaHeading: text(formData, "ctaHeading"),
      ctaBody: text(formData, "ctaBody"),
      seoTitle: text(formData, "seoTitle"),
      seoDescription: text(formData, "seoDescription"),
      mapsEmbedUrl: text(formData, "mapsEmbedUrl"),
      publicNotice: text(formData, "publicNotice"),
      featuresJson: JSON.stringify(features),
    },
  });
  await audit({ action: "UPDATE", entity: "CompanySettings", entityId: "default", summary: "Website settings updated", actorId: user.id });
  back("/admin/settings");
}

export async function saveSection(formData: FormData) {
  const user = await gate("content.manage");
  const id = text(formData, "id");
  await prisma.pageSection.update({
    where: { id },
    data: { heading: text(formData, "heading"), body: text(formData, "body"), published: checked(formData, "published") },
  });
  await audit({ action: "UPDATE", entity: "PageSection", entityId: id, summary: "Page section updated", actorId: user.id });
  back(`/admin/pages?page=${text(formData, "slug")}`);
}

export async function saveLegal(formData: FormData) {
  const user = await gate("content.manage");
  const id = text(formData, "id");
  const status = text(formData, "status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  await prisma.legalDocument.update({
    where: { id },
    data: { title: text(formData, "title"), body: text(formData, "body"), status, reviewNote: text(formData, "reviewNote"), metaDescription: text(formData, "metaDescription") },
  });
  await audit({ action: "UPDATE", entity: "LegalDocument", entityId: id, summary: `Legal document marked ${status}`, actorId: user.id });
  back("/admin/legal");
}

export async function saveFaq(formData: FormData) {
  const user = await gate("content.manage");
  const id = text(formData, "id");
  if (id) {
    await prisma.faq.update({
      where: { id },
      data: { question: text(formData, "question"), answer: text(formData, "answer"), sortOrder: Number(text(formData, "sortOrder") || 0), published: checked(formData, "published") },
    });
  } else {
    await prisma.faq.create({
      data: { question: text(formData, "question"), answer: text(formData, "answer"), sortOrder: Number(text(formData, "sortOrder") || 0), published: checked(formData, "published") },
    });
  }
  await audit({ action: "SAVE", entity: "Faq", entityId: id, summary: "FAQ saved", actorId: user.id });
  back("/admin/faqs");
}

export async function deleteFaq(formData: FormData) {
  const user = await gate("content.manage");
  const id = text(formData, "id");
  await prisma.faq.delete({ where: { id } });
  await audit({ action: "DELETE", entity: "Faq", entityId: id, summary: "FAQ removed", actorId: user.id });
  back("/admin/faqs", "deleted");
}

export async function saveVertical(formData: FormData) {
  const user = await gate("content.manage");
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    summary: text(formData, "summary"),
    overview: text(formData, "overview"),
    capabilities: text(formData, "capabilities"),
    benefits: text(formData, "benefits"),
    availabilityNote: text(formData, "availabilityNote"),
    image: text(formData, "image"),
    imageAlt: text(formData, "imageAlt"),
    metaTitle: text(formData, "metaTitle"),
    metaDescription: text(formData, "metaDescription"),
    published: checked(formData, "published"),
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };
  if (!data.title || !data.image.startsWith("/")) back(`/admin/verticals/${id || "new"}`, "invalid");
  if (id) await prisma.businessVertical.update({ where: { id }, data });
  else {
    await prisma.businessVertical.create({ data: { ...data, slug: slugify(data.title), status: "AUTHORISED" } });
  }
  await audit({ action: "SAVE", entity: "BusinessVertical", entityId: id, summary: data.title, actorId: user.id });
  back("/admin/verticals");
}

export async function saveService(formData: FormData) {
  const user = await gate("content.manage");
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    summary: text(formData, "summary"),
    overview: text(formData, "overview"),
    scopeNote: text(formData, "scopeNote"),
    availability: text(formData, "availability") || "ON_ENQUIRY",
    image: text(formData, "image"),
    imageAlt: text(formData, "imageAlt"),
    metaTitle: text(formData, "metaTitle"),
    metaDescription: text(formData, "metaDescription"),
    published: checked(formData, "published"),
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data: { ...data, slug: slugify(data.title) } });
  await audit({ action: "SAVE", entity: "Service", entityId: id, summary: data.title, actorId: user.id });
  back("/admin/services");
}

export async function saveCategory(formData: FormData) {
  const user = await gate("products.manage");
  const id = text(formData, "id");
  const name = text(formData, "name");
  const description = text(formData, "description");
  if (!name) back("/admin/categories", "invalid");
  if (id) await prisma.productCategory.update({ where: { id }, data: { name, description, published: checked(formData, "published") } });
  else await prisma.productCategory.create({ data: { name, description, slug: slugify(name), sortOrder: 100, published: checked(formData, "published") } });
  await audit({ action: "SAVE", entity: "ProductCategory", entityId: id, summary: name, actorId: user.id });
  back("/admin/categories");
}

export async function saveProduct(formData: FormData) {
  const user = await gate("products.manage");
  const id = text(formData, "id");
  const name = text(formData, "name");
  const categoryId = text(formData, "categoryId");
  const image = text(formData, "image");
  if (!name || !categoryId) back(id ? `/admin/products/${id}` : "/admin/products/new", "invalid");
  if (image && !image.startsWith("/images/") && !image.startsWith("/uploads/")) {
    back(id ? `/admin/products/${id}` : "/admin/products/new", "invalid");
  }
  const data = {
    name,
    summary: text(formData, "summary"),
    description: text(formData, "description"),
    categoryId,
    originNote: text(formData, "originNote"),
    qualityNote: text(formData, "qualityNote"),
    packagingNote: text(formData, "packagingNote"),
    availabilityStatus: text(formData, "availabilityStatus") || "ENQUIRY_ONLY",
    indicative: checked(formData, "indicative"),
    published: checked(formData, "published"),
    metaTitle: text(formData, "metaTitle") || name,
    metaDescription: text(formData, "metaDescription") || text(formData, "summary"),
  };
  let productId = id;
  if (id) await prisma.product.update({ where: { id }, data });
  else {
    const created = await prisma.product.create({ data: { ...data, slug: `${slugify(name)}-${Date.now().toString().slice(-4)}` } });
    productId = created.id;
  }
  if (image) {
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.productImage.create({ data: { productId, url: image, alt: text(formData, "imageAlt") || `Photograph for ${name}`, sortOrder: 0 } });
  }
  await audit({ action: "SAVE", entity: "Product", entityId: productId, summary: name, actorId: user.id });
  back("/admin/products");
}

export async function archiveProduct(formData: FormData) {
  const user = await gate("products.manage");
  const id = text(formData, "id");
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
  await audit({ action: "ARCHIVE", entity: "Product", entityId: id, summary: "Product archived", actorId: user.id });
  back("/admin/products", "deleted");
}

export async function savePost(formData: FormData) {
  const user = await gate("blog.manage");
  const id = text(formData, "id");
  const title = text(formData, "title");
  const published = checked(formData, "published");
  const data = {
    title,
    excerpt: text(formData, "excerpt"),
    body: text(formData, "body"),
    coverImage: text(formData, "coverImage"),
    coverAlt: text(formData, "coverAlt"),
    metaTitle: text(formData, "metaTitle") || title,
    metaDescription: text(formData, "metaDescription") || text(formData, "excerpt"),
    published,
    publishedAt: published ? new Date() : null,
  };
  if (id) {
    const current = await prisma.blogPost.findUnique({ where: { id } });
    await prisma.blogPost.update({ where: { id }, data: { ...data, publishedAt: published ? current?.publishedAt ?? new Date() : null } });
  } else {
    await prisma.blogPost.create({ data: { ...data, slug: slugify(title) } });
  }
  await audit({ action: "SAVE", entity: "BlogPost", entityId: id, summary: title, actorId: user.id });
  back("/admin/blog");
}

export async function uploadMedia(formData: FormData) {
  const user = await gate("media.manage");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) back("/admin/media", "invalid");
  const isPublic = !checked(formData, "private");
  const stored = await storeUpload(file, { isPublic });
  await prisma.mediaAsset.create({
    data: {
      filename: stored.filename,
      originalName: file.name.slice(0, 180),
      mime: stored.mime,
      size: stored.size,
      path: stored.path,
      alt: text(formData, "alt"),
      isPublic: stored.isPublic,
      uploadedById: user.id,
    },
  });
  await audit({ action: "UPLOAD", entity: "MediaAsset", summary: file.name, actorId: user.id });
  back("/admin/media");
}

export async function archiveMedia(formData: FormData) {
  const user = await gate("media.manage");
  const id = text(formData, "id");
  await prisma.mediaAsset.update({ where: { id }, data: { deletedAt: new Date() } });
  await audit({ action: "ARCHIVE", entity: "MediaAsset", entityId: id, summary: "Media archived", actorId: user.id });
  back("/admin/media", "deleted");
}

export async function setEnquiryStatus(formData: FormData) {
  const user = await gate("enquiries.manage");
  const id = text(formData, "id");
  const status = text(formData, "status");
  await prisma.enquiry.update({ where: { id }, data: { status } });
  await audit({ action: "STATUS", entity: "Enquiry", entityId: id, summary: status, actorId: user.id });
  back(`/admin/enquiries/${id}`);
}

export async function replyEnquiry(formData: FormData) {
  const user = await gate("enquiries.manage");
  const id = text(formData, "id");
  const body = text(formData, "body");
  const internal = checked(formData, "internal");
  if (body.length < 2) back(`/admin/enquiries/${id}`, "invalid");
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) redirect("/admin/enquiries");
  await prisma.enquiryMessage.create({ data: { enquiryId: id, authorId: user.id, body, internal } });
  if (!internal) {
    await prisma.enquiry.update({ where: { id }, data: { status: "RESPONDED" } });
    await sendTemplate({ key: "enquiry-reply", to: enquiry.email, vars: { name: enquiry.name, reference: enquiry.reference, body } });
  }
  await audit({ action: "REPLY", entity: "Enquiry", entityId: id, summary: internal ? "Internal note" : "Reply sent or stored", actorId: user.id });
  back(`/admin/enquiries/${id}`);
}

export async function openOrderFromEnquiry(formData: FormData) {
  const user = await gate("enquiries.manage");
  const id = text(formData, "id");
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) redirect("/admin/enquiries");
  const reference = await nextReference("AP-ORD");
  await prisma.orderEnquiry.create({
    data: {
      reference,
      organisation: enquiry.company || enquiry.name,
      contactName: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      itemsSummary: `${enquiry.subject}\n\n${enquiry.message}`,
      notes: `Opened from enquiry ${enquiry.reference}. This is not a tax invoice or a payment instruction.`,
    },
  });
  await audit({ action: "CREATE", entity: "OrderEnquiry", summary: `${reference} from ${enquiry.reference}`, actorId: user.id });
  back("/admin/orders");
}

async function notifyPartner(kind: string, email: string, name: string, status: string, reviewNote: string) {
  await sendTemplate({
    key: "application-status",
    to: email,
    vars: { name, role: kind, status, note: reviewNote || "No additional note.", link: `${siteUrl()}/login` },
  });
}

async function setPartnerStatus(kind: "farmer" | "buyer" | "vendor", formData: FormData) {
  const user = await gate("partners.manage");
  const id = text(formData, "id");
  const status = text(formData, "status");
  const reviewNote = text(formData, "reviewNote");
  if (kind === "farmer") {
    const record = await prisma.farmer.update({ where: { id }, data: { status, reviewNote } });
    await notifyPartner(kind, record.email, record.fullName, status, reviewNote);
  } else if (kind === "buyer") {
    const record = await prisma.buyer.update({ where: { id }, data: { status, reviewNote } });
    await notifyPartner(kind, record.email, record.contactName, status, reviewNote);
  } else {
    const record = await prisma.vendor.update({ where: { id }, data: { status, reviewNote } });
    await notifyPartner(kind, record.email, record.contactName, status, reviewNote);
  }
  await audit({ action: "STATUS", entity: kind, entityId: id, summary: status, actorId: user.id });
  back(`/admin/${kind}s`);
}

export async function setFarmerStatus(formData: FormData) {
  await setPartnerStatus("farmer", formData);
}
export async function setBuyerStatus(formData: FormData) {
  await setPartnerStatus("buyer", formData);
}
export async function setVendorStatus(formData: FormData) {
  await setPartnerStatus("vendor", formData);
}

export async function saveProcurementStatus(formData: FormData) {
  const user = await gate("procurement.manage");
  const id = text(formData, "id");
  await prisma.procurementRequest.update({ where: { id }, data: { status: text(formData, "status") } });
  await audit({ action: "STATUS", entity: "ProcurementRequest", entityId: id, summary: text(formData, "status"), actorId: user.id });
  back(`/admin/procurement/${id}`);
}

export async function addQuotation(formData: FormData) {
  const user = await gate("procurement.manage");
  const procurementId = text(formData, "procurementId");
  const narrative = text(formData, "narrative");
  if (narrative.length < 5) back(`/admin/procurement/${procurementId}`, "invalid");
  const vendorId = text(formData, "vendorId");
  await prisma.quotation.create({
    data: {
      procurementId,
      vendorId: vendorId || null,
      narrative,
      terms: text(formData, "terms"),
      status: text(formData, "status") || "DRAFT",
    },
  });
  await prisma.procurementRequest.update({ where: { id: procurementId }, data: { status: "QUOTED" } });
  await audit({ action: "CREATE", entity: "Quotation", entityId: procurementId, summary: "Quotation note added. No settlement was calculated.", actorId: user.id });
  back(`/admin/procurement/${procurementId}`);
}

export async function saveOrderStatus(formData: FormData) {
  const user = await gate("enquiries.manage");
  const id = text(formData, "id");
  await prisma.orderEnquiry.update({ where: { id }, data: { status: text(formData, "status"), notes: text(formData, "notes") } });
  await audit({ action: "STATUS", entity: "OrderEnquiry", entityId: id, summary: text(formData, "status"), actorId: user.id });
  back("/admin/orders");
}

export async function createUser(formData: FormData) {
  const actor = await gate("users.manage");
  const email = text(formData, "email").toLowerCase();
  const name = text(formData, "name");
  const password = text(formData, "password");
  const roleKey = text(formData, "role");
  if (!email || !name || password.length < 10) back("/admin/users", "invalid");
  if (roleKey === "SUPER_ADMIN" && !actor.permissions.includes("roles.manage")) back("/admin/users", "forbidden");
  if ((PUBLIC_ROLES as readonly string[]).includes(roleKey) === false && !actor.permissions.includes("users.manage")) back("/admin/users", "forbidden");
  const role = await prisma.role.findUnique({ where: { key: roleKey } });
  if (!role) back("/admin/users", "invalid");
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) back("/admin/users", "exists");
  const user = await prisma.user.create({
    data: {
      email,
      name,
      phone: text(formData, "phone") || null,
      passwordHash: await hashPassword(password),
      emailVerifiedAt: new Date(),
      roles: { create: { roleId: role.id } },
    },
  });
  await audit({ action: "CREATE", entity: "User", entityId: user.id, summary: `${email} as ${roleKey}`, actorId: actor.id });
  back("/admin/users");
}

export async function setUserActive(formData: FormData) {
  const actor = await gate("users.manage");
  const id = text(formData, "id");
  if (id === actor.id) back("/admin/users", "invalid");
  const isActive = text(formData, "isActive") === "true";
  await prisma.user.update({ where: { id }, data: { isActive } });
  await audit({ action: "STATUS", entity: "User", entityId: id, summary: isActive ? "Activated" : "Deactivated", actorId: actor.id });
  back("/admin/users");
}

export async function setUserRole(formData: FormData) {
  const actor = await gate("users.manage");
  const id = text(formData, "id");
  const roleKey = text(formData, "role");
  if (roleKey === "SUPER_ADMIN" && !actor.permissions.includes("roles.manage")) back("/admin/users", "forbidden");
  const role = await prisma.role.findUnique({ where: { key: roleKey } });
  if (!role) back("/admin/users", "invalid");
  await prisma.userRole.deleteMany({ where: { userId: id } });
  await prisma.userRole.create({ data: { userId: id, roleId: role.id } });
  await audit({ action: "ROLE", entity: "User", entityId: id, summary: roleKey, actorId: actor.id });
  back("/admin/users");
}

export async function verifyUserEmail(formData: FormData) {
  const actor = await gate("users.manage");
  const id = text(formData, "id");
  await prisma.user.update({ where: { id }, data: { emailVerifiedAt: new Date() } });
  await audit({ action: "VERIFY_EMAIL", entity: "User", entityId: id, summary: "Email confirmed by staff", actorId: actor.id });
  back("/admin/users");
}

export async function saveFarm(formData: FormData) {
  const user = await gate("farms.manage");
  const id = text(formData, "id");
  const data = {
    name: text(formData, "name"),
    code: text(formData, "code").toUpperCase(),
    location: text(formData, "location"),
    district: text(formData, "district"),
    state: text(formData, "state"),
    areaNote: text(formData, "areaNote"),
    status: text(formData, "status") || "DRAFT",
    notes: text(formData, "notes"),
  };
  if (!data.name || !data.code) back("/admin/farms", "invalid");
  if (id) await prisma.farm.update({ where: { id }, data });
  else await prisma.farm.create({ data });
  await audit({ action: "SAVE", entity: "Farm", entityId: id, summary: data.code, actorId: user.id });
  back(id ? `/admin/farms/${id}` : "/admin/farms");
}

export async function addPlot(formData: FormData) {
  const user = await gate("farms.manage");
  const farmId = text(formData, "farmId");
  await prisma.farmPlot.create({ data: { farmId, name: text(formData, "name"), areaNote: text(formData, "areaNote"), soilNote: text(formData, "soilNote") } });
  await audit({ action: "CREATE", entity: "FarmPlot", entityId: farmId, summary: text(formData, "name"), actorId: user.id });
  back(`/admin/farms/${farmId}`);
}

export async function addCrop(formData: FormData) {
  const user = await gate("farms.manage");
  const plotId = text(formData, "plotId");
  const farmId = text(formData, "farmId");
  await prisma.cropRecord.create({
    data: { plotId, crop: text(formData, "crop"), season: text(formData, "season"), sowingDate: text(formData, "sowingDate"), status: text(formData, "status") || "PLANNED", notes: text(formData, "notes") },
  });
  await audit({ action: "CREATE", entity: "CropRecord", entityId: plotId, summary: text(formData, "crop"), actorId: user.id });
  back(`/admin/farms/${farmId}`);
}

export async function addCropNote(formData: FormData) {
  const user = await gate("farms.manage");
  const cropId = text(formData, "cropId");
  const farmId = text(formData, "farmId");
  const kind = text(formData, "kind");
  if (kind === "irrigation") {
    await prisma.irrigationRecord.create({ data: { cropId, date: text(formData, "date"), method: text(formData, "method"), notes: text(formData, "notes") } });
  } else if (kind === "input") {
    await prisma.inputRecord.create({ data: { cropId, date: text(formData, "date"), inputType: text(formData, "method"), quantityNote: text(formData, "quantityNote"), notes: text(formData, "notes") } });
  } else if (kind === "harvest") {
    await prisma.harvestRecord.create({ data: { cropId, date: text(formData, "date"), quantityNote: text(formData, "quantityNote"), unit: text(formData, "unit"), notes: text(formData, "notes") } });
  } else back(`/admin/farms/${farmId}`, "invalid");
  await audit({ action: "CREATE", entity: "CropNote", entityId: cropId, summary: kind, actorId: user.id });
  back(`/admin/farms/${farmId}`);
}

export async function addExpense(formData: FormData) {
  const user = await gate("farms.manage");
  const farmId = text(formData, "farmId");
  await prisma.farmExpense.create({
    data: { farmId, date: text(formData, "date"), category: text(formData, "category"), amountNote: text(formData, "amountNote"), notes: text(formData, "notes") },
  });
  await audit({ action: "CREATE", entity: "FarmExpense", entityId: farmId, summary: text(formData, "category"), actorId: user.id });
  back(`/admin/farms/${farmId}`);
}

export async function saveWarehouse(formData: FormData) {
  const user = await gate("inventory.manage");
  await prisma.warehouse.create({
    data: { name: text(formData, "name"), location: text(formData, "location"), kind: text(formData, "kind") || "WAREHOUSE", status: text(formData, "status") || "PLANNED", notes: text(formData, "notes") },
  });
  await audit({ action: "CREATE", entity: "Warehouse", summary: text(formData, "name"), actorId: user.id });
  back("/admin/inventory");
}

export async function saveItem(formData: FormData) {
  const user = await gate("inventory.manage");
  await prisma.inventoryItem.create({
    data: { sku: text(formData, "sku").toUpperCase(), name: text(formData, "name"), category: text(formData, "category"), unit: text(formData, "unit"), notes: text(formData, "notes") },
  });
  await audit({ action: "CREATE", entity: "InventoryItem", summary: text(formData, "sku"), actorId: user.id });
  back("/admin/inventory");
}

export async function saveBatch(formData: FormData) {
  const user = await gate("inventory.manage");
  const quantity = text(formData, "quantity");
  applyMovement("0", "IN", quantity);
  await prisma.inventoryBatch.create({
    data: {
      itemId: text(formData, "itemId"),
      warehouseId: text(formData, "warehouseId") || null,
      batchNumber: text(formData, "batchNumber"),
      sourceNote: text(formData, "sourceNote"),
      receivedOn: text(formData, "receivedOn"),
      quantity,
      unit: text(formData, "unit"),
      status: "RECEIVED",
      qualityNote: text(formData, "qualityNote"),
    },
  });
  await audit({ action: "CREATE", entity: "InventoryBatch", summary: text(formData, "batchNumber"), actorId: user.id });
  back("/admin/inventory");
}

export async function moveStock(formData: FormData) {
  const user = await gate("inventory.manage");
  const batchId = text(formData, "batchId");
  const batch = await prisma.inventoryBatch.findUnique({ where: { id: batchId } });
  if (!batch) back("/admin/inventory", "invalid");
  let next = batch.quantity;
  try {
    next = applyMovement(batch.quantity, text(formData, "type"), text(formData, "quantity"));
  } catch {
    back("/admin/inventory", "invalid");
  }
  await prisma.$transaction([
    prisma.inventoryBatch.update({ where: { id: batchId }, data: { quantity: next } }),
    prisma.stockMovement.create({
      data: { batchId, type: text(formData, "type"), quantity: text(formData, "quantity"), note: text(formData, "note"), createdById: user.id },
    }),
  ]);
  await audit({ action: "MOVE", entity: "InventoryBatch", entityId: batchId, summary: `${text(formData, "type")} ${text(formData, "quantity")}`, actorId: user.id });
  back("/admin/inventory");
}

export async function saveCompliance(formData: FormData) {
  const user = await gate("compliance.manage");
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    authority: text(formData, "authority"),
    referenceNo: text(formData, "referenceNo"),
    issuedOn: text(formData, "issuedOn"),
    expiresOn: text(formData, "expiresOn"),
    status: text(formData, "status") || "RECORDED",
    notes: text(formData, "notes"),
  };
  if (id) await prisma.complianceRecord.update({ where: { id }, data });
  else await prisma.complianceRecord.create({ data });
  await audit({ action: "SAVE", entity: "ComplianceRecord", entityId: id, summary: data.title, actorId: user.id });
  back("/admin/compliance");
}

export async function markNotificationRead(formData: FormData) {
  const user = await gate("dashboard.view");
  const id = text(formData, "id");
  await prisma.notification.update({ where: { id }, data: { readAt: new Date(), userId: user.id } });
  back("/admin/notifications");
}

export async function saveEmailTemplate(formData: FormData) {
  const user = await gate("settings.manage");
  const id = text(formData, "id");
  await prisma.emailTemplate.update({ where: { id }, data: { subject: text(formData, "subject"), body: text(formData, "body") } });
  await audit({ action: "UPDATE", entity: "EmailTemplate", entityId: id, summary: "Template updated", actorId: user.id });
  back("/admin/settings");
}

export async function resendVerification(formData: FormData) {
  await gate("users.manage");
  const id = text(formData, "id");
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) back("/admin/users", "invalid");
  const { raw, hash } = (await import("@/lib/text")).newToken();
  await prisma.authToken.create({
    data: { userId: id, type: "VERIFY_EMAIL", tokenHash: hash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  });
  const link = `${siteUrl()}/verify-email?token=${raw}`;
  const sent = await sendTemplate({ key: "verify-email", to: user.email, userId: user.id, vars: { name: user.name, link } });
  await notifyStaff("VERIFY", "Verification link prepared", sent.sent ? `Sent to ${user.email}` : `SMTP is not configured for ${user.email}`);
  back("/admin/users", sent.sent ? "saved" : "mail-skipped");
}
