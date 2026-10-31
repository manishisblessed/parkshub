import "server-only";
import nodemailer from "nodemailer";
import { prisma } from "@/server/db";

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => vars[key] ?? "");
}

export async function sendTemplate(input: {
  key: string;
  to: string;
  vars: Record<string, string>;
  userId?: string | null;
}) {
  const template = await prisma.emailTemplate.findUnique({ where: { key: input.key } });
  const subject = fill(template?.subject ?? input.key, input.vars);
  const body = fill(template?.body ?? "", input.vars);
  const host = process.env.SMTP_HOST;

  if (!host) {
    await prisma.notification.create({
      data: {
        userId: input.userId ?? null,
        type: input.key,
        title: subject,
        body: "Email was not sent because SMTP is not configured.",
        channel: "EMAIL",
        status: "SKIPPED",
      },
    });
    return { sent: false as const };
  }

  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || "" }
      : undefined,
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM || "AGRO PARKS <support@agroparks.in>",
    to: input.to,
    subject,
    text: body,
  });

  await prisma.notification.create({
    data: {
      userId: input.userId ?? null,
      type: input.key,
      title: subject,
      body: "Email sent.",
      channel: "EMAIL",
      status: "SENT",
    },
  });
  return { sent: true as const };
}

export async function notifyStaff(type: string, title: string, body: string) {
  await prisma.notification.create({
    data: { type, title, body, channel: "IN_APP", status: "SENT" },
  });
}
