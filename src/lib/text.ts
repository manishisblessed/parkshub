import { createHash, randomBytes } from "crypto";

export function newToken() {
  const raw = randomBytes(32).toString("hex");
  return { raw, hash: hashToken(raw) };
}

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.agroparks.in").replace(/\/$/, "");
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const MILLI = 1000;

export function parseQuantity(value: string) {
  const trimmed = value.trim();
  if (!/^\d+(\.\d{1,3})?$/.test(trimmed)) {
    throw new Error("Enter a quantity with up to 3 decimal places.");
  }
  const [whole, fraction = ""] = trimmed.split(".");
  return Number(whole) * MILLI + Number(fraction.padEnd(3, "0"));
}

export function formatQuantity(milli: number) {
  const negative = milli < 0;
  const value = Math.abs(milli);
  const whole = Math.floor(value / MILLI);
  const fraction = String(value % MILLI).padStart(3, "0").replace(/0+$/, "");
  const text = fraction ? `${whole}.${fraction}` : String(whole);
  return negative ? `-${text}` : text;
}

export function applyMovement(current: string, type: string, amount: string) {
  const currentMilli = parseQuantity(current || "0");
  const delta = parseQuantity(amount);
  let next = currentMilli;
  if (type === "IN") next += delta;
  else if (type === "OUT") next -= delta;
  else if (type === "ADJUSTMENT") next += delta;
  else throw new Error("Unknown movement type.");
  if (next < 0) throw new Error("This movement would make the batch quantity negative.");
  return formatQuantity(next);
}

export function linesOf(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
}

export function paragraphsOf(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Returns a human-readable reading time string, e.g. "4 min read" */
export function readingTime(text: string | null | undefined): string {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
