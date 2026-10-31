"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { audit, clientIp } from "@/server/audit";
import { notifyStaff, sendTemplate } from "@/server/mail";
import { rateLimit } from "@/server/rate-limit";
import { nextReference } from "@/server/reference";
import { clearSession, getCurrentUser, hashPassword, setSession, verifyPassword } from "@/server/auth";
import { hashToken, newToken, siteUrl } from "@/lib/text";
import {
  enquirySchema,
  fieldErrors,
  forgotSchema,
  loginSchema,
  procurementSchema,
  produceSchema,
  registerSchema,
  resetSchema,
  safeNextPath,
} from "@/lib/validation";
import { ENQUIRY_TYPE_LABELS, type EnquiryType } from "@/lib/constants";

type FormState = {
  ok: boolean;
  message: string;
  fields?: Record<string, string>;
  devLink?: string;
};

const idleForm: FormState = { ok: false, message: "" };

function honeypot(formData: FormData) {
  return String(formData.get("website_url") || "").trim().length > 0;
}

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  if (honeypot(formData)) return { ok: true, message: "Thank you. Your enquiry has been recorded." };
  const ip = await clientIp();
  if (!rateLimit(`enquiry:${ip}`, 6, 10 * 60 * 1000).ok) {
    return { ok: false, message: "Too many enquiries from this network. Please wait a few minutes." };
  }

  const parsed = enquirySchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    company: formData.get("company") || "",
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    productId: formData.get("productId") || "",
    sourcePath: formData.get("sourcePath") || "",
  });
  if (!parsed.success) return { ok: false, message: "Please correct the highlighted fields.", fields: fieldErrors(parsed.error) };

  const productId = parsed.data.productId || null;
  if (productId) {
    const product = await prisma.product.findFirst({ where: { id: productId, published: true, deletedAt: null } });
    if (!product) return { ok: false, message: "That product listing is no longer available." };
  }

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
      productId,
      sourcePath: parsed.data.sourcePath || "",
    },
  });

  await notifyStaff("ENQUIRY", `New enquiry ${reference}`, `${parsed.data.name} submitted a ${parsed.data.type} enquiry.`);
  await sendTemplate({
    key: "enquiry-received",
    to: enquiry.email,
    vars: { name: enquiry.name, reference, subject: enquiry.subject },
  });
  const settings = await prisma.companySettings.findUnique({ where: { id: "default" } });
  if (settings?.email) {
    await sendTemplate({
      key: "enquiry-staff",
      to: settings.email,
      vars: {
        reference,
        type: ENQUIRY_TYPE_LABELS[parsed.data.type as EnquiryType] || parsed.data.type,
        name: enquiry.name,
        email: enquiry.email,
        subject: enquiry.subject,
      },
    });
  }
  await audit({ action: "CREATE", entity: "Enquiry", entityId: enquiry.id, summary: `Public enquiry ${reference}` });
  return { ok: true, message: `Thank you. Your enquiry is recorded as ${reference}. It is not an order or a contract.` };
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000).ok) {
    return { ok: false, message: "Too many sign-in attempts. Please wait and try again." };
  }
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || "",
  });
  if (!parsed.success) return { ok: false, message: "Enter the email and password.", fields: fieldErrors(parsed.error) };

  const user = await prisma.user.findFirst({
    where: { email: parsed.data.email.toLowerCase(), deletedAt: null },
    include: { roles: { include: { role: { include: { permissions: true } } } } },
  });
  const valid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) return { ok: false, message: "Email or password is incorrect." };
  if (!user.isActive) return { ok: false, message: "This account is not active. Write to support@agroparks.in if you need help." };
  if (!user.emailVerifiedAt) {
    return { ok: false, message: "Verify your email before signing in. If mail is not configured, ask an administrator to confirm the account." };
  }

  await setSession(user.id);
  await audit({ action: "LOGIN", entity: "User", entityId: user.id, summary: "Signed in", actorId: user.id });
  const staff = user.roles.some((entry) => entry.role.permissions.length > 0);
  const next = safeNextPath(parsed.data.next, staff ? "/admin" : "/account");
  redirect(next);
}

