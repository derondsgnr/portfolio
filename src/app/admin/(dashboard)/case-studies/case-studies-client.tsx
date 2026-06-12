"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveCaseStudies } from "@/app/admin/actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, PageHeader, FormField } from "@/components/admin/admin-primitives";
import { ImageFieldGuide, ImageRatioHint } from "@/components/admin/image-system-guide";
import { SlideEditor } from "@/components/admin/slide-editor";
import { useAdminEditorShortcuts } from "@/hooks/useAdminEditorShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { openOnKeyboard } from "@/lib/admin/interaction";
import { rememberAdminEditor } from "@/lib/admin/recent-editor";
import type { CaseStudy, Act, Slide } from "@/types/case-study";
import {
  Plus, ChevronRight, ChevronDown, Trash2, Eye,
  Tag, Layers, X,
} from "lucide-react";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

/** Ensures every act has a stable id for drag-to-reorder, generating one for legacy acts that lack it. */
function withActIds(acts: Act[]): Act[] {
  return acts.map((act, i) => (act.id ? act : { ...act, id: `act-${Date.now()}-${i}` }));
}

const DEFAULT_SLUG_RE = /^new-study-\d+$/;

const TEMPLATES = ["full-product", "feature-dive", "visual-brand", "teardown"] as const;
const TEMPLATE_DESCS: Record<string, string> = {
  "full-product":  "Research to shipping, 15–30 slides",
  "feature-dive":  "Single feature deep dive, 8–15 slides",
  "visual-brand":  "Art direction heavy, 10–20 slides",
  "teardown":      "Analysis + redesign proposal, 10–25 slides",
};

function StudyListItem({
  study,
  isActive,
  onClick,
  onToggleArchive,
  onDelete,
}: {
  study: CaseStudy;
  isActive: boolean;
  onClick: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}) {
  const slideCount = study.acts.reduce((s, a) => s + a.slides.length, 0);
  return (
    <div
      role="button"
      tabIndex={0}
      onDoubleClick={onClick}
      onKeyDown={(event) => openOnKeyboard(event, onClick)}
      className={`group w-full flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] transition-all cursor-pointer focus:outline-none focus:bg-white/[0.03] ${
        isActive ? "bg-[#E2B93B]/[0.06] border-l-2 border-l-[#E2B93B]" : "hover:bg-white/[0.02]"
      }`}
      title="Double-click or press Enter to edit"
    >
      <button onClick={onClick} className="flex items-center gap-3 min-w-0 flex-1 text-left">
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
            {study.projectType === "personal" && <span className="ml-1.5 text-white/40">PERSONAL</span>}
            {study.status === "draft" && <span className="ml-1.5 text-white/30">DRAFT</span>}
            {study.status === "archived" && <span className="ml-1.5 text-white/20">ARCHIVED</span>}
            <span className="ml-1.5 text-white/15 opacity-0 transition-opacity group-hover:opacity-100">OPEN</span>
          </p>
        </div>
        <ChevronRight size={12} className={`shrink-0 transition-colors ${isActive ? "text-[#E2B93B]/60" : "text-white/15"}`} />
      </button>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onToggleArchive}
          className="px-2 py-1 border border-white/[0.08] text-[9px] font-['Instrument_Sans'] tracking-[0.12em] uppercase text-white/35 hover:text-white/70 hover:border-white/20 transition-colors"
        >
          {study.status === "archived" ? "Unarchive" : "Archive"}
        </button>
        <AdminConfirmAction
          title="Delete case study?"
          description={`Delete "${study.meta.title}" permanently from the case study JSON.`}
          confirmLabel="Delete"
          destructive
          onConfirm={onDelete}
        >
          <button
            type="button"
            className="px-2 py-1 border border-red-400/20 text-[9px] font-['Instrument_Sans'] tracking-[0.12em] uppercase text-red-300/45 hover:text-red-300/80 hover:border-red-300/45 transition-colors"
          >
            Delete
          </button>
        </AdminConfirmAction>
      </div>
    </div>
  );
}

