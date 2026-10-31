import "server-only";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_PDF = 10 * 1024 * 1024;

export function detectMime(buffer: Buffer, allowPdf: boolean) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return buffer.length <= MAX_IMAGE ? { mime: "image/jpeg", ext: "jpg" } : null;
  }
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return buffer.length <= MAX_IMAGE ? { mime: "image/png", ext: "png" } : null;
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return buffer.length <= MAX_IMAGE ? { mime: "image/webp", ext: "webp" } : null;
  }
  if (allowPdf && buffer.length >= 5 && buffer.toString("ascii", 0, 5) === "%PDF-" && buffer.length <= MAX_PDF) {
    return { mime: "application/pdf", ext: "pdf" };
  }
  return null;
}

export async function storeUpload(file: File, options: { isPublic: boolean }) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectMime(buffer, !options.isPublic);
  if (!detected) {
    throw new Error("Upload a JPEG, PNG, or WebP image under 5 MB. Private files may also be PDF under 10 MB.");
  }
  const filename = `${randomBytes(16).toString("hex")}.${detected.ext}`;
  if (options.isPublic) {
    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), buffer);
    return { filename, mime: detected.mime, size: buffer.length, path: `/uploads/${filename}`, isPublic: true };
  }
  const directory = path.join(process.cwd(), "storage", "private");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer);
  return { filename, mime: detected.mime, size: buffer.length, path: filename, isPublic: false };
}
