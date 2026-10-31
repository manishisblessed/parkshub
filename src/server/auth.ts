import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import { readSession, signSession } from "@/lib/jwt";
import { SESSION_COOKIE, SESSION_MAX_AGE, type PermissionKey } from "@/lib/constants";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  roles: string[];
  permissions: PermissionKey[];
};

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = await readSession(token);
  if (!userId) return null;

  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null, isActive: true, emailVerifiedAt: { not: null } },
    include: {
      roles: {
        include: {
          role: { include: { permissions: { include: { permission: true } } } },
        },
      },
    },
  });
  if (!user) return null;

  const permissions = [
    ...new Set(user.roles.flatMap((entry) => entry.role.permissions.map((item) => item.permission.key))),
  ] as PermissionKey[];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    roles: user.roles.map((entry) => entry.role.key),
    permissions,
  };
}

export function isStaff(user: SessionUser | null) {
  return Boolean(user && user.permissions.length > 0);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requirePermission(key: PermissionKey) {
  const user = await requireUser();
  if (!user.permissions.includes(key)) redirect("/account?notice=forbidden");
  return user;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function setSession(userId: string) {
  const token = await signSession(userId);
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions());
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