export async function logout() {
  const user = await getCurrentUser();
  if (user) await audit({ action: "LOGOUT", entity: "User", entityId: user.id, summary: "Signed out", actorId: user.id });
  await clearSession();
  redirect("/");
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  if (honeypot(formData)) return { ok: true, message: "Application received." };
  const ip = await clientIp();
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000).ok) {
    return { ok: false, message: "Too many registration attempts. Please try again later." };
  }
  const parsed = registerSchema.safeParse({
    role: formData.get("role"),
    name: formData.get("name"),
    organisation: formData.get("organisation") || "",
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    state: formData.get("state"),
    district: formData.get("district") || "",
    detail: formData.get("detail"),
    buyerType: formData.get("buyerType") || "",
    gstin: String(formData.get("gstin") || "").toUpperCase(),
  });
  if (!parsed.success) return { ok: false, message: "Please correct the highlighted fields.", fields: fieldErrors(parsed.error) };
  const data = parsed.data;
  if (data.role === "FARMER" && !data.district) return { ok: false, message: "Add the district.", fields: { district: "District is required." } };
  if ((data.role === "BUYER" || data.role === "VENDOR") && !data.organisation) {
    return { ok: false, message: "Add the organisation name.", fields: { organisation: "Organisation is required." } };
  }
  if (data.role === "BUYER" && !data.buyerType) {
    return { ok: false, message: "Choose the type of buyer.", fields: { buyerType: "Choose a buyer type." } };
  }

  const email = data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, message: "An account with this email already exists. Sign in or reset the password." };

  const role = await prisma.role.findUniqueOrThrow({ where: { key: data.role } });
  const { raw, hash } = newToken();
  const user = await prisma.user.create({
    data: {
      email,
      name: data.name,
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
      isActive: true,
      roles: { create: { roleId: role.id } },
      tokens: { create: { type: "VERIFY_EMAIL", tokenHash: hash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } },
    },
  });

  if (data.role === "FARMER") {
    await prisma.farmer.create({
      data: {
        userId: user.id,
        fullName: data.name,
        organisation: data.organisation || "",
        email,
        phone: data.phone,
        state: data.state,
        district: data.district || "",
        crops: data.detail,
        message: data.detail,
        status: "PENDING",
      },
    });
  } else if (data.role === "BUYER") {
    await prisma.buyer.create({
      data: {
        userId: user.id,
        contactName: data.name,
        organisation: data.organisation || "",
        buyerType: data.buyerType || "OTHER",
        email,
        phone: data.phone,
        state: data.state,
        requirements: data.detail,
        status: "PENDING",
      },
    });
  } else {
    await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName: data.organisation || data.name,
        contactName: data.name,
        email,
        phone: data.phone,
        gstin: data.gstin || "",
        state: data.state,
        supplyNote: data.detail,
        status: "PENDING",
      },
    });
  }

  const link = `${siteUrl()}/verify-email?token=${raw}`;
  const sent = await sendTemplate({
    key: "verify-email",
    to: email,
    userId: user.id,
    vars: { name: data.name, link },
  });
  await notifyStaff("PARTNER", `New ${data.role.toLowerCase()} application`, `${data.name} applied and is pending review.`);
  await audit({ action: "REGISTER", entity: "User", entityId: user.id, summary: `${data.role} self-registration` });

  return {
    ok: true,
    message: sent.sent
      ? "Account created. Verify your email, then sign in. The partnership application stays pending until the company reviews it."
      : "Account created and stored. Email delivery is not configured, so an administrator must confirm the email before you can sign in. The application is pending review.",
    devLink: !sent.sent && process.env.NODE_ENV !== "production" ? link : undefined,
  };
}

export async function forgotPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = await clientIp();
  if (!rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000).ok) {
    return { ok: false, message: "Too many reset requests. Please wait." };
  }
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, message: "Enter a valid email.", fields: fieldErrors(parsed.error) };
  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findFirst({ where: { email, deletedAt: null, isActive: true } });
  let devLink: string | undefined;
  if (user) {
    const { raw, hash } = newToken();
    await prisma.authToken.create({
      data: { userId: user.id, type: "RESET_PASSWORD", tokenHash: hash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });
    const link = `${siteUrl()}/reset-password?token=${raw}`;
    const sent = await sendTemplate({ key: "reset-password", to: email, userId: user.id, vars: { name: user.name, link } });
    if (!sent.sent && process.env.NODE_ENV !== "production") devLink = link;
    await audit({ action: "PASSWORD_RESET_REQUEST", entity: "User", entityId: user.id, summary: "Password reset requested" });
  }
  return {
    ok: true,
    message: "If an active account uses that email, reset instructions have been prepared.",
    devLink,
  };
}

