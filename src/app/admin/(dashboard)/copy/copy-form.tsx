"use client";

import { useState } from "react";
import { saveCopy } from "../../actions";
import type { CopyConfig, PageCopy } from "@/lib/content/copy";

type Props = { initial: CopyConfig };

const PAGES = ["homepage", "work", "about", "craft"] as const;

export function CopyForm({ initial }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<CopyConfig>(initial);
  const [activePage, setActivePage] = useState<(typeof PAGES)[number]>("homepage");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveCopy(form, "Update site copy");
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

  const p = (form[activePage] ?? {}) as PageCopy;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Page tabs */}
      <div className="flex gap-1 mb-8 pb-4 border-b border-white/10">
        {PAGES.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setActivePage(page)}
            className="px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors"
            style={{
              color: activePage === page ? "#0A0A0A" : "rgba(255,255,255,0.5)",
              background: activePage === page ? "#E2B93B" : "transparent",
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Homepage */}
      {activePage === "homepage" && (
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">Hero</legend>
            <div>
              <label className={labelClass}>Name</label>
              <input
                value={p.hero?.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, homepage: { ...(f.homepage as PageCopy), hero: { ...(f.homepage as PageCopy)?.hero, name: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                value={p.hero?.tagline ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, homepage: { ...(f.homepage as PageCopy), hero: { ...(f.homepage as PageCopy)?.hero, tagline: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Philosophy</label>
              <textarea
                value={p.hero?.philosophy ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, homepage: { ...(f.homepage as PageCopy), hero: { ...(f.homepage as PageCopy)?.hero, philosophy: e.target.value } } }))}
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
                value={p.about?.label ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, homepage: { ...(f.homepage as PageCopy), about: { ...(f.homepage as PageCopy)?.about, label: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  value={p.about?.headline ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, homepage: { ...(f.homepage as PageCopy), about: { ...(f.homepage as PageCopy)?.about, headline: e.target.value } } }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Headline accent</label>
                <input
                  value={p.about?.headlineAccent ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, homepage: { ...(f.homepage as PageCopy), about: { ...(f.homepage as PageCopy)?.about, headlineAccent: e.target.value } } }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Bio paragraphs (one per line)</label>
              <textarea
                value={(p.about?.bioParagraphs ?? []).join("\n")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    homepage: { ...(f.homepage as PageCopy), about: { ...(f.homepage as PageCopy)?.about, bioParagraphs: e.target.value.split("\n").filter(Boolean) } },
                  }))
                }
                className={inputClass}
                rows={4}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">CTA</legend>
            <CtaFields form={form} setForm={setForm} page="homepage" p={p} inputClass={inputClass} labelClass={labelClass} showTagline />
          </fieldset>
        </div>
      )}

      {/* Work */}
      {activePage === "work" && (
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">Hero</legend>
            <div>
              <label className={labelClass}>Access label</label>
              <input
                value={p.hero?.accessLabel ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, work: { ...(f.work as PageCopy), hero: { ...(f.work as PageCopy)?.hero, accessLabel: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                value={p.hero?.title ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, work: { ...(f.work as PageCopy), hero: { ...(f.work as PageCopy)?.hero, title: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Count suffix (e.g. TRANSMISSIONS FOUND)</label>
              <input
                value={p.hero?.countSuffix ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, work: { ...(f.work as PageCopy), hero: { ...(f.work as PageCopy)?.hero, countSuffix: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Active label</label>
              <input
                value={p.hero?.activeLabel ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, work: { ...(f.work as PageCopy), hero: { ...(f.work as PageCopy)?.hero, activeLabel: e.target.value } } }))}
                className={inputClass}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">CTA</legend>
            <CtaFields form={form} setForm={setForm} page="work" p={p} inputClass={inputClass} labelClass={labelClass} />
          </fieldset>
        </div>
      )}

      {/* About */}
      {activePage === "about" && (
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">Hero</legend>
            <div>
              <label className={labelClass}>Label</label>
              <input
                value={p.hero?.label ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, about: { ...(f.about as PageCopy), hero: { ...(f.about as PageCopy)?.hero, label: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input
                value={p.hero?.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, about: { ...(f.about as PageCopy), hero: { ...(f.about as PageCopy)?.hero, name: e.target.value } } }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                value={p.hero?.tagline ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, about: { ...(f.about as PageCopy), hero: { ...(f.about as PageCopy)?.hero, tagline: e.target.value } } }))}
                className={inputClass}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">CTA</legend>
            <CtaFields form={form} setForm={setForm} page="about" p={p} inputClass={inputClass} labelClass={labelClass} />
          </fieldset>
        </div>
      )}

      {/* Craft */}
      {activePage === "craft" && (
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">Hero</legend>
            <div>
              <label className={labelClass}>Label</label>
              <input
                value={p.hero?.label ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, craft: { ...(f.craft as PageCopy), hero: { ...(f.craft as PageCopy)?.hero, label: e.target.value } } }))}
                className={inputClass}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-mono text-sm text-[#E2B93B] mb-4">CTA</legend>
            <CtaFields form={form} setForm={setForm} page="craft" p={p} inputClass={inputClass} labelClass={labelClass} />
          </fieldset>
        </div>
      )}

      {errorMsg && <p className="font-mono text-sm text-red-400 mt-4">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-8 px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : status === "ok" ? "Saved" : "Save"}
      </button>
    </form>
  );
}

function CtaFields({
  form,
  setForm,
  page,
  p,
  inputClass,
  labelClass,
  showTagline,
}: {
  form: CopyConfig;
  setForm: React.Dispatch<React.SetStateAction<CopyConfig>>;
  page: "homepage" | "work" | "about" | "craft";
  p: PageCopy;
  inputClass: string;
  labelClass: string;
  showTagline?: boolean;
}) {
  const pageData = form[page] as PageCopy | undefined;
  const update = (up: Partial<PageCopy>) => setForm((f) => ({ ...f, [page]: { ...(f[page] as PageCopy), ...up } }));
  const updateCta = (up: Partial<PageCopy["cta"]>) => update({ cta: { ...(pageData?.cta ?? {}), ...up } });

  return (
    <>
      <div>
        <label className={labelClass}>Label</label>
        <input value={p.cta?.label ?? ""} onChange={(e) => updateCta({ label: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Headline</label>
        <input value={p.cta?.headline ?? ""} onChange={(e) => updateCta({ headline: e.target.value })} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Primary button</label>
          <input value={p.cta?.ctaPrimary ?? ""} onChange={(e) => updateCta({ ctaPrimary: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Secondary button</label>
          <input value={p.cta?.ctaSecondary ?? ""} onChange={(e) => updateCta({ ctaSecondary: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Subtext</label>
        <input value={p.cta?.subtext ?? ""} onChange={(e) => updateCta({ subtext: e.target.value })} className={inputClass} />
      </div>
      {showTagline && (
        <div>
          <label className={labelClass}>Tagline</label>
          <input value={p.cta?.tagline ?? ""} onChange={(e) => updateCta({ tagline: e.target.value })} className={inputClass} />
        </div>
      )}
    </>
  );
}
