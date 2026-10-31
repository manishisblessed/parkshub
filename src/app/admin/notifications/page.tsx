import { markNotificationRead } from "@/server/actions/admin";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { formatDateTime } from "@/lib/text";

export default async function NotificationsAdmin() {
  await requirePermission("dashboard.view");
  const rows = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 80 });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Notifications</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">In-app notices are stored here. Email is sent only when SMTP variables are set. Skipped email is recorded without the message body.</p>
      <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
        {rows.map((row) => (
          <li key={row.id} className="py-3">
            <p>{formatDateTime(row.createdAt)} · {row.channel} · {row.status}</p>
            <p className="font-medium">{row.title}</p>
            <p className="text-muted">{row.body}</p>
            {!row.readAt ? (
              <form action={markNotificationRead}>
                <input type="hidden" name="id" value={row.id} />
                <button className="text-forest underline" type="submit">Mark read</button>
              </form>
            ) : null}
          </li>
        ))}
        {rows.length === 0 ? <li className="py-4 text-muted">No notifications yet.</li> : null}
      </ul>
    </div>
  );
}
