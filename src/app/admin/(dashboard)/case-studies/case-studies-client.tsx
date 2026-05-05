"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveCaseStudies } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, PageHeader, FormField } from "@/components/admin/admin-primitives";
import { SlideEditor } from "@/components/admin/slide-editor";
import type { CaseStudy, Act, Slide } from "@/types/case-study";
import {
  Plus, ChevronRight, ChevronDown, Trash2, Eye,
  Tag, Layers, X,
} from "lucide-react";

const TEMPLATES = ["full-product", "feature-dive", "visual-brand", "teardown"] as const;
const TEMPLATE_DESCS: Record<string, string> = {
  "full-product":  "Research to shipping, 15–30 slides",
  "feature-dive":  "Single feature deep dive, 8–15 slides",
  "visual-brand":  "Art direction heavy, 10–20 slides",
  "teardown":      "Analysis + redesign proposal, 10–25 slides",
};

function StudyListItem({ study, isActive, onClick }: { study: CaseStudy; isActive: boolean; onClick: () => void }) {
  const slideCount = study.acts.reduce((s, a) => s + a.slides.length, 0);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] transition-all ${
        isActive ? "bg-[#E2B93B]/[0.06] border-l-2 border-l-[#E2B93B]" : "hover:bg-white/[0.02]"
      }`}
    >
      {study.meta.cover ? (
        <div className="w-10 h-8 shrink-0 bg-cover bg-center border border-white/[0.06]" style={{ backgroundImage: `url(${study.meta.cover})` }} />
      ) : (
        <div className="w-10 h-8 shrink-0 bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
          <Layers size={12} className="text-white/15" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-['Instrument_Sans'] text-white/75 truncate">{study.meta.title}</p>
        <p className="text-[9px] text-white/25 font-['Instrument_Sans']">
          {study.meta.year} · {study.acts.length} acts · {slideCount} slides
          {study.pinned && <span className="ml-1.5 text-[#E2B93B]/60">PINNED</span>}
          {study.featured && <span className="ml-1.5 text-[#E2B93B]/45">FEATURED</span>}
          {study.status === "draft" && <span className="ml-1.5 text-white/30">DRAFT</span>}
          {study.status === "archived" && <span className="ml-1.5 text-white/20">ARCHIVED</span>}
        </p>
      </div>
      <ChevronRight size={12} className={`shrink-0 transition-colors ${isActive ? "text-[#E2B93B]/60" : "text-white/15"}`} />
    </button>
  );
}

function ActPanel({
  act,
  index,
  total,
  onUpdate,
  onMove,
  onDelete,
}: {
  act: Act;
  index: number;
  total: number;
  onUpdate: (updated: Act) => void;
  onMove: (dir: "up" | "down") => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border border-white/[0.07] mb-3">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02]">
        <button onClick={() => setOpen((o) => !o)} className="flex-1 flex items-center gap-2 text-left">
          <ChevronDown size={13} className={`text-white/30 transition-transform ${open ? "" : "-rotate-90"}`} />
          <input
            value={act.title}
            onChange={(e) => onUpdate({ ...act, title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent text-[13px] font-['Instrument_Sans'] text-white/80 focus:outline-none focus:text-white border-b border-transparent focus:border-white/20 transition-colors"
            placeholder="Act title…"
          />
          <span className="text-[9px] text-white/20 font-['Instrument_Sans'] shrink-0">{act.slides.length} slides</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onMove("up")} disabled={index === 0} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 transition-colors"><ChevronDown size={12} className="rotate-180" /></button>
          <button onClick={() => onMove("down")} disabled={index === total - 1} className="p-1 text-white/15 hover:text-white/50 disabled:opacity-20 transition-colors"><ChevronDown size={12} /></button>
          <button onClick={onDelete} className="p-1 text-white/10 hover:text-red-400/60 transition-colors ml-1"><Trash2 size={12} /></button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/[0.06]">
          <SlideEditor
            slides={act.slides}
            onChange={(slides) => onUpdate({ ...act, slides })}
            label={`Act ${index + 1} Slides`}
          />
        </div>
      )}
    </div>
  );
}

function StudyEditor({
  study,
  onSave,
  isSaving,
}: {
  study: CaseStudy;
  onSave: (updated: CaseStudy) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<CaseStudy>(study);
  const [tagInput, setTagInput] = useState("");
  const [metaOpen, setMetaOpen] = useState(false);

  useEffect(() => { setForm(study); }, [study]);

  function setMeta(key: string, value: unknown) {
    setForm((f) => ({ ...f, meta: { ...f.meta, [key]: value } }));
  }

  function updateAct(index: number, updated: Act) {
    setForm((f) => { const acts = [...f.acts]; acts[index] = updated; return { ...f, acts }; });
  }

  function moveAct(index: number, dir: "up" | "down") {
    setForm((f) => {
      const acts = [...f.acts];
      const to = dir === "up" ? index - 1 : index + 1;
      [acts[index], acts[to]] = [acts[to], acts[index]];
      return { ...f, acts };
    });
  }

  function deleteAct(index: number) {
    if (!confirm("Delete this act and all its slides?")) return;
    setForm((f) => ({ ...f, acts: f.acts.filter((_, i) => i !== index) }));
  }

  function addAct() {
    const newAct: Act = { title: `Act ${form.acts.length + 1}`, slides: [] };
    setForm((f) => ({ ...f, acts: [...f.acts, newAct] }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || form.meta.tags.includes(tag)) return;
    setMeta("tags", [...form.meta.tags, tag]);
    setTagInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
        <div>
          <p className="text-[11px] tracking-[0.15em] text-white/30 font-['Instrument_Sans'] uppercase">Case Study</p>
          <h2 className="font-['Anton'] text-lg tracking-[0.06em] text-white uppercase mt-0.5 truncate max-w-xs">
            {form.meta.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={form.status ?? "published"}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as CaseStudy["status"] }))
            }
            className="text-[10px] font-['Instrument_Sans'] tracking-wider bg-white/[0.03] border border-white/[0.08] text-white/40 px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
            <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
            <option value="archived" style={{ background: "#0A0A0A" }}>Archived</option>
          </select>
          <a href={`/work/${study.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-white/25 hover:text-white/60 hover:border-white/20 transition-all">
            <Eye size={11} /> Preview
          </a>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="px-5 py-1.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSaving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-white/[0.06]">
          <button
            onClick={() => setMetaOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <p className="text-[10px] tracking-[0.2em] text-white/35 font-['Instrument_Sans'] uppercase">Case Study Meta</p>
            <ChevronDown size={13} className={`text-white/25 transition-transform ${metaOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {metaOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <FormField label="Title">
                    <input className={adminCx.input} value={form.meta.title} onChange={(e) => setMeta("title", e.target.value)} />
                  </FormField>
                  <FormField label="Client">
                    <input className={adminCx.input} value={form.meta.client} onChange={(e) => setMeta("client", e.target.value)} />
                  </FormField>
                  <FormField label="Summary">
                    <textarea className={adminCx.textarea} rows={2} value={form.meta.summary} onChange={(e) => setMeta("summary", e.target.value)} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Year">
                      <input className={adminCx.input} value={form.meta.year} onChange={(e) => setMeta("year", e.target.value)} />
                    </FormField>
                    <FormField label="Duration">
                      <input className={adminCx.input} value={form.meta.duration ?? ""} onChange={(e) => setMeta("duration", e.target.value || undefined)} placeholder="6 weeks" />
                    </FormField>
                    <FormField label="Role">
                      <input className={adminCx.input} value={form.meta.role ?? ""} onChange={(e) => setMeta("role", e.target.value || undefined)} placeholder="Product Designer" />
                    </FormField>
                    <FormField label="Accent Color">
                      <div className="flex gap-2">
                        <input type="color" value={form.meta.color ?? "#E2B93B"} onChange={(e) => setMeta("color", e.target.value)} className="h-10 w-12 border border-white/[0.08] bg-transparent p-1 cursor-pointer shrink-0" />
                        <input className={adminCx.input} value={form.meta.color ?? ""} onChange={(e) => setMeta("color", e.target.value || undefined)} placeholder="#E2B93B" />
                      </div>
                    </FormField>
                  </div>
                  <FormField label="Cover Image URL" className="lg:col-span-2">
                    <input className={adminCx.input} value={form.meta.cover} onChange={(e) => setMeta("cover", e.target.value)} placeholder="https://..." />
                    {form.meta.cover && <img src={form.meta.cover} alt="" className="mt-2 h-14 w-full object-cover border border-white/[0.05]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  </FormField>
                  <FormField label="Template">
                    <div className="grid grid-cols-2 gap-2">
                      {TEMPLATES.map((t) => (
                        <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, template: t }))}
                          className={`px-3 py-2 text-left border transition-all ${form.template === t ? "border-[#E2B93B]/40 bg-[#E2B93B]/[0.04] text-white" : "border-white/[0.07] text-white/30 hover:border-white/[0.14]"}`}>
                          <p className="text-[11px] font-['Instrument_Sans']">{t}</p>
                          <p className="text-[9px] text-white/20 font-['Instrument_Sans'] mt-0.5">{TEMPLATE_DESCS[t]}</p>
                        </button>
                      ))}
                    </div>
                  </FormField>
                  <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(form.featured)}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, featured: e.target.checked }))
                        }
                        className="h-4 w-4 accent-[#E2B93B]"
                      />
                      <span className="text-[11px] text-white/40 font-['Instrument_Sans'] tracking-wider uppercase">Featured study</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(form.pinned)}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, pinned: e.target.checked }))
                        }
                        className="h-4 w-4 accent-[#E2B93B]"
                      />
                      <span className="text-[11px] text-white/40 font-['Instrument_Sans'] tracking-wider uppercase">Pinned in priority order</span>
                    </label>
                  </div>
                  <FormField label="Tags" className="lg:col-span-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.meta.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] text-[10px] font-['Instrument_Sans'] text-white/50">
                          {tag}
                          <button type="button" onClick={() => setMeta("tags", form.meta.tags.filter((t) => t !== tag))} className="text-white/25 hover:text-red-400/60 ml-0.5 transition-colors"><X size={9} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className={adminCx.input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag, press Enter" />
                      <button type="button" onClick={addTag} className="px-3 border border-white/[0.08] text-white/30 hover:text-white transition-colors"><Tag size={13} /></button>
                    </div>
                  </FormField>
                  <div className="lg:col-span-2 space-y-3">
                    <p className={adminCx.label}>Outcomes / Metrics</p>
                    {(form.outcome?.metrics ?? []).map((m, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                        <input className={adminCx.input} value={m.label} onChange={(e) => { const ms = [...(form.outcome?.metrics ?? [])]; ms[i] = { ...ms[i], label: e.target.value }; setForm((f) => ({ ...f, outcome: { ...f.outcome, metrics: ms } })); }} placeholder="Label" />
                        <input className={adminCx.input} value={m.value} onChange={(e) => { const ms = [...(form.outcome?.metrics ?? [])]; ms[i] = { ...ms[i], value: e.target.value }; setForm((f) => ({ ...f, outcome: { ...f.outcome, metrics: ms } })); }} placeholder="Value" />
                        <button type="button" onClick={() => { const ms = (form.outcome?.metrics ?? []).filter((_, idx) => idx !== i); setForm((f) => ({ ...f, outcome: { ...f.outcome, metrics: ms } })); }} className="mt-3 text-white/15 hover:text-red-400/60 transition-colors"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => { const ms = [...(form.outcome?.metrics ?? []), { label: "", value: "" }]; setForm((f) => ({ ...f, outcome: { ...f.outcome, metrics: ms } })); }} className="text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors flex items-center gap-1.5"><Plus size={10} /> Add metric</button>
                  </div>
                  <FormField label="Testimonial" className="lg:col-span-2">
                    <textarea className={adminCx.textarea} rows={2} value={form.outcome?.testimonial ?? ""} onChange={(e) => setForm((f) => ({ ...f, outcome: { ...f.outcome, metrics: f.outcome?.metrics ?? [], testimonial: e.target.value || undefined } }))} placeholder="Quote from client…" />
                  </FormField>
                  <FormField label="Testimonial Author">
                    <input className={adminCx.input} value={form.outcome?.testimonialAuthor ?? ""} onChange={(e) => setForm((f) => ({ ...f, outcome: { ...f.outcome, metrics: f.outcome?.metrics ?? [], testimonialAuthor: e.target.value || undefined } }))} placeholder="Jane Doe, CEO at XYZ" />
                  </FormField>
                  <FormField label="Live Demo URL">
                    <input className={adminCx.input} value={form.liveDemoUrl ?? ""} onChange={(e) => setForm((f) => ({ ...f, liveDemoUrl: e.target.value || undefined }))} placeholder="https://..." type="url" />
                  </FormField>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] tracking-[0.2em] text-white/35 font-['Instrument_Sans'] uppercase">Acts & Slides</p>
            <button onClick={addAct} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors">
              <Plus size={11} /> Add Act
            </button>
          </div>
          {form.acts.length === 0 && (
            <div className="py-12 border border-dashed border-white/[0.08] text-center">
              <p className="text-[11px] text-white/20 font-['Instrument_Sans']">No acts yet. Add one to start building your story.</p>
              <button onClick={addAct} className="mt-3 px-5 py-2 border border-white/[0.10] text-[11px] font-['Instrument_Sans'] tracking-wider uppercase text-white/30 hover:text-white hover:border-white/20 transition-all">
                + Add First Act
              </button>
            </div>
          )}
          {form.acts.map((act, i) => (
            <ActPanel key={i} act={act} index={i} total={form.acts.length} onUpdate={(updated) => updateAct(i, updated)} onMove={(dir) => moveAct(i, dir)} onDelete={() => deleteAct(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesClient({ initialStudies }: { initialStudies: CaseStudy[] }) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [studies, setStudies] = useState<CaseStudy[]>(initialStudies);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    setStudies(initialStudies);
  }, [initialStudies]);

  useEffect(() => {
    if (pendingRevert?.section === "case-studies") {
      setStudies(pendingRevert.snapshot as CaseStudy[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  const activeStudy = studies.find((s) => s.slug === activeSlug) ?? null;

  async function save(study: CaseStudy) {
    setSavingSlug(study.slug);
    const updated = studies.map((s) => s.slug === study.slug ? study : s);
    const result = await saveCaseStudies(updated, `Updated case study: ${study.meta.title}`);
    if (result.ok) {
      setStudies(updated);
      pushHistory("case-studies", "Case Studies", `Saved: ${study.meta.title}`, updated);
      setLastSaved(new Date().toLocaleTimeString());
    }
    setSavingSlug(null);
  }

  function newStudy() {
    const blank: CaseStudy = {
      slug: `new-study-${Date.now()}`,
      status: "draft",
      featured: false,
      pinned: false,
      meta: { title: "New Case Study", client: "", year: new Date().getFullYear().toString(), tags: [], cover: "", summary: "" },
      template: "full-product",
      acts: [],
    };
    setStudies((s) => [blank, ...s]);
    setActiveSlug(blank.slug);
  }

  return (
    <div>
      {!activeStudy ? (
        <div>
          <PageHeader
            index={3}
            title="Case Studies"
            description="Build and edit case studies — each has acts (chapters) with slides. Click a study to open the full editor."
            lastSaved={lastSaved}
          />
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] tracking-[0.15em] text-white/25 font-['Instrument_Sans'] uppercase">
              {studies.length} case stud{studies.length !== 1 ? "ies" : "y"}
            </span>
            <button onClick={newStudy} className="flex items-center gap-2 px-4 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors">
              <Plus size={13} /> NEW STUDY
            </button>
          </div>
          <div className="max-w-2xl border border-white/[0.07] overflow-hidden">
            {studies.map((study) => (
              <StudyListItem key={study.slug} study={study} isActive={false} onClick={() => setActiveSlug(study.slug)} />
            ))}
          </div>
        </div>
      ) : (
        <div className="-mx-6 lg:-mx-8 -mt-6 lg:-mt-8 -mb-6 lg:-mb-8 h-[calc(100dvh-3.5rem)] lg:h-[100dvh] flex flex-col">
          <div className="px-6 py-2.5 border-b border-white/[0.05] flex items-center gap-3 bg-[#0A0A0A] shrink-0 sticky top-0 z-20">
            <button onClick={() => setActiveSlug(null)} className="text-[10px] font-['Instrument_Sans'] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors flex items-center gap-1.5">
              ← All Case Studies
            </button>
            <span className="text-white/10">/</span>
            <span className="text-[10px] font-['Instrument_Sans'] text-white/30 truncate">{activeStudy.meta.title}</span>
            {lastSaved && <span className="text-[9px] text-white/15 font-['Instrument_Sans'] ml-auto">Saved {lastSaved}</span>}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <StudyEditor study={activeStudy} onSave={save} isSaving={savingSlug === activeStudy.slug} />
          </div>
        </div>
      )}
    </div>
  );
}
