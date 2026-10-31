import { AdminShell } from "@/components/admin-shell";
import { isStaff, requireUser } from "@/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (!isStaff(user)) redirect("/account?notice=forbidden");
  return <AdminShell name={user.name}>{children}</AdminShell>;
}
