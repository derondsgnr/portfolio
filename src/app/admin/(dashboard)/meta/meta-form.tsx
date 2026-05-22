"use client";

import { useState } from "react";
import { saveContent } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";
import { ImageRatioHint } from "@/components/admin/image-system-guide";
import { SaveButton } from "@/design-system";
import type { SiteMeta } from "@/lib/content/site-meta";

type Props = { initial: SiteMeta };

export function MetaForm({ initial }: Props) {
  const [ogImage, setOgImage] = useState(initial.ogImage ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);

    const form = e.currentTarget;
    const data: SiteMeta = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      siteName: (form.elements.namedItem("siteName") as HTMLInputElement).value,
      url: (form.elements.namedItem("url") as HTMLInputElement).value,
      ogImage: ogImage,
      ogImageAlt: (form.elements.namedItem("ogImageAlt") as HTMLInputElement).value,
      twitterCard: (form.elements.namedItem("twitterCard") as HTMLInputElement).value,
      favicon: (form.elements.namedItem("favicon") as HTMLInputElement).value,
      logo: (form.elements.namedItem("logo") as HTMLInputElement).value,
    };

    const content = JSON.stringify(data, null, 2);
    const result = await saveContent("content/site-meta.json", content, "Update site meta / SEO");

    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  const inputClass = "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input id="title" name="title" type="text" defaultValue={initial.title} className={inputClass} placeholder="derondsgnr | Product Designer & Builder" />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea id="description" name="description" rows={2} defaultValue={initial.description} className={inputClass} placeholder="Product designer and builder — prototype to ship. Short meta for search and sharing." />
      </div>
      <div>
        <label htmlFor="siteName" className={labelClass}>Site name</label>
        <input id="siteName" name="siteName" type="text" defaultValue={initial.siteName} className={inputClass} placeholder="derondsgnr" />
      </div>
      <div>
        <label htmlFor="url" className={labelClass}>Canonical URL</label>
        <input id="url" name="url" type="url" defaultValue={initial.url} className={inputClass} placeholder="https://derondsgnr.com" />
      </div>
      <div>
        <label htmlFor="ogImage" className={labelClass}>OG image (link preview banner)</label>
        <ImageRatioHint role="social-preview" className="mb-2" />
        {ogImage && (
          <img src={ogImage} alt="OG preview" className="w-full max-w-xs h-auto border border-white/10 mb-3 object-cover" style={{ aspectRatio: "1200/630" }} />
        )}
        <input
          id="ogImage"
          name="ogImage"
          type="text"
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
          className={inputClass}
          placeholder="/og.png or full URL"
        />
        <CloudinaryUploadField
          onUploaded={(r) => setOgImage(r.secure_url)}
          busyNote="Uploading banner…"
        />
        <p className="font-mono text-[10px] text-white/35 mt-2">1200×630px recommended — this is the image shown when you share the link on Twitter, iMessage, Slack, etc.</p>
      </div>
      <div>
        <label htmlFor="ogImageAlt" className={labelClass}>OG image alt text</label>
        <input id="ogImageAlt" name="ogImageAlt" type="text" defaultValue={initial.ogImageAlt} className={inputClass} placeholder="derondsgnr — Product Designer & Builder" />
      </div>
      <div>
        <label htmlFor="logo" className={labelClass}>Logo (URL or path)</label>
        <ImageRatioHint role="avatar-logo" aspectIds={["logo"]} className="mb-2" />
        <input id="logo" name="logo" type="text" defaultValue={initial.logo} className={inputClass} placeholder="/logo.svg" />
      </div>
      <div>
        <label htmlFor="favicon" className={labelClass}>Favicon</label>
        <ImageRatioHint role="avatar-logo" aspectIds={["avatar"]} className="mb-2" />
        <input id="favicon" name="favicon" type="text" defaultValue={initial.favicon} className={inputClass} placeholder="/favicon.ico" />
      </div>
      <div>
        <label htmlFor="twitterCard" className={labelClass}>Twitter card type</label>
        <select id="twitterCard" name="twitterCard" defaultValue={initial.twitterCard} className={inputClass}>
          <option value="summary">summary</option>
          <option value="summary_large_image">summary_large_image</option>
        </select>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/site-meta.json..."
        successMessage="Saved to content/site-meta.json."
      />
      <SaveButton status={status} />
    </form>
  );
}
