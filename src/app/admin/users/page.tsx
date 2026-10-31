import { createUser, resendVerification, setUserActive, setUserRole, verifyUserEmail } from "@/server/actions/admin";
import { ConfirmForm } from "@/components/confirm-form";
import { Field, Notice, SubmitButton } from "@/components/ui";
import { ROLE_DEFINITIONS } from "@/lib/constants";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function UsersAdmin({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const actor = await requirePermission("users.manage");
  const params = await searchParams;
  const users = await prisma.user.findMany({ where: { deletedAt: null }, include: { roles: { include: { role: true } } }, orderBy: { createdAt: "desc" } });
  const roles = ROLE_DEFINITIONS.filter((role) => role.key !== "SUPER_ADMIN" || actor.permissions.includes("roles.manage"));
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Users</h1>
      <div className="mt-4"><Notice code={params.notice} /></div>
      <div className="mt-6 space-y-4">
        {users.map((user) => {
          const role = user.roles[0]?.role.key || "";
          return (
            <div key={user.id} className="border border-line bg-white p-4 text-sm">
              <p className="font-medium">{user.name} · {user.email}</p>
              <p className="text-muted">{user.isActive ? "Active" : "Inactive"} · {user.emailVerifiedAt ? "Email confirmed" : "Email not confirmed"} · {role}</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <form action={setUserRole} className="flex items-end gap-2">
                  <input type="hidden" name="id" value={user.id} />
                  <Field label="Role" name="role" as="select" defaultValue={role} options={roles.map((item) => ({ value: item.key, label: item.name }))} />
                  <SubmitButton>Set role</SubmitButton>
                </form>
                {!user.emailVerifiedAt ? (
                  <form action={verifyUserEmail}>
                    <input type="hidden" name="id" value={user.id} />
                    <button className="mt-7 text-forest underline" type="submit">Confirm email</button>
                  </form>
                ) : null}
                <form action={resendVerification}>
                  <input type="hidden" name="id" value={user.id} />
                  <button className="mt-7 text-forest underline" type="submit">Prepare verification</button>
                </form>
                {user.id !== actor.id ? (
                  <ConfirmForm message={user.isActive ? "Deactivate this account?" : "Activate this account?"} action={setUserActive}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="isActive" value={user.isActive ? "false" : "true"} />
                    <button className="mt-7 text-[#8c3a32]" type="submit">{user.isActive ? "Deactivate" : "Activate"}</button>
                  </ConfirmForm>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <form action={createUser} className="mt-10 grid max-w-xl gap-3">
        <h2 className="font-display text-2xl text-forest">Create a staff or partner user</h2>
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" />
        <Field label="Temporary password" name="password" type="password" required />
        <Field label="Role" name="role" as="select" options={roles.map((role) => ({ value: role.key, label: role.name }))} />
        <SubmitButton>Create user</SubmitButton>
      </form>
    </div>
  );
}
