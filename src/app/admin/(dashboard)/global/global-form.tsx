"use client";

import { useState } from "react";
import { saveGlobal } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { SaveButton } from "@/design-system";
import type { GlobalConfig, SocialLink } from "@/lib/content/global";

type Props = { initial: GlobalConfig };

export function GlobalForm({ initial }: Props) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initial.socialLinks);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);

    const form = e.currentTarget;

    const links: SocialLink[] = [];
    for (let i = 0; i < socialLinks.length; i++) {
      const label = (form.elements.namedItem(`social-label-${i}`) as HTMLInputElement)?.value?.trim();
      const url = (form.elements.namedItem(`social-url-${i}`) as HTMLInputElement)?.value?.trim();
      if (label && url) links.push({ label, url });
    }

    const data: GlobalConfig = {
      socialLinks: links,
      footerCopyright: (form.elements.namedItem("footerCopyright") as HTMLInputElement)?.value?.trim() ?? "",
      footerTagline: (form.elements.namedItem("footerTagline") as HTMLInputElement)?.value?.trim() ?? "",
      ctaButtonLabel: (form.elements.namedItem("ctaButtonLabel") as HTMLInputElement)?.value?.trim() ?? "",
    };

    const result = await saveGlobal(data, "Update global");

    if (result.ok) {
      setSocialLinks(links);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeSocialLink(i: number) {
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
            Social links
          </h2>
          <button
            type="button"
            onClick={addSocialLink}
            className="font-mono text-xs text-[#E2B93B] hover:text-white"
          >
            + Add link
          </button>
        </div>
        <div className="space-y-4">
          {socialLinks.map((link, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor={`social-label-${i}`} className={labelClass}>
                  Label
                </label>
                <input
                  id={`social-label-${i}`}
                  name={`social-label-${i}`}
                  type="text"
                  defaultValue={link.label}
                  className={inputClass}
                  placeholder="Twitter / X"
                />
              </div>
              <div className="flex-[2]">
                <label htmlFor={`social-url-${i}`} className={labelClass}>
                  URL
                </label>
                <input
                  id={`social-url-${i}`}
                  name={`social-url-${i}`}
                  type="url"
                  defaultValue={link.url}
                  className={inputClass}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <button
                type="button"
                onClick={() => removeSocialLink(i)}
                className="font-mono text-xs text-white/40 hover:text-red-400 shrink-0 pb-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-mono text-sm text-white/80 mb-4 uppercase tracking-wider">
          Footer
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="footerCopyright" className={labelClass}>
              Footer copyright
            </label>
            <input
              id="footerCopyright"
              name="footerCopyright"
              type="text"
              defaultValue={initial.footerCopyright}
              className={inputClass}
              placeholder="© 2025 DERONDSGNR"
            />
          </div>
          <div>
            <label htmlFor="footerTagline" className={labelClass}>
              Footer tagline
            </label>
            <input
              id="footerTagline"
              name="footerTagline"
              type="text"
              defaultValue={initial.footerTagline}
              className={inputClass}
              placeholder="Designed & built by hand"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-mono text-sm text-white/80 mb-4 uppercase tracking-wider">
          CTA button
        </h2>
        <div>
          <label htmlFor="ctaButtonLabel" className={labelClass}>
            CTA button label (navbar & footer)
          </label>
          <input
            id="ctaButtonLabel"
            name="ctaButtonLabel"
            type="text"
            defaultValue={initial.ctaButtonLabel}
            className={inputClass}
            placeholder="Book a call"
          />
        </div>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/global.json..."
        successMessage="Saved to content/global.json."
      />
      <SaveButton status={status} />
    </form>
  );
}
