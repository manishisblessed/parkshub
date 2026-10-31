import { saveEmailTemplate, saveSettings } from "@/server/actions/admin";
import { Field, SubmitButton } from "@/components/ui";
import { parseFeatures } from "@/lib/features";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";
import { getSettings } from "@/server/queries";

export default async function SettingsPage() {
  await requirePermission("settings.manage");
  const [settings, templates] = await Promise.all([getSettings(), prisma.emailTemplate.findMany({ orderBy: { key: "asc" } })]);
  const features = parseFeatures(settings.featuresJson);
  return (
    <div className="max-w-3xl space-y-10">
      <form action={saveSettings} className="grid gap-4">
        <h1 className="font-display text-4xl text-forest">Website settings</h1>
        <p className="text-sm text-muted">Legal name, CIN, GSTIN, and addresses stay as registered facts. Edit the public wording here.</p>
        <Field label="Phone, if the company publishes one" name="phone" defaultValue={settings.phone} />
        <Field label="Hero eyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
        <Field label="Hero title" name="heroTitle" as="textarea" defaultValue={settings.heroTitle} />
        <Field label="Hero introduction" name="heroLede" as="textarea" defaultValue={settings.heroLede} />
        <Field label="Intro heading" name="introHeading" defaultValue={settings.introHeading} />
        <Field label="Intro body" name="introBody" as="textarea" defaultValue={settings.introBody} />
        <Field label="CTA heading" name="ctaHeading" defaultValue={settings.ctaHeading} />
        <Field label="CTA body" name="ctaBody" as="textarea" defaultValue={settings.ctaBody} />
        <Field label="Default SEO title" name="seoTitle" defaultValue={settings.seoTitle} />
        <Field label="Default SEO description" name="seoDescription" as="textarea" defaultValue={settings.seoDescription} />
        <Field label="Public notice" name="publicNotice" as="textarea" defaultValue={settings.publicNotice} />
        <Field label="Google Maps embed URL" name="mapsEmbedUrl" defaultValue={settings.mapsEmbedUrl} />
        <label className="text-sm"><input type="checkbox" name="farmOperations" defaultChecked={features.farmOperations} /> Farm records module</label>
        <label className="text-sm"><input type="checkbox" name="inventory" defaultChecked={features.inventory} /> Inventory module</label>
        <label className="text-sm"><input type="checkbox" name="marketplace" defaultChecked={features.marketplace} /> Show marketplace as a future module in reports only</label>
        <SubmitButton>Save settings</SubmitButton>
      </form>
      <div className="space-y-8">
        <h2 className="font-display text-3xl text-forest">Email templates</h2>
        {templates.map((template) => (
          <form key={template.id} action={saveEmailTemplate} className="grid gap-3 border-t border-line pt-4">
            <input type="hidden" name="id" value={template.id} />
            <p className="text-xs uppercase tracking-[0.14em] text-muted">{template.key}</p>
            <Field label="Subject" name="subject" defaultValue={template.subject} />
            <Field label="Body" name="body" as="textarea" defaultValue={template.body} />
            <SubmitButton>Save template</SubmitButton>
          </form>
        ))}
      </div>
    </div>
  );
}
