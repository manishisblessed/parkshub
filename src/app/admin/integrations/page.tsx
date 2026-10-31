import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function IntegrationsPage() {
  await requirePermission("settings.manage");
  const rows = await prisma.integrationConfig.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Integrations</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Nothing here is connected. Enabling a provider requires real credentials in the server environment and a business decision. The switches are not offered because dummy credentials would look like a working service.</p>
      <ul className="mt-8 space-y-5">
        {rows.map((row) => (
          <li key={row.key} className="border-t border-line pt-4">
            <p className="font-display text-2xl text-forest">{row.name}</p>
            <p className="mt-2 text-sm">{row.description}</p>
            <p className="mt-2 text-sm text-muted">{row.enabled ? "Enabled" : "Not configured"}. {row.statusNote}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
