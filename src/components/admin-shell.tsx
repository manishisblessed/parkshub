import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/server/actions/public";

const links = [
  ["Overview", "/admin"],
  ["Enquiries", "/admin/enquiries"],
  ["Pages", "/admin/pages"],
  ["Business", "/admin/verticals"],
  ["Services", "/admin/services"],
  ["FAQs", "/admin/faqs"],
  ["Legal", "/admin/legal"],
  ["Insights", "/admin/blog"],
  ["Media", "/admin/media"],
  ["Categories", "/admin/categories"],
  ["Products", "/admin/products"],
  ["Farmers", "/admin/farmers"],
  ["Buyers", "/admin/buyers"],
  ["Vendors", "/admin/vendors"],
  ["Procurement", "/admin/procurement"],
  ["Orders", "/admin/orders"],
  ["Farms", "/admin/farms"],
  ["Inventory", "/admin/inventory"],
  ["Compliance", "/admin/compliance"],
  ["Users", "/admin/users"],
  ["Notifications", "/admin/notifications"],
  ["Reports", "/admin/reports"],
  ["Audit", "/admin/audit"],
  ["Integrations", "/admin/integrations"],
  ["Settings", "/admin/settings"],
] as const;

export function AdminShell({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-white/10 bg-forest text-white md:min-h-screen md:border-b-0">
        <div className="px-5 py-6">
          <Link href="/" className="font-display text-2xl">
            Agro Parks
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">Administration</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:px-3" aria-label="Admin">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="block whitespace-nowrap px-2 py-1.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <div className="flex items-center justify-between border-b border-line px-5 py-4 text-sm">
          <p>{name}</p>
          <div className="flex gap-4">
            <Link href="/" className="text-muted hover:text-forest">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="text-muted hover:text-forest">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="px-5 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
