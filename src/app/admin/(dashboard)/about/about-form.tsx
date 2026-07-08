"use client";

import { useState } from "react";
import { saveAbout } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";
import type { AboutContent, AboutFilm, AboutSections } from "@/lib/content/about";

type Props = { initial: AboutContent };
type SaveStatus = "idle" | "saving" | "ok" | "error";

const inputClass =
  "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#ECFF95]/50";
const labelClass = "block font-mono text-xs text-white/60 mb-1";
const sectionClass = "space-y-4 border border-white/10 bg-white/[0.02] p-5";
const h2Class = "font-mono text-sm text-white/80 uppercase tracking-wider";

const SECTION_LABELS: { key: keyof AboutSections; label: string; note: string }[] = [
  { key: "globe", label: "Globe", note: "Interactive 'building for the world' globe" },
  { key: "lives", label: "Lived a few lives", note: "The career list + comics line" },
  { key: "films", label: "Films", note: "'Mid-show' line + cover-flow deck + genres" },
  { key: "console", label: "Console", note: "'Mourning the console' + the CRT" },
  { key: "friendCat", label: "Friend / cat", note: "The 'dragged outside' line" },
  { key: "health", label: "Health", note: "Mental & physical health line" },
];

export function AboutForm({ initial }: Props) {
  const [data, setData] = useState<AboutContent>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function set<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function setLines(key: "intro" | "lives" | "genres" | "games", text: string) {
    set(key, text.split("\n"));
  }

  function setFilm(index: number, patch: Partial<AboutFilm>) {
    setData((d) => ({
      ...d,
      films: d.films.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));
  }
  function addFilm() {
    setData((d) => ({ ...d, films: [...d.films, { title: "", why: "", cover: "" }] }));
  }
  function removeFilm(index: number) {
    setData((d) => ({ ...d, films: d.films.filter((_, i) => i !== index) }));
  }

  function toggleSection(key: keyof AboutSections) {
    setData((d) => ({ ...d, sections: { ...d.sections, [key]: !d.sections[key] } }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);
    // Clean line-based arrays + films on save.
    const cleaned: AboutContent = {
      ...data,
      intro: data.intro.map((p) => p.trim()).filter(Boolean),
      lives: data.lives.map((p) => p.trim()).filter(Boolean),
      genres: data.genres.map((p) => p.trim()).filter(Boolean),
      games: data.games.map((p) => p.trim()).filter(Boolean),
      films: data.films
        .map((f) => ({ title: f.title.trim(), why: f.why.trim(), cover: (f.cover ?? "").trim() }))
        .filter((f) => f.title),
    };
    const result = await saveAbout(cleaned, "Update about page");
    if (result.ok) {
      setData(cleaned);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 4000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/about.json..."
        successMessage="Saved to content/about.json."
      />

      {/* Opening + hook */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Opening</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Greeting</label>
            <input className={inputClass} value={data.greeting} onChange={(e) => set("greeting", e.target.value)} placeholder="Hi, I'm Deron" />
          </div>
          <div>
            <label className={labelClass}>Location line</label>
            <input className={inputClass} value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="Abuja, NG · 9.07°N 7.49°E" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Hook (big headline)</label>
          <textarea className={inputClass} rows={2} value={data.hook} onChange={(e) => set("hook", e.target.value)} />
        </div>
      </section>

      {/* Intro */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Intro paragraphs</h2>
        <p className="font-mono text-[10px] text-white/40">One paragraph per line.</p>
        <textarea className={inputClass} rows={6} value={data.intro.join("\n")} onChange={(e) => setLines("intro", e.target.value)} />
      </section>

      {/* Lives */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Lived a few lives</h2>
        <div>
          <label className={labelClass}>Intro line</label>
          <input className={inputClass} value={data.livesIntro} onChange={(e) => set("livesIntro", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>The lives — one per line</label>
          <textarea className={inputClass} rows={6} value={data.lives.join("\n")} onChange={(e) => setLines("lives", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Comics line</label>
          <textarea className={inputClass} rows={2} value={data.comics} onChange={(e) => set("comics", e.target.value)} />
        </div>
      </section>

      {/* Mission peak */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Mission + peak</h2>
        <div>
          <label className={labelClass}>Build-up paragraph</label>
          <textarea className={inputClass} rows={3} value={data.missionIntro} onChange={(e) => set("missionIntro", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Peak line (big)</label>
          <input className={inputClass} value={data.peak} onChange={(e) => set("peak", e.target.value)} />
        </div>
      </section>

      {/* Dara */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Now building</h2>
        <div>
          <label className={labelClass}>Dara line</label>
          <textarea className={inputClass} rows={2} value={data.dara} onChange={(e) => set("dara", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Status tag</label>
          <input className={inputClass} value={data.daraTag} onChange={(e) => set("daraTag", e.target.value)} placeholder="● beta · still learning" />
        </div>
      </section>

      {/* Films */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Films</h2>
        <div>
          <label className={labelClass}>&quot;Mid-show&quot; headline</label>
          <textarea className={inputClass} rows={2} value={data.midShow} onChange={(e) => set("midShow", e.target.value)} />
        </div>
        <div className="space-y-3">
          <label className={labelClass}>Shows (cover-flow deck)</label>
          {data.films.map((f, i) => (
            <div key={i} className="border border-white/10 bg-black/30 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input className={inputClass} value={f.title} onChange={(e) => setFilm(i, { title: e.target.value })} placeholder="Title" />
                <button type="button" onClick={() => removeFilm(i)} className="shrink-0 font-mono text-[10px] uppercase text-red-400/80 hover:text-red-300 px-2">
                  Remove
                </button>
              </div>
              <textarea className={inputClass} rows={2} value={f.why} onChange={(e) => setFilm(i, { why: e.target.value })} placeholder="Why you like it…" />
              <input className={inputClass} value={f.cover ?? ""} onChange={(e) => setFilm(i, { cover: e.target.value })} placeholder="Poster image URL (optional)" />
              <CloudinaryUploadField accept="image/*" label="Upload poster" onUploaded={(r) => setFilm(i, { cover: r.secure_url })} />
              {f.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.cover} alt="" className="h-16 w-auto rounded border border-white/10 object-cover" />
              ) : null}
            </div>
          ))}
          <button type="button" onClick={addFilm} className="px-4 py-1.5 border border-[#ECFF95]/40 font-mono text-[10px] uppercase tracking-[0.12em] text-[#ECFF95] hover:bg-[#ECFF95]/10">
            + Add show
          </button>
        </div>
        <div>
          <label className={labelClass}>Genres — one per line</label>
          <textarea className={inputClass} rows={4} value={data.genres.join("\n")} onChange={(e) => setLines("genres", e.target.value)} />
        </div>
      </section>

      {/* Console */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Console</h2>
        <div>
          <label className={labelClass}>Heading</label>
          <input className={inputClass} value={data.consoleHeading} onChange={(e) => set("consoleHeading", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Body</label>
          <textarea className={inputClass} rows={2} value={data.consoleBody} onChange={(e) => set("consoleBody", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Games (CRT list) — one per line</label>
          <textarea className={inputClass} rows={5} value={data.games.join("\n")} onChange={(e) => setLines("games", e.target.value)} />
        </div>
      </section>

      {/* Friend/cat + health + signoff */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Closers</h2>
        <div>
          <label className={labelClass}>Friend / cat line</label>
          <textarea className={inputClass} rows={2} value={data.friendCat} onChange={(e) => set("friendCat", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Health line</label>
          <textarea className={inputClass} rows={3} value={data.health} onChange={(e) => set("health", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Sign-off (big)</label>
          <textarea className={inputClass} rows={2} value={data.signoff} onChange={(e) => set("signoff", e.target.value)} />
        </div>
      </section>

      {/* Section visibility */}
      <section className={sectionClass}>
        <h2 className={h2Class}>Sections — show / hide</h2>
        <p className="font-mono text-[10px] text-white/40">Unchecked sections are removed from the page entirely.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SECTION_LABELS.map(({ key, label, note }) => (
            <label key={key} className="flex items-start gap-3 border border-white/10 bg-[#16171B] p-3 cursor-pointer">
              <input type="checkbox" checked={data.sections[key]} onChange={() => toggleSection(key)} className="mt-0.5 h-4 w-4 accent-[#ECFF95]" />
              <span>
                <span className="block font-mono text-xs text-white/85">{label}</span>
                <span className="block font-mono text-[10px] text-white/40 mt-0.5">{note}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={status === "saving"}
        className="px-6 py-2 bg-[#ECFF95] text-[#121316] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save About page"}
      </button>
    </form>
  );
}
