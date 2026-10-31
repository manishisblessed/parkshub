import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser, isStaff } from "@/server/auth";
import { getSettings } from "@/server/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="absolute left-4 top-0 z-50 -translate-y-full bg-white px-3 py-2 text-forest focus:translate-y-4">
        Skip to content
      </a>
      <SiteHeader cin={settings.cin} email={settings.email} signedIn={Boolean(user)} staff={isStaff(user)} name={user?.name} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter
        legalName={settings.legalName}
        address={settings.registeredAddress}
        email={settings.email}
        cin={settings.cin}
        gstin={settings.gstin}
      />
    </div>
  );
}
