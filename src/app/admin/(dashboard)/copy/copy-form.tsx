"use client";

import { useState } from "react";
import { saveLandingContent } from "../../actions";
import type { LandingContent } from "@/lib/content/landing";

type Props = { initial: LandingContent };

export function CopyForm({ initial }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveLandingContent(form, "Update landing copy");
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Save failed");
    }
  }

  const inputClass = "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <fieldset className="space-y-4">
        <legend className="font-mono text-sm text-[#E2B93B] mb-4">Hero</legend>
        <div>
          <label className={labelClass}>Name</label>
          <input
            value={form.hero.name}
            onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, name: e.target.value } }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input
            value={form.hero.tagline}
            onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, tagline: e.target.value } }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Philosophy</label>
          <textarea
            value={form.hero.philosophy}
            onChange={(e) => setForm((f) => ({ ...f, hero: { ...f.hero, philosophy: e.target.value } }))}
            className={inputClass}
            rows={2}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-mono text-sm text-[#E2B93B] mb-4">About</legend>
        <div>
          <label className={labelClass}>Label</label>
          <input
            value={form.about.label}
            onChange={(e) => setForm((f) => ({ ...f, about: { ...f.about, label: e.target.value } }))}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Headline</label>
            <input
              value={form.about.headline}
              onChange={(e) => setForm((f) => ({ ...f, about: { ...f.about, headline: e.target.value } }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Headline accent</label>
            <input
              value={form.about.headlineAccent}
              onChange={(e) => setForm((f) => ({ ...f, about: { ...f.about, headlineAccent: e.target.value } }))}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Bio paragraphs (one per line)</label>
          <textarea
            value={form.about.bioParagraphs.join("\n")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                about: { ...f.about, bioParagraphs: e.target.value.split("\n").filter(Boolean) },
              }))
            }
            className={inputClass}
            rows={4}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-mono text-sm text-[#E2B93B] mb-4">CTA</legend>
        <div>
          <label className={labelClass}>Label</label>
          <input
            value={form.cta.label}
            onChange={(e) => setForm((f) => ({ ...f, cta: { ...f.cta, label: e.target.value } }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Headline</label>
          <input
            value={form.cta.headline}
            onChange={(e) => setForm((f) => ({ ...f, cta: { ...f.cta, headline: e.target.value } }))}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary button</label>
            <input
              value={form.cta.ctaPrimary}
              onChange={(e) => setForm((f) => ({ ...f, cta: { ...f.cta, ctaPrimary: e.target.value } }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Secondary button</label>
            <input
              value={form.cta.ctaSecondary}
              onChange={(e) => setForm((f) => ({ ...f, cta: { ...f.cta, ctaSecondary: e.target.value } }))}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Subtext</label>
          <input
            value={form.cta.subtext}
            onChange={(e) => setForm((f) => ({ ...f, cta: { ...f.cta, subtext: e.target.value } }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input
            value={form.cta.tagline}
            onChange={(e) => setForm((f) => ({ ...f, cta: { ...f.cta, tagline: e.target.value } }))}
            className={inputClass}
          />
        </div>
      </fieldset>

      {errorMsg && <p className="font-mono text-sm text-red-400">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : status === "ok" ? "Saved" : "Save"}
      </button>
    </form>
  );
}