function ActPanel({
  act,
  index,
  onUpdate,
  onDelete,
}: {
  act: Act;
  index: number;
  onUpdate: (updated: Act) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(index === 0);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: act.id ?? `act-${index}`,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`border border-white/[0.07] mb-3 ${isDragging ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02]">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab px-1 py-1 text-white/20 hover:text-[#E2B93B] active:cursor-grabbing transition-colors font-mono text-xs shrink-0"
          aria-label={`Drag to reorder ${act.title || "act"}`}
        >
          ::
        </button>
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
          <AdminConfirmAction
            title="Delete act?"
            description="Delete this act and every slide inside it."
            confirmLabel="Delete"
            destructive
            onConfirm={onDelete}
          >
            <button className="p-1 text-white/10 hover:text-red-400/60 transition-colors ml-1"><Trash2 size={12} /></button>
          </AdminConfirmAction>
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
  onClose,
  isSaving,
}: {
  study: CaseStudy;
  onSave: (updated: CaseStudy) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<CaseStudy>(() => ({ ...study, acts: withActIds(study.acts) }));
  const [tagInput, setTagInput] = useState("");
  const [metaOpen, setMetaOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  // While the slug is still the auto-generated default (and the user hasn't
  // hand-edited it), keep deriving it from the title so new studies get a real
  // URL without a manual step. A hand-edited slug is never overwritten.
  const [slugTouched, setSlugTouched] = useState(!DEFAULT_SLUG_RE.test(study.slug));
  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(study);
  const confirmIfUnsaved = useUnsavedChangesGuard(
    hasUnsavedChanges,
    "You have unsaved changes in this case study. Leave without saving?"
  );
  useAdminEditorShortcuts({
    onSave: () => onSave(form),
    onCancel: () => {
      if (confirmIfUnsaved()) onClose();
    },
    saveEnabled: !isSaving,
  });

  useEffect(() => {
    setForm({ ...study, acts: withActIds(study.acts) });
    setSlugTouched(!DEFAULT_SLUG_RE.test(study.slug));
  }, [study]);

  function setMeta(key: string, value: unknown) {
    setForm((f) => ({ ...f, meta: { ...f.meta, [key]: value } }));
  }

  function setTitle(value: string) {
    setForm((f) => ({
      ...f,
      meta: { ...f.meta, title: value },
      // Auto-fill the slug from the title until the user takes over the slug field.
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  function updateAct(index: number, updated: Act) {
    setForm((f) => { const acts = [...f.acts]; acts[index] = updated; return { ...f, acts }; });
  }

  function handleActDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setForm((f) => {
      const oldIndex = f.acts.findIndex((act) => act.id === active.id);
      const newIndex = f.acts.findIndex((act) => act.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return f;
      return { ...f, acts: arrayMove(f.acts, oldIndex, newIndex) };
    });
  }

  function deleteAct(index: number) {
    setForm((f) => ({ ...f, acts: f.acts.filter((_, i) => i !== index) }));
  }

  function addAct() {
    const newAct: Act = { id: `act-${Date.now()}`, title: `Act ${form.acts.length + 1}`, slides: [] };
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
          {hasUnsavedChanges ? (
            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#E2B93B]/70 font-['Instrument_Sans']">
              Unsaved changes · Cmd/Ctrl+S saves
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={form.projectType ?? "case-study"}
            onChange={(e) =>
              setForm((f) => ({ ...f, projectType: e.target.value as CaseStudy["projectType"] }))
            }
            className="text-[10px] font-['Instrument_Sans'] tracking-wider bg-white/[0.03] border border-white/[0.08] text-white/40 px-2 py-1.5 focus:outline-none cursor-pointer"
            title="Controls which section this project appears in"
          >
            <option value="case-study" style={{ background: "#0A0A0A" }}>Case Study</option>
            <option value="personal" style={{ background: "#0A0A0A" }}>Personal Project</option>
          </select>
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
                    <input className={adminCx.input} value={form.meta.title} onChange={(e) => setTitle(e.target.value)} />
                  </FormField>
                  <FormField label="Slug (URL path)">
                    <input
                      className={adminCx.input}
                      value={form.slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                      }}
                      placeholder="e.g. bantu-events"
                    />
                    <p className="mt-1 text-[10px] font-['Instrument_Sans'] text-white/25">/work/{form.slug}</p>
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
                    <ImageRatioHint role="case-study-hero" className="mb-2" />
                    <input className={adminCx.input} value={form.meta.cover} onChange={(e) => setMeta("cover", e.target.value)} placeholder="https://..." />
                    <ImageFieldGuide role="case-study-hero" imageUrl={form.meta.cover} compact className="mt-3" />
                  </FormField>
                  <FormField label="Browser mockup URL" className="lg:col-span-2">
                    <input
                      className={adminCx.input}
                      value={form.browserUrl ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, browserUrl: e.target.value || undefined }))}
                      placeholder="app.dara.finance"
                    />
                    <p className="text-[9px] text-white/20 font-['Instrument_Sans'] mt-1.5">
                      Address-bar text shown in browser-frame mockups for this study. Leave blank to use the live demo URL’s domain.
                    </p>
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleActDragEnd}>
            <SortableContext items={form.acts.map((act, i) => act.id ?? `act-${i}`)} strategy={verticalListSortingStrategy}>
              {form.acts.map((act, i) => (
                <ActPanel key={act.id ?? i} act={act} index={i} onUpdate={(updated) => updateAct(i, updated)} onDelete={() => deleteAct(i)} />
              ))}
            </SortableContext>
          </DndContext>
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [listPage, setListPage] = useState(1);
  const LIST_PAGE_SIZE = 20;

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
  const pageCount = Math.max(1, Math.ceil(studies.length / LIST_PAGE_SIZE));
  const paginatedStudies = studies.slice((listPage - 1) * LIST_PAGE_SIZE, listPage * LIST_PAGE_SIZE);

  useEffect(() => {
    if (listPage > pageCount) {
      setListPage(pageCount);
    }
  }, [listPage, pageCount]);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("study");
    if (slug && studies.some((study) => study.slug === slug)) {
      setActiveSlug(slug);
    }
  }, [studies]);

  function openStudy(study: CaseStudy) {
    rememberAdminEditor({
      section: "case-studies",
      label: study.meta.title,
      href: `/admin/case-studies?study=${study.slug}`,
    });
    window.history.replaceState(null, "", `/admin/case-studies?study=${study.slug}`);
    setActiveSlug(study.slug);
  }

  function closeStudyEditor() {
    window.history.replaceState(null, "", "/admin/case-studies");
    setActiveSlug(null);
    setSaveError(null);
  }

  async function save(study: CaseStudy) {
    // Match on the slug the study is *currently* stored under (activeSlug), not
    // study.slug — the form may carry a freshly-edited slug, and matching on the
    // new value would find nothing and silently drop the edit.
    const originalSlug = activeSlug ?? study.slug;
    const trimmedSlug = study.slug.trim();
    if (!trimmedSlug) {
      setSaveError("Slug can't be empty — it's the /work/ URL path.");
      return;
    }
    if (trimmedSlug !== originalSlug && studies.some((s) => s.slug === trimmedSlug)) {
      setSaveError(`Slug "${trimmedSlug}" is already used by another case study.`);
      return;
    }

    setSavingSlug(originalSlug);
    setSaveError(null);
    const updated = studies.map((s) => s.slug === originalSlug ? study : s);
    const result = await saveCaseStudies(updated, `Updated case study: ${study.meta.title}`);
    if (result.ok) {
      setStudies(updated);
      pushHistory("case-studies", "Case Studies", `Saved: ${study.meta.title}`, updated);
      openStudy(study);
      setLastSaved(new Date().toLocaleTimeString());
    } else {
      setSaveError(result.error ?? "Save failed. Your changes were not stored.");
    }
    setSavingSlug(null);
  }

  async function updateAndPersist(nextStudies: CaseStudy[], label: string) {
    setSaveError(null);
    const result = await saveCaseStudies(nextStudies, label);
    if (!result.ok) {
      setSaveError(result.error ?? "Save failed. Your changes were not stored.");
      return;
    }
    setStudies(nextStudies);
    pushHistory("case-studies", "Case Studies", label, nextStudies);
    setLastSaved(new Date().toLocaleTimeString());
  }

  async function toggleArchive(study: CaseStudy) {
    const nextStatus: CaseStudy["status"] =
      (study.status ?? "published") === "archived" ? "published" : "archived";
    const nextStudies = studies.map((item) =>
      item.slug === study.slug ? { ...item, status: nextStatus } : item
    );
    await updateAndPersist(nextStudies, `${nextStatus === "archived" ? "Archived" : "Unarchived"}: ${study.meta.title}`);
  }

  async function removeStudy(study: CaseStudy) {
    const nextStudies = studies.filter((item) => item.slug !== study.slug);
    await updateAndPersist(nextStudies, `Deleted: ${study.meta.title}`);
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
    openStudy(blank);
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
            {paginatedStudies.length > 0 ? (
              paginatedStudies.map((study) => (
                <StudyListItem
                  key={study.slug}
                  study={study}
                  isActive={false}
                onClick={() => openStudy(study)}
                  onToggleArchive={() => toggleArchive(study)}
                  onDelete={() => removeStudy(study)}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-['Instrument_Sans']">
                  No case studies yet
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/30 font-['Instrument_Sans']">
                  Start a draft, add acts, then build the narrative with slides.
                </p>
                <button
                  type="button"
                  onClick={newStudy}
                  className="mt-4 bg-[#E2B93B] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A] transition-colors hover:bg-white font-['Anton']"
                >
                  Create first study
                </button>
              </div>
            )}
          </div>
          {studies.length > LIST_PAGE_SIZE ? (
            <div className="max-w-2xl mt-3 flex items-center justify-between">
              <p className="text-[10px] text-white/30 font-['Instrument_Sans']">
                Page {listPage} of {pageCount}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={listPage === 1}
                  onClick={() => setListPage((page) => Math.max(1, page - 1))}
                  className="px-3 py-1.5 border border-white/[0.08] text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-white/40 hover:text-white/70 hover:border-white/20 disabled:opacity-30"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={listPage === pageCount}
                  onClick={() => setListPage((page) => Math.min(pageCount, page + 1))}
                  className="px-3 py-1.5 border border-white/[0.08] text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-white/40 hover:text-white/70 hover:border-white/20 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="-mx-6 lg:-mx-8 -mt-6 lg:-mt-8 -mb-6 lg:-mb-8 h-[calc(100dvh-3.5rem)] lg:h-[100dvh] flex flex-col">
          <div className="px-6 py-2.5 border-b border-white/[0.05] flex items-center gap-3 bg-[#0A0A0A] shrink-0 sticky top-0 z-20">
            <button data-unsaved-guard-trigger onClick={closeStudyEditor} className="text-[10px] font-['Instrument_Sans'] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors flex items-center gap-1.5">
              ← All Case Studies
            </button>
            <span className="text-white/10">/</span>
            <span className="text-[10px] font-['Instrument_Sans'] text-white/30 truncate">{activeStudy.meta.title}</span>
            {saveError ? (
              <span className="ml-auto flex items-center gap-1.5 text-[9px] font-['Instrument_Sans'] text-[#D4183D]" role="alert" title={saveError}>
                <X size={11} /> <span className="max-w-[320px] truncate">{saveError}</span>
              </span>
            ) : lastSaved ? (
              <span className="text-[9px] text-white/15 font-['Instrument_Sans'] ml-auto">Saved {lastSaved}</span>
            ) : null}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <StudyEditor study={activeStudy} onSave={save} onClose={closeStudyEditor} isSaving={savingSlug === activeStudy.slug} />
          </div>
        </div>
      )}
    </div>
  );
}
