"use client";

/**
 * SLIDE EDITOR — Shared two-panel content editor
 * Left: scrollable slide navigator with type badge, preview text, up/down, delete
 * Right: type-specific form for the active slide
 *
 * Used by: Blog post editor, Case Study editor
 * Supports all 13 slide types from the case-study type system.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Slide } from "@/types/case-study";
import { adminCx, FormField } from "./admin-primitives";
import {
  ChevronUp, ChevronDown, Trash2, Plus, X,
  FileText, Quote, BarChart2, Zap, Image, Layers,
  ArrowLeftRight, Monitor, Video, AlignLeft, GitBranch, Layout, Type,
} from "lucide-react";

// ─── Slide type metadata ───────────────────────────────────────────
export const SLIDE_TYPES: {
  type: Slide["type"];
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  { type: "narrative",      label: "Narrative",       icon: AlignLeft,    desc: "Text block with optional narrator" },
  { type: "cover",          label: "Cover",           icon: Type,         desc: "Opening hero slide" },
  { type: "section-break",  label: "Section Break",   icon: Layout,       desc: "Chapter divider with act title" },
  { type: "quote",          label: "Quote",           icon: Quote,        desc: "Pull quote with attribution" },
  { type: "insight",        label: "Insight",         icon: Zap,          desc: "Key insight callout" },
  { type: "metric",         label: "Metrics",         icon: BarChart2,    desc: "Data / outcome numbers" },
  { type: "single-mockup",  label: "Single Mockup",   icon: Image,        desc: "One device screen" },
  { type: "comparison",     label: "Comparison",      icon: ArrowLeftRight, desc: "Before / after" },
  { type: "mockup-gallery", label: "Gallery",         icon: Layers,       desc: "Multiple mockups" },
  { type: "flow",           label: "Flow",            icon: GitBranch,    desc: "Multi-screen user journey" },
  { type: "video",          label: "Video",           icon: Video,        desc: "Video with poster" },
  { type: "embed",          label: "Embed",           icon: Monitor,      desc: "iFrame embed (Figma, etc.)" },
  { type: "process",        label: "Process",         icon: FileText,     desc: "Artifact / process documentation" },
];

const DEVICE_OPTIONS = ["phone", "browser", "tablet", "watch", "none"] as const;
const NARRATOR_MOODS = ["neutral", "thinking", "pointing", "celebrating", "frustrated"] as const;

// ─── Slide preview label ───────────────────────────────────────────
function slidePreview(slide: Slide): string {
  switch (slide.type) {
    case "narrative":      return slide.headline ?? slide.body.slice(0, 50);
    case "cover":          return slide.headline;
    case "section-break":  return `${slide.actTitle}`;
    case "quote":          return `"${slide.quote.slice(0, 40)}…"`;
    case "insight":        return slide.headline;
    case "metric":         return slide.headline ?? `${slide.metrics.length} metrics`;
    case "single-mockup":  return slide.headline ?? "Mockup";
    case "comparison":     return slide.headline ?? "Before / After";
    case "mockup-gallery": return slide.headline ?? `${slide.mockups.length} screens`;
    case "flow":           return slide.headline ?? `${slide.screens.length} screens`;
    case "video":          return slide.headline ?? "Video";
    case "embed":          return slide.headline ?? slide.embedUrl.slice(0, 40);
    case "process":        return slide.headline ?? `${slide.artifacts.length} artifacts`;
    default:               return "(slide)";
  }
}

// ─── Default slide for each type ──────────────────────────────────
function defaultSlide(type: Slide["type"], index: number): Slide {
  const id = `slide-${Date.now()}-${index}`;
  switch (type) {
    case "narrative":      return { type, id, body: "" };
    case "cover":          return { type, id, headline: "" };
    case "section-break":  return { type, id, actTitle: "New Act", actNumber: 1 };
    case "quote":          return { type, id, quote: "", attribution: "" };
    case "insight":        return { type, id, headline: "", insightLabel: "KEY INSIGHT", insightText: "" };
    case "metric":         return { type, id, metrics: [{ label: "", value: "" }] };
    case "single-mockup":  return { type, id, image: "", device: "phone" };
    case "comparison":     return { type, id, before: { image: "", label: "Before" }, after: { image: "", label: "After" } };
    case "mockup-gallery": return { type, id, mockups: [] };
    case "flow":           return { type, id, screens: [] };
    case "video":          return { type, id, posterImage: "" };
    case "embed":          return { type, id, embedUrl: "", fallbackImage: "" };
    case "process":        return { type, id, artifacts: [] };
    default:               return { type: "narrative" as const, id, body: "" };
  }
}

// ─── Narrator toggle ───────────────────────────────────────────────
function NarratorEditor({
  narrator,
  onChange,
}: {
  narrator?: { text: string; label?: string; mood?: string };
  onChange: (n: typeof narrator) => void;
}) {
  const [open, setOpen] = useState(!!narrator);
  return (
    <div className="mt-6 border-t border-white/[0.06] pt-5">
      <button
        type="button"
        onClick={() => {
          if (open) { onChange(undefined); setOpen(false); }
          else { onChange({ text: "", label: "DESIGNER'S NOTE", mood: "neutral" }); setOpen(true); }
        }}
        className="flex items-center gap-2 text-[10px] font-['Instrument_Sans'] tracking-[0.15em] uppercase text-white/25 hover:text-[#E2B93B]/60 transition-colors"
      >
        <span className={`w-3 h-3 border rounded-sm flex items-center justify-center ${open ? "border-[#E2B93B]/50 bg-[#E2B93B]/10" : "border-white/15"}`}>
          {open && <span className="w-1.5 h-1.5 bg-[#E2B93B]/60 rounded-sm" />}
        </span>
        Narrator commentary
      </button>
      {open && narrator && (
        <div className="mt-3 space-y-3 p-3 border border-[#E2B93B]/10 bg-[#E2B93B]/[0.02]">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Label">
              <input className={adminCx.input} value={narrator.label ?? ""} onChange={(e) => onChange({ ...narrator, label: e.target.value })} placeholder="DESIGNER'S NOTE" />
            </FormField>
            <FormField label="Mood">
              <select className={adminCx.select} value={narrator.mood ?? "neutral"} onChange={(e) => onChange({ ...narrator, mood: e.target.value })}>
                {NARRATOR_MOODS.map((m) => <option key={m} value={m} style={{ background: "#0A0A0A" }}>{m}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Commentary">
            <textarea className={adminCx.textarea} rows={2} value={narrator.text} onChange={(e) => onChange({ ...narrator, text: e.target.value })} placeholder="Your aside, field note, or honest take…" />
          </FormField>
        </div>
      )}
    </div>
  );
}

// ─── Per-type form ─────────────────────────────────────────────────
function SlideForm({
  slide,
  onChange,
}: {
  slide: Slide;
  onChange: (updated: Slide) => void;
}) {
  function set(key: string, value: unknown) {
    onChange({ ...slide, [key]: value } as Slide);
  }

  const hasNarrator = slide.type !== "section-break";

  return (
    <div className="space-y-4">
      {/* ─ Cover ─ */}
      {slide.type === "cover" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline} onChange={(e) => set("headline", e.target.value)} placeholder="The big opening statement" /></FormField>
          <FormField label="Subtitle"><textarea className={adminCx.textarea} rows={2} value={slide.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></FormField>
          <FormField label="Hero Image URL"><input className={adminCx.input} value={slide.heroImage ?? ""} onChange={(e) => set("heroImage", e.target.value)} placeholder="https://..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Device Frame">
              <select className={adminCx.select} value={slide.device ?? "none"} onChange={(e) => set("device", e.target.value)}>
                {DEVICE_OPTIONS.map((d) => <option key={d} value={d} style={{ background: "#0A0A0A" }}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Tags (comma-separated)">
              <input className={adminCx.input} value={(slide.tags ?? []).join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} placeholder="Brand, Strategy…" />
            </FormField>
          </div>
        </>
      )}

      {/* ─ Narrative ─ */}
      {slide.type === "narrative" && (
        <>
          <FormField label="Headline (optional)"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} placeholder="Bold opener (leave blank to skip)" /></FormField>
          <FormField label="Body *"><textarea className={adminCx.textarea} rows={6} value={slide.body} onChange={(e) => set("body", e.target.value)} placeholder="Write the narrative…" /></FormField>
          <FormField label="Annotation (side note)"><input className={adminCx.input} value={slide.annotation ?? ""} onChange={(e) => set("annotation", e.target.value || undefined)} placeholder="Margin annotation text" /></FormField>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Section Break ─ */}
      {slide.type === "section-break" && (
        <>
          <FormField label="Act Title"><input className={adminCx.input} value={slide.actTitle} onChange={(e) => set("actTitle", e.target.value)} placeholder="The Discovery" /></FormField>
          <FormField label="Act Number"><input type="number" className={adminCx.input} value={slide.actNumber} onChange={(e) => set("actNumber", parseInt(e.target.value) || 1)} min={1} /></FormField>
          <FormField label="Subtitle"><input className={adminCx.input} value={slide.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value || undefined)} placeholder="Chapter subtitle" /></FormField>
        </>
      )}

      {/* ─ Quote ─ */}
      {slide.type === "quote" && (
        <>
          <FormField label="Quote *"><textarea className={adminCx.textarea} rows={4} value={slide.quote} onChange={(e) => set("quote", e.target.value)} placeholder="The quote…" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Attribution"><input className={adminCx.input} value={slide.attribution} onChange={(e) => set("attribution", e.target.value)} placeholder="Name or source" /></FormField>
            <FormField label="Role / Context"><input className={adminCx.input} value={slide.role ?? ""} onChange={(e) => set("role", e.target.value || undefined)} placeholder="Head of Design at XYZ" /></FormField>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Insight ─ */}
      {slide.type === "insight" && (
        <>
          <FormField label="Headline *"><input className={adminCx.input} value={slide.headline} onChange={(e) => set("headline", e.target.value)} /></FormField>
          <FormField label="Body"><textarea className={adminCx.textarea} rows={3} value={slide.body ?? ""} onChange={(e) => set("body", e.target.value || undefined)} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Insight Label"><input className={adminCx.input} value={slide.insightLabel} onChange={(e) => set("insightLabel", e.target.value)} placeholder="THE KEY INSIGHT" /></FormField>
            <FormField label="Insight Text"><input className={adminCx.input} value={slide.insightText} onChange={(e) => set("insightText", e.target.value)} /></FormField>
          </div>
          <FormField label="Supporting Image"><input className={adminCx.input} value={slide.image ?? ""} onChange={(e) => set("image", e.target.value || undefined)} placeholder="https://..." /></FormField>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Metric ─ */}
      {slide.type === "metric" && (
        <>
          <FormField label="Headline (optional)"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <div className="space-y-2">
            <label className={adminCx.label}>Metrics</label>
            {slide.metrics.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start">
                <input className={adminCx.input} value={m.label} onChange={(e) => { const ms = [...slide.metrics]; ms[i] = { ...ms[i], label: e.target.value }; set("metrics", ms); }} placeholder="Label" />
                <input className={adminCx.input} value={m.value} onChange={(e) => { const ms = [...slide.metrics]; ms[i] = { ...ms[i], value: e.target.value }; set("metrics", ms); }} placeholder="Value" />
                <input className={adminCx.input} value={m.delta ?? ""} onChange={(e) => { const ms = [...slide.metrics]; ms[i] = { ...ms[i], delta: e.target.value || undefined }; set("metrics", ms); }} placeholder="Delta (optional)" />
                <button type="button" onClick={() => set("metrics", slide.metrics.filter((_, idx) => idx !== i))} className="mt-3 text-white/20 hover:text-red-400/60 transition-colors"><Trash2 size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => set("metrics", [...slide.metrics, { label: "", value: "" }])} className="text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors flex items-center gap-1.5">
              <Plus size={10} /> Add metric
            </button>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Single Mockup ─ */}
      {slide.type === "single-mockup" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <FormField label="Image URL *"><input className={adminCx.input} value={slide.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Device Frame"><select className={adminCx.select} value={slide.device} onChange={(e) => set("device", e.target.value)}>{DEVICE_OPTIONS.map((d) => <option key={d} value={d} style={{ background: "#0A0A0A" }}>{d}</option>)}</select></FormField>
            <FormField label="Caption"><input className={adminCx.input} value={slide.caption ?? ""} onChange={(e) => set("caption", e.target.value || undefined)} /></FormField>
          </div>
          {slide.image && <img src={slide.image} alt="" className="mt-2 h-24 w-full object-contain border border-white/[0.05]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Comparison ─ */}
      {slide.type === "comparison" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={adminCx.label}>Before</label>
              <input className={adminCx.input} value={slide.before.label} onChange={(e) => set("before", { ...slide.before, label: e.target.value })} placeholder="Label" />
              <input className={adminCx.input} value={slide.before.image} onChange={(e) => set("before", { ...slide.before, image: e.target.value })} placeholder="Image URL" />
            </div>
            <div className="space-y-2">
              <label className={adminCx.label}>After</label>
              <input className={adminCx.input} value={slide.after.label} onChange={(e) => set("after", { ...slide.after, label: e.target.value })} placeholder="Label" />
              <input className={adminCx.input} value={slide.after.image} onChange={(e) => set("after", { ...slide.after, image: e.target.value })} placeholder="Image URL" />
            </div>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Mockup Gallery ─ */}
      {slide.type === "mockup-gallery" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <div className="space-y-2">
            <label className={adminCx.label}>Screens</label>
            {slide.mockups.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2 items-start">
                <input className={adminCx.input} value={m.image} onChange={(e) => { const ms = [...slide.mockups]; ms[i] = { ...ms[i], image: e.target.value }; set("mockups", ms); }} placeholder="Image URL" />
                <select className={adminCx.select + " w-24"} value={m.device} onChange={(e) => { const ms = [...slide.mockups]; ms[i] = { ...ms[i], device: e.target.value as typeof m.device }; set("mockups", ms); }}>{DEVICE_OPTIONS.map((d) => <option key={d} value={d} style={{ background: "#0A0A0A" }}>{d}</option>)}</select>
                <button type="button" onClick={() => set("mockups", slide.mockups.filter((_, idx) => idx !== i))} className="mt-3 text-white/20 hover:text-red-400/60 transition-colors"><Trash2 size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => set("mockups", [...slide.mockups, { image: "", device: "phone" as const }])} className="text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors flex items-center gap-1.5"><Plus size={10} /> Add screen</button>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Flow ─ */}
      {slide.type === "flow" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <div className="space-y-2">
            <label className={adminCx.label}>Screens</label>
            {slide.screens.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input className={adminCx.input} value={s.image} onChange={(e) => { const sc = [...slide.screens]; sc[i] = { ...sc[i], image: e.target.value }; set("screens", sc); }} placeholder="Image URL" />
                <input className={adminCx.input} value={s.label ?? ""} onChange={(e) => { const sc = [...slide.screens]; sc[i] = { ...sc[i], label: e.target.value }; set("screens", sc); }} placeholder="Screen label" />
                <button type="button" onClick={() => set("screens", slide.screens.filter((_, idx) => idx !== i))} className="mt-3 text-white/20 hover:text-red-400/60 transition-colors"><Trash2 size={12} /></button>
              </div>
            ))}
            <button type="button" onClick={() => set("screens", [...slide.screens, { image: "" }])} className="text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors flex items-center gap-1.5"><Plus size={10} /> Add screen</button>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Video ─ */}
      {slide.type === "video" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <FormField label="Video URL"><input className={adminCx.input} value={slide.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value || undefined)} placeholder="https://..." /></FormField>
          <FormField label="Poster Image *"><input className={adminCx.input} value={slide.posterImage} onChange={(e) => set("posterImage", e.target.value)} placeholder="Thumbnail image URL" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Device"><select className={adminCx.select} value={slide.device ?? "none"} onChange={(e) => set("device", e.target.value)}>{DEVICE_OPTIONS.map((d) => <option key={d} value={d} style={{ background: "#0A0A0A" }}>{d}</option>)}</select></FormField>
            <FormField label="Caption"><input className={adminCx.input} value={slide.caption ?? ""} onChange={(e) => set("caption", e.target.value || undefined)} /></FormField>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Embed ─ */}
      {slide.type === "embed" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <FormField label="Embed URL *" hint="Figma share link, CodeSandbox, etc."><input className={adminCx.input} value={slide.embedUrl} onChange={(e) => set("embedUrl", e.target.value)} placeholder="https://..." /></FormField>
          <FormField label="Fallback Image *"><input className={adminCx.input} value={slide.fallbackImage} onChange={(e) => set("fallbackImage", e.target.value)} placeholder="Shown when embed fails" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Device"><select className={adminCx.select} value={slide.device ?? "browser"} onChange={(e) => set("device", e.target.value)}>{DEVICE_OPTIONS.map((d) => <option key={d} value={d} style={{ background: "#0A0A0A" }}>{d}</option>)}</select></FormField>
            <FormField label="Caption"><input className={adminCx.input} value={slide.caption ?? ""} onChange={(e) => set("caption", e.target.value || undefined)} /></FormField>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}

      {/* ─ Process ─ */}
      {slide.type === "process" && (
        <>
          <FormField label="Headline"><input className={adminCx.input} value={slide.headline ?? ""} onChange={(e) => set("headline", e.target.value || undefined)} /></FormField>
          <div className="space-y-3">
            <label className={adminCx.label}>Artifacts</label>
            {slide.artifacts.map((a, i) => (
              <div key={i} className="p-3 border border-white/[0.06] space-y-2 relative group">
                <button type="button" onClick={() => set("artifacts", slide.artifacts.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400/60 transition-all"><Trash2 size={11} /></button>
                <input className={adminCx.input} value={a.image} onChange={(e) => { const ar = [...slide.artifacts]; ar[i] = { ...ar[i], image: e.target.value }; set("artifacts", ar); }} placeholder="Image URL" />
                <div className="grid grid-cols-2 gap-2">
                  <input className={adminCx.input} value={a.label} onChange={(e) => { const ar = [...slide.artifacts]; ar[i] = { ...ar[i], label: e.target.value }; set("artifacts", ar); }} placeholder="Label" />
                  <input className={adminCx.input} value={a.description ?? ""} onChange={(e) => { const ar = [...slide.artifacts]; ar[i] = { ...ar[i], description: e.target.value }; set("artifacts", ar); }} placeholder="Description" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => set("artifacts", [...slide.artifacts, { image: "", label: "" }])} className="text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors flex items-center gap-1.5"><Plus size={10} /> Add artifact</button>
          </div>
          <NarratorEditor narrator={(slide as { narrator?: { text: string; label?: string; mood?: string } }).narrator} onChange={(n) => set("narrator", n)} />
        </>
      )}
    </div>
  );
}

// ─── Type Picker Popover ───────────────────────────────────────────
function TypePicker({ onSelect, onClose }: { onSelect: (type: Slide["type"]) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 mb-2 w-[340px] bg-[#111] border border-white/[0.10] z-20 shadow-2xl p-3"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-[9px] tracking-[0.2em] text-white/30 font-['Instrument_Sans'] uppercase">Choose Slide Type</p>
        <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors"><X size={13} /></button>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {SLIDE_TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.type}
              onClick={() => { onSelect(t.type); onClose(); }}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.04] text-left transition-colors"
            >
              <Icon size={13} className="text-white/30 shrink-0" />
              <div>
                <p className="text-[11px] font-['Instrument_Sans'] text-white/60">{t.label}</p>
                <p className="text-[9px] text-white/20 font-['Instrument_Sans']">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Slide Navigator item ──────────────────────────────────────────
function SlideNavItem({
  slide,
  index,
  total,
  isActive,
  onClick,
  onMove,
  onDelete,
}: {
  slide: Slide;
  index: number;
  total: number;
  isActive: boolean;
  onClick: () => void;
  onMove: (dir: "up" | "down") => void;
  onDelete: () => void;
}) {
  const typeMeta = SLIDE_TYPES.find((t) => t.type === slide.type);
  const Icon = typeMeta?.icon ?? FileText;

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-all border-l-2 ${
        isActive
          ? "border-l-[#E2B93B] bg-white/[0.04] text-white"
          : "border-l-transparent hover:bg-white/[0.02] text-white/40 hover:text-white/70"
      }`}
    >
      <Icon size={11} className={`shrink-0 ${isActive ? "text-[#E2B93B]" : ""}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[9px] tracking-[0.12em] uppercase font-['Instrument_Sans'] text-white/20 mb-0.5">
          {slide.type.replace(/-/g, " ")}
        </p>
        <p className="text-[11px] font-['Instrument_Sans'] truncate">{slidePreview(slide)}</p>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMove("up"); }}
          disabled={index === 0}
          className="p-0.5 text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors"
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMove("down"); }}
          disabled={index === total - 1}
          className="p-0.5 text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors"
        >
          <ChevronDown size={12} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-0.5 text-white/15 hover:text-red-400/60 transition-colors"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Main SlideEditor Export ───────────────────────────────────────
interface SlideEditorProps {
  slides: Slide[];
  onChange: (slides: Slide[]) => void;
  /** Label shown above navigator */
  label?: string;
}

export function SlideEditor({ slides, onChange, label = "Slides" }: SlideEditorProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(slides.length > 0 ? 0 : null);
  const [showTypePicker, setShowTypePicker] = useState(false);

  function move(i: number, dir: "up" | "down") {
    const next = [...slides];
    const to = dir === "up" ? i - 1 : i + 1;
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
    setActiveIndex(to);
  }

  function remove(i: number) {
    const next = slides.filter((_, idx) => idx !== i);
    onChange(next);
    setActiveIndex(Math.min(i, next.length - 1));
  }

  function addSlide(type: Slide["type"]) {
    const newSlide = defaultSlide(type, slides.length);
    const next = [...slides, newSlide];
    onChange(next);
    setActiveIndex(next.length - 1);
  }

  function updateSlide(i: number, updated: Slide) {
    const next = [...slides];
    next[i] = updated;
    onChange(next);
  }

  const activeSlide = activeIndex !== null ? slides[activeIndex] : null;

  return (
    <div className="flex border border-white/[0.07] overflow-hidden" style={{ minHeight: 480 }}>
      {/* ─ Left: Navigator ─ */}
      <div className="w-[220px] shrink-0 border-r border-white/[0.07] flex flex-col bg-white/[0.01]">
        {/* Header */}
        <div className="px-3 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <p className="text-[9px] tracking-[0.2em] text-[#E2B93B]/50 font-['Instrument_Sans'] uppercase">{label}</p>
          <span className="text-[9px] text-white/20 font-['Instrument_Sans']">{slides.length}</span>
        </div>

        {/* Slide list */}
        <div className="flex-1 overflow-y-auto">
          {slides.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-[10px] text-white/15 font-['Instrument_Sans']">No slides yet</p>
            </div>
          )}
          {slides.map((slide, i) => (
            <SlideNavItem
              key={slide.id}
              slide={slide}
              index={i}
              total={slides.length}
              isActive={activeIndex === i}
              onClick={() => setActiveIndex(i)}
              onMove={(dir) => move(i, dir)}
              onDelete={() => remove(i)}
            />
          ))}
        </div>

        {/* Add slide button */}
        <div className="relative p-3 border-t border-white/[0.06] shrink-0">
          <AnimatePresence>
            {showTypePicker && (
              <TypePicker
                onSelect={addSlide}
                onClose={() => setShowTypePicker(false)}
              />
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setShowTypePicker((s) => !s)}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-white/[0.12] text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-white/25 hover:text-[#E2B93B]/60 hover:border-[#E2B93B]/20 transition-all"
          >
            <Plus size={11} /> Add Slide
          </button>
        </div>
      </div>

      {/* ─ Right: Form ─ */}
      <div className="flex-1 overflow-y-auto">
        {activeSlide && activeIndex !== null ? (
          <div className="p-5">
            {/* Type header */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
              {(() => {
                const meta = SLIDE_TYPES.find((t) => t.type === activeSlide.type);
                const Icon = meta?.icon ?? FileText;
                return (
                  <>
                    <Icon size={14} className="text-[#E2B93B]/60" />
                    <div>
                      <p className="text-[13px] font-['Instrument_Sans'] text-white/70">{meta?.label}</p>
                      <p className="text-[10px] text-white/25 font-['Instrument_Sans']">Slide {activeIndex + 1} of {slides.length}</p>
                    </div>
                  </>
                );
              })()}
            </div>
            <SlideForm
              slide={activeSlide}
              onChange={(updated) => updateSlide(activeIndex, updated)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <FileText size={28} className="text-white/10 mx-auto mb-3" />
              <p className="text-[11px] text-white/20 font-['Instrument_Sans']">
                {slides.length === 0 ? "Add your first slide →" : "Select a slide to edit"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
