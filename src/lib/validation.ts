import { z } from "zod";
import { ENQUIRY_TYPES, PUBLIC_ROLES } from "@/lib/constants";

const trimmed = (min: number, max: number) => z.string().trim().min(min).max(max);

export const phoneSchema = z
  .string()
  .trim()
  .min(8, "Enter a phone number")
  .max(20)
  .regex(/^\+?[0-9][0-9\s()-]{6,18}$/, "Enter a valid phone number");

export const emailSchema = z.string().trim().email("Enter a valid email").max(160);

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Include a letter")
  .regex(/[0-9]/, "Include a number");

export const enquirySchema = z.object({
  type: z.enum(ENQUIRY_TYPES),
  name: trimmed(2, 120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: emailSchema,
  phone: phoneSchema,
  subject: trimmed(3, 180),
  message: trimmed(10, 5000),
  productId: z.string().trim().max(80).optional().or(z.literal("")),
  sourcePath: z.string().trim().max(200).optional().or(z.literal("")),
  website_url: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
  next: z.string().max(200).optional().or(z.literal("")),
});

export const registerSchema = z.object({
  role: z.enum(PUBLIC_ROLES),
  name: trimmed(2, 120),
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  state: trimmed(2, 80),
  district: z.string().trim().max(80).optional().or(z.literal("")),
  detail: trimmed(10, 4000),
  buyerType: z.enum(["INSTITUTIONAL", "DISTRIBUTOR", "RETAILER", "PROCESSOR", "OTHER"]).optional().or(z.literal("")),
  gstin: z
    .string()
    .trim()
    .max(15)
    .regex(/^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, "Enter a valid GSTIN or leave blank")
    .optional()
    .or(z.literal("")),
});

export const forgotSchema = z.object({ email: emailSchema });

export const resetSchema = z.object({
  token: z.string().trim().min(20).max(200),
  password: passwordSchema,
});

export const produceSchema = z.object({
  crop: trimmed(2, 120),
  harvestWindow: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  quantityNote: z.string().trim().max(160).optional().or(z.literal("")),
});

export const procurementSchema = z.object({
  organisation: trimmed(2, 160),
  contactName: trimmed(2, 120),
  email: emailSchema,
  phone: phoneSchema,
  productName: trimmed(2, 160),
  quantityNote: trimmed(1, 160),
  deliveryNote: z.string().trim().max(300).optional().or(z.literal("")),
  details: trimmed(10, 4000),
});

export function fieldErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export function safeNextPath(value: string | null | undefined, fallback = "/account") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return fallback;
  }
  return value;
}
