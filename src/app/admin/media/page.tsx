import { archiveMedia, uploadMedia } from "@/server/actions/admin";
import { ConfirmForm } from "@/components/confirm-form";
import { Field, SubmitButton } from "@/components/ui";
import { requirePermission } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function MediaPage() {
  await requirePermission("media.manage");
  const assets = await prisma.mediaAsset.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 60 });
  return (
    <div>
      <h1 className="font-display text-4xl text-forest">Media library</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">JPEG, PNG, and WebP up to 5 MB. Private PDFs stay outside the public folder and are not shown on the website.</p>
      <form action={uploadMedia} className="mt-6 grid max-w-xl gap-4 border border-line bg-white p-5">
        <Field label="File" name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required />
        <Field label="Alt text" name="alt" />
        <label className="text-sm"><input type="checkbox" name="private" /> Private document</label>
        <SubmitButton>Upload</SubmitButton>
      </form>
      <ul className="mt-8 divide-y divide-line border-y border-line text-sm">
        {assets.map((asset) => (
          <li key={asset.id} className="flex items-center justify-between gap-4 py-3">
            <span>
              {asset.isPublic ? <a className="text-forest underline" href={asset.path}>{asset.originalName}</a> : asset.originalName}
              <span className="block text-muted">{asset.mime} · {Math.ceil(asset.size / 1024)} KB · {asset.isPublic ? asset.path : "Private"}</span>
            </span>
            <ConfirmForm message="Archive this file record?" action={archiveMedia}>
              <input type="hidden" name="id" value={asset.id} />
              <button className="text-[#8c3a32]" type="submit">Archive</button>
            </ConfirmForm>
          </li>
        ))}
        {assets.length === 0 ? <li className="py-4 text-muted">No uploads yet. Catalogue images currently use the illustrative files in /images.</li> : null}
      </ul>
    </div>
  );
}