export async function resetPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse({ token: formData.get("token"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Choose a stronger password.", fields: fieldErrors(parsed.error) };
  const token = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } });
  if (!token || token.type !== "RESET_PASSWORD" || token.usedAt || token.expiresAt < new Date()) {
    return { ok: false, message: "This reset link is invalid or has expired." };
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }),
    prisma.authToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
  ]);
  await audit({ action: "PASSWORD_RESET", entity: "User", entityId: token.userId, summary: "Password changed by reset link" });
  return { ok: true, message: "Password updated. You can sign in." };
}

export async function verifyEmail(tokenRaw: string) {
  const token = await prisma.authToken.findUnique({ where: { tokenHash: hashToken(tokenRaw) } });
  if (!token || token.type !== "VERIFY_EMAIL" || token.usedAt || token.expiresAt < new Date()) return false;
  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.authToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
  ]);
  await audit({ action: "VERIFY_EMAIL", entity: "User", entityId: token.userId, summary: "Email verified" });
  return true;
}

export async function addProduce(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Sign in to add produce." };
  const farmer = await prisma.farmer.findUnique({ where: { userId: user.id } });
  if (!farmer || farmer.deletedAt) return { ok: false, message: "A farmer profile is required." };
  const parsed = produceSchema.safeParse({
    crop: formData.get("crop"),
    harvestWindow: formData.get("harvestWindow") || "",
    location: formData.get("location") || "",
    quantityNote: formData.get("quantityNote") || "",
  });
  if (!parsed.success) return { ok: false, message: "Check the produce details.", fields: fieldErrors(parsed.error) };
  await prisma.farmerProduce.create({ data: { farmerId: farmer.id, ...parsed.data, harvestWindow: parsed.data.harvestWindow || "", location: parsed.data.location || "", quantityNote: parsed.data.quantityNote || "" } });
  await notifyStaff("PRODUCE", "Farmer produce note", `${farmer.fullName} added ${parsed.data.crop}.`);
  return { ok: true, message: "Produce note saved. It is an expression of interest, not a confirmed sale." };
}

export async function createProcurement(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  const parsed = procurementSchema.safeParse({
    organisation: formData.get("organisation"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    productName: formData.get("productName"),
    quantityNote: formData.get("quantityNote"),
    deliveryNote: formData.get("deliveryNote") || "",
    details: formData.get("details"),
  });
  if (!parsed.success) return { ok: false, message: "Check the procurement details.", fields: fieldErrors(parsed.error) };
  const buyer = user ? await prisma.buyer.findUnique({ where: { userId: user.id } }) : null;
  const reference = await nextReference("AP-PR");
  await prisma.procurementRequest.create({
    data: {
      reference,
      buyerId: buyer?.id,
      organisation: parsed.data.organisation,
      contactName: parsed.data.contactName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      productName: parsed.data.productName,
      quantityNote: parsed.data.quantityNote,
      deliveryNote: parsed.data.deliveryNote || "",
      details: parsed.data.details,
    },
  });
  await notifyStaff("PROCUREMENT", `Procurement ${reference}`, `${parsed.data.organisation} requested ${parsed.data.productName}.`);
  await audit({ action: "CREATE", entity: "ProcurementRequest", summary: reference, actorId: user?.id });
  return { ok: true, message: `Procurement request ${reference} is stored. It is not a purchase order.` };
}

export async function addProduceForm(formData: FormData) {
  const result = await addProduce(idleForm, formData);
  redirect(`/account?notice=${result.ok ? "saved" : "invalid"}`);
}

export async function createProcurementForm(formData: FormData) {
  const result = await createProcurement(idleForm, formData);
  redirect(`/account?notice=${result.ok ? "saved" : "invalid"}`);
}

