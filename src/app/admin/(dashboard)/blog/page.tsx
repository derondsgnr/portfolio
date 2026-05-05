"use client";

/**
 * ADMIN — BLOG
 * Full post editor: metadata + slide content editor.
 *
 * TODO (Cursor): On mount, fetch:
 *   GET /make-server-3fa6479f/admin/content/blog → BlogPost[]
 *   Currently uses static BLOG_POSTS as initial data.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveBlogPost, saveBlogSeries, saveBlogCategories, loadContent } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, PageHeader, FormField } from "@/components/admin/admin-primitives";
import { SlideEditor } from "@/components/admin/slide-editor";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import { BLOG_SERIES } from "@/lib/data/blog-series-data";
import type { BlogSeries } from "@/types/blog";
import type { Slide } from "@/types/case-study";
import { Plus, Eye, Tag, X, ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface PostMeta {
  title: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  summary: string;
  readingTime: number;
  featured?: boolean;
  pinned?: boolean;
  series?: { slug: string; position: number };
}

interface ManagedPost {
  slug: string;
  meta: PostMeta;
  slides: Slide[];
  status: "published" | "draft" | "archived";
}

const DEFAULT_CATEGORIES = ["Thinking", "Craft", "Case Notes", "Process", "Life", "Industry", "Tools"];

// ─── Map static posts ──────────────────────────────────────────────
const INITIAL_POSTS: ManagedPost[] = BLOG_POSTS.map((p) => ({
  slug: p.slug,
  meta: {
    title: p.meta.title,
    date: p.meta.date,
    category: p.meta.category,
    tags: p.meta.tags ?? [],
    cover: p.meta.cover ?? "",
    summary: p.meta.summary ?? "",
    readingTime: p.meta.readingTime ?? 5,
    featured: p.meta.featured ?? false,
    series: p.meta.series,
  },
  slides: (p.slides as Slide[]) ?? [],
  status: "published" as const,
}));

const INITIAL_SERIES: ManagedSeries[] = BLOG_SERIES.map((s) => ({ ...s }));

function normalizeManagedPost(post: ManagedPost): ManagedPost {
  return {
    ...post,
    status: post.status ?? "published",
    meta: {
      ...post.meta,
      tags: Array.isArray(post.meta.tags) ? post.meta.tags : [],
      readingTime: Number(post.meta.readingTime) || 5,
      featured: post.meta.featured ?? false,
      pinned: post.meta.pinned ?? false,
    },
    slides: Array.isArray(post.slides) ? post.slides : [],
  };
}

function parseManagedPosts(raw: string | null): ManagedPost[] {
  if (!raw) return INITIAL_POSTS;
  try {
    const parsed = JSON.parse(raw) as ManagedPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_POSTS;
    return parsed.map(normalizeManagedPost);
  } catch {
    return INITIAL_POSTS;
  }
}

function parseManagedSeries(raw: string | null): ManagedSeries[] {
  if (!raw) return INITIAL_SERIES;
  try {
    const parsed = JSON.parse(raw) as ManagedSeries[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SERIES;
    return parsed.map((series) => ({
      ...series,
      posts: Array.isArray(series.posts) ? series.posts : [],
      archived: series.archived ?? false,
    }));
  } catch {
    return INITIAL_SERIES;
  }
}

function parseCategories(raw: string | null, fallback: string[]): string[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return fallback;
    const list = parsed.map((item) => String(item).trim()).filter(Boolean);
    return list.length > 0 ? [...new Set(list)] : fallback;
  } catch {
    return fallback;
  }
}

// ─── Post List Item ────────────────────────────────────────────────
function PostListItem({
  post,
  isActive,
  onClick,
}: {
  post: ManagedPost;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] transition-all ${
        isActive ? "bg-[#E2B93B]/[0.06] border-l-2 border-l-[#E2B93B]" : "hover:bg-white/[0.02]"
      }`}
    >
      {/* Cover */}
      {post.meta.cover ? (
        <div className="w-10 h-8 shrink-0 bg-cover bg-center border border-white/[0.06]" style={{ backgroundImage: `url(${post.meta.cover})` }} />
      ) : (
        <div className="w-10 h-8 shrink-0 bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
          <span className="text-[7px] text-white/15 font-['Instrument_Sans']">NO IMG</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-['Instrument_Sans'] text-white/75 truncate">{post.meta.title}</p>
        <p className="text-[9px] text-white/25 font-['Instrument_Sans']">
          {post.meta.category} · {post.slides.length} slides
          {post.meta.pinned && <span className="ml-1.5 text-[#E2B93B]/60">PINNED</span>}
          {post.status === "draft" && <span className="ml-1.5 text-[#E2B93B]/40">DRAFT</span>}
          {post.status === "archived" && <span className="ml-1.5 text-white/20">ARCHIVED</span>}
        </p>
      </div>
      <ChevronRight size={12} className={`shrink-0 transition-colors ${isActive ? "text-[#E2B93B]/60" : "text-white/15"}`} />
    </button>
  );
}

// ─── Full Post Editor ──────────────────────────────────────────────
function PostEditor({
  post,
  onSave,
  onClose,
  isSaving,
  seriesList,
  categoryList,
}: {
  post: ManagedPost;
  onSave: (updated: ManagedPost) => void;
  onClose: () => void;
  isSaving: boolean;
  seriesList: BlogSeries[];
  categoryList: string[];
}) {
  const [form, setForm] = useState<ManagedPost>(post);
  const [tagInput, setTagInput] = useState("");
  const [metaOpen, setMetaOpen] = useState(true);

  // Sync when post changes (switching posts)
  useEffect(() => { setForm(post); }, [post]);

  function setMeta(key: keyof PostMeta, value: unknown) {
    setForm((f) => ({ ...f, meta: { ...f.meta, [key]: value } }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || form.meta.tags.includes(tag)) return;
    setMeta("tags", [...form.meta.tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setMeta("tags", form.meta.tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
        <div>
          <p className="text-[11px] tracking-[0.15em] text-white/30 font-['Instrument_Sans'] uppercase">Editing</p>
          <h2 className="font-['Anton'] text-lg tracking-[0.06em] text-white uppercase mt-0.5 truncate max-w-xs">
            {form.meta.title || "Untitled"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ManagedPost["status"] }))}
            className="text-[10px] font-['Instrument_Sans'] tracking-wider bg-white/[0.03] border border-white/[0.08] text-white/40 px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
            <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
            <option value="archived" style={{ background: "#0A0A0A" }}>Archived</option>
          </select>
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-white/25 hover:text-white/60 hover:border-white/20 transition-all"
          >
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Meta accordion */}
        <div className="border-b border-white/[0.06]">
          <button
            onClick={() => setMetaOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <p className="text-[10px] tracking-[0.2em] text-white/35 font-['Instrument_Sans'] uppercase">Post Metadata</p>
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
                  <FormField label="Summary">
                    <textarea className={adminCx.textarea} rows={2} value={form.meta.summary} onChange={(e) => setMeta("summary", e.target.value)} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Date">
                      <input type="date" className={adminCx.input} value={form.meta.date} onChange={(e) => setMeta("date", e.target.value)} />
                    </FormField>
                    <FormField label="Reading Time (min)">
                      <input type="number" className={adminCx.input} value={form.meta.readingTime} onChange={(e) => setMeta("readingTime", parseInt(e.target.value) || 5)} min={1} />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Category">
                      <select className={adminCx.select} value={form.meta.category} onChange={(e) => setMeta("category", e.target.value)}>
                        {categoryList.map((c) => <option key={c} value={c} style={{ background: "#0A0A0A" }}>{c}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Status">
                      <select className={adminCx.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ManagedPost["status"] }))}>
                        <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
                        <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
                        <option value="archived" style={{ background: "#0A0A0A" }}>Archived</option>
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Cover Image URL" className="lg:col-span-2">
                    <input className={adminCx.input} value={form.meta.cover} onChange={(e) => setMeta("cover", e.target.value)} placeholder="https://..." />
                    {form.meta.cover && <img src={form.meta.cover} alt="" className="mt-2 h-16 w-full object-cover border border-white/[0.05]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  </FormField>
                  <FormField label="Tags" className="lg:col-span-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {form.meta.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] text-[10px] font-['Instrument_Sans'] text-white/50">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="text-white/25 hover:text-red-400/60 transition-colors ml-0.5"><X size={9} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className={adminCx.input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag, press Enter" />
                      <button type="button" onClick={addTag} className="px-3 border border-white/[0.08] text-white/30 hover:text-white transition-colors"><Tag size={13} /></button>
                    </div>
                  </FormField>
                  <label className="flex items-center gap-3 cursor-pointer lg:col-span-2">
                    <input type="checkbox" checked={form.meta.featured ?? false} onChange={(e) => setMeta("featured", e.target.checked)} className="h-4 w-4 accent-[#E2B93B]" />
                    <span className="text-[11px] text-white/40 font-['Instrument_Sans'] tracking-wider uppercase">Featured post</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer lg:col-span-2">
                    <input type="checkbox" checked={form.meta.pinned ?? false} onChange={(e) => setMeta("pinned", e.target.checked)} className="h-4 w-4 accent-[#E2B93B]" />
                    <span className="text-[11px] text-white/40 font-['Instrument_Sans'] tracking-wider uppercase">Pin this post to top of blog list</span>
                  </label>

                  {/* Series assignment */}
                  <div className="lg:col-span-2 border-t border-white/[0.05] pt-4 mt-2">
                    <p className="text-[9px] tracking-[0.2em] text-white/25 font-['Instrument_Sans'] uppercase mb-3">Series</p>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Series">
                        <select
                          className={adminCx.select}
                          value={form.meta.series?.slug ?? ""}
                          onChange={(e) => {
                            const slug = e.target.value;
                            if (!slug) {
                              setMeta("series", undefined);
                            } else {
                              setMeta("series", {
                                slug,
                                position: form.meta.series?.position ?? 1,
                              });
                            }
                          }}
                        >
                          <option value="" style={{ background: "#0A0A0A" }}>None</option>
                          {seriesList.map((s) => (
                            <option key={s.slug} value={s.slug} style={{ background: "#0A0A0A" }}>
                              {s.title} ({s.posts.length} parts)
                            </option>
                          ))}
                        </select>
                      </FormField>
                      {form.meta.series && (
                        <FormField label="Position in series">
                          <input
                            type="number"
                            className={adminCx.input}
                            value={form.meta.series.position}
                            onChange={(e) =>
                              setMeta("series", {
                                ...form.meta.series!,
                                position: parseInt(e.target.value) || 1,
                              })
                            }
                            min={1}
                          />
                        </FormField>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slide editor */}
        <div className="px-6 py-5">
          <div className="flex items-baseline gap-3 mb-4">
            <p className="text-[10px] tracking-[0.2em] text-white/35 font-['Instrument_Sans'] uppercase">Content Slides</p>
            <span className="h-px flex-1 bg-white/[0.05]" />
            <span className="text-[10px] text-white/20 font-['Instrument_Sans']">{form.slides.length} slides</span>
          </div>
          <SlideEditor
            slides={form.slides}
            onChange={(slides) => setForm((f) => ({ ...f, slides }))}
            label="Blog Slides"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Series Manager ─────────────────────────────────────────────────

interface ManagedSeries {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  posts: string[];
  archived?: boolean;
}

function SeriesManager({
  series,
  onUpdate,
  isSaving,
  postSlugs,
}: {
  series: ManagedSeries[];
  onUpdate: (updated: ManagedSeries[]) => void;
  isSaving: boolean;
  postSlugs: string[];
}) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ManagedSeries | null>(null);

  function startEdit(s: ManagedSeries) {
    setEditingSlug(s.slug);
    setForm({ ...s });
  }

  function startNew() {
    const blank: ManagedSeries = {
      slug: `series-${Date.now()}`,
      title: "",
      description: "",
      posts: [],
    };
    setForm(blank);
    setEditingSlug("__new__");
  }

  function saveForm() {
    if (!form || !form.title.trim()) return;
    // Auto-generate slug from title if it's a new series with the default slug
    const finalForm = {
      ...form,
      slug: editingSlug === "__new__"
        ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : form.slug,
    };
    if (editingSlug === "__new__") {
      onUpdate([...series, finalForm]);
    } else {
      onUpdate(series.map((s) => (s.slug === editingSlug ? finalForm : s)));
    }
    setEditingSlug(null);
    setForm(null);
  }

  function deleteSeries(slug: string) {
    onUpdate(series.filter((s) => s.slug !== slug));
  }

  function cancelEdit() {
    setEditingSlug(null);
    setForm(null);
  }

  if (form && editingSlug) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={cancelEdit}
            className="text-[10px] font-['Instrument_Sans'] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors"
          >
            ← Back to series
          </button>
          <button
            onClick={saveForm}
            disabled={isSaving || !form.title.trim()}
            className="px-5 py-1.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSaving ? "SAVING..." : "SAVE SERIES"}
          </button>
        </div>
        <div className="border border-white/[0.07] p-6 space-y-4">
          <FormField label="Series Title">
            <input className={adminCx.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Craft & Code" />
          </FormField>
          <FormField label="Slug">
            <input
              className={adminCx.input}
              value={editingSlug === "__new__" ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : form.slug}
              disabled={editingSlug !== "__new__"}
              readOnly
            />
          </FormField>
          <FormField label="Description">
            <textarea className={adminCx.textarea} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="1-2 sentence summary of the series" />
          </FormField>
          <FormField label="Cover Image URL">
            <input className={adminCx.input} value={form.cover ?? ""} onChange={(e) => setForm({ ...form, cover: e.target.value || undefined })} placeholder="https://..." />
            {form.cover && <img src={form.cover} alt="" className="mt-2 h-16 w-full object-cover border border-white/[0.05]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
          </FormField>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.archived ?? false} onChange={(e) => setForm({ ...form, archived: e.target.checked })} className="h-4 w-4 accent-[#E2B93B]" />
            <span className="text-[11px] text-white/40 font-['Instrument_Sans'] tracking-wider uppercase">Archived</span>
          </label>
          <FormField label="Posts in series (ordered)">
            <div className="space-y-2">
              {form.posts.map((slug, i) => (
                <div key={slug} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#E2B93B]/50 font-['Instrument_Sans'] w-5">{i + 1}.</span>
                  <span className="text-[11px] text-white/50 font-['Instrument_Sans'] flex-1 truncate">{slug}</span>
                  <button
                    onClick={() => {
                      if (i > 0) {
                        const arr = [...form.posts];
                        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                        setForm({ ...form, posts: arr });
                      }
                    }}
                    className="text-[9px] text-white/20 hover:text-white/50 transition-colors"
                    disabled={i === 0}
                  >↑</button>
                  <button
                    onClick={() => {
                      if (i < form.posts.length - 1) {
                        const arr = [...form.posts];
                        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                        setForm({ ...form, posts: arr });
                      }
                    }}
                    className="text-[9px] text-white/20 hover:text-white/50 transition-colors"
                    disabled={i === form.posts.length - 1}
                  >↓</button>
                  <button
                    onClick={() => setForm({ ...form, posts: form.posts.filter((_, j) => j !== i) })}
                    className="text-white/20 hover:text-red-400/60 transition-colors"
                  ><X size={11} /></button>
                </div>
              ))}
              {/* Add post dropdown */}
              <select
                className={adminCx.select}
                value=""
                onChange={(e) => {
                  if (e.target.value && !form.posts.includes(e.target.value)) {
                    setForm({ ...form, posts: [...form.posts, e.target.value] });
                  }
                }}
              >
                <option value="" style={{ background: "#0A0A0A" }}>+ Add a post...</option>
                {postSlugs.filter((s) => !form.posts.includes(s)).map((s) => (
                  <option key={s} value={s} style={{ background: "#0A0A0A" }}>{s}</option>
                ))}
              </select>
            </div>
          </FormField>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] tracking-[0.15em] text-white/25 font-['Instrument_Sans'] uppercase">
          {series.length} series
        </span>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors"
        >
          <Plus size={13} /> NEW SERIES
        </button>
      </div>
      <div className="max-w-2xl border border-white/[0.07] overflow-hidden">
        {series.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="text-[11px] text-white/20 font-['Instrument_Sans']">No series yet. Create one to group related posts.</p>
          </div>
        )}
        {series.map((s) => (
          <div
            key={s.slug}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
          >
            {s.cover ? (
              <div className="w-10 h-8 shrink-0 bg-cover bg-center border border-white/[0.06]" style={{ backgroundImage: `url(${s.cover})` }} />
            ) : (
              <div className="w-10 h-8 shrink-0 bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                <span className="text-[7px] text-white/15 font-['Instrument_Sans']">SER</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-['Instrument_Sans'] text-white/75 truncate">{s.title}</p>
              <p className="text-[9px] text-white/25 font-['Instrument_Sans']">
                {s.posts.length} post{s.posts.length !== 1 ? "s" : ""} · {s.slug}
                {s.archived && <span className="ml-1.5 text-white/15">ARCHIVED</span>}
              </p>
            </div>
            <button
              onClick={() => startEdit(s)}
              className="text-white/20 hover:text-[#E2B93B]/60 transition-colors p-1"
              title="Edit series"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete series "${s.title}"? Posts will not be deleted.`)) {
                  deleteSeries(s.slug);
                }
              }}
              className="text-white/20 hover:text-red-400/60 transition-colors p-1"
              title="Delete series"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Categories Manager ─────────────────────────────────────────────
function CategoriesManager({
  categories,
  onUpdate,
}: {
  categories: string[];
  onUpdate: (updated: string[]) => void;
}) {
  const [items, setItems] = useState(categories);
  const [newCat, setNewCat] = useState("");
  const dirty = JSON.stringify(items) !== JSON.stringify(categories);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  function addCategory() {
    const cat = newCat.trim();
    if (!cat || items.includes(cat)) return;
    setItems([...items, cat]);
    setNewCat("");
  }

  function removeCategory(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const arr = [...items];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setItems(arr);
  }

  function moveDown(idx: number) {
    if (idx === items.length - 1) return;
    const arr = [...items];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setItems(arr);
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] tracking-[0.15em] text-white/25 font-['Instrument_Sans'] uppercase">
          {items.length} categories
        </span>
        {dirty && (
          <button
            onClick={() => onUpdate(items)}
            className="px-5 py-1.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors"
          >
            SAVE
          </button>
        )}
      </div>

      <div className="border border-white/[0.07] overflow-hidden mb-4">
        {items.map((cat, i) => (
          <div
            key={cat}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-[10px] text-[#E2B93B]/40 font-['Instrument_Sans'] w-4">{i + 1}</span>
            <span className="text-[12px] text-white/60 font-['Instrument_Sans'] flex-1">{cat}</span>
            <button onClick={() => moveUp(i)} disabled={i === 0} className="text-[9px] text-white/20 hover:text-white/50 transition-colors disabled:opacity-30">↑</button>
            <button onClick={() => moveDown(i)} disabled={i === items.length - 1} className="text-[9px] text-white/20 hover:text-white/50 transition-colors disabled:opacity-30">↓</button>
            <button onClick={() => removeCategory(i)} className="text-white/20 hover:text-red-400/60 transition-colors"><X size={11} /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className={adminCx.input}
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
          placeholder="New category name"
        />
        <button
          onClick={addCategory}
          disabled={!newCat.trim() || items.includes(newCat.trim())}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[10px] tracking-[0.1em] hover:bg-white transition-colors disabled:opacity-50"
        >
          <Plus size={12} /> ADD
        </button>
      </div>
    </div>
  );
}

// ─── Blog Admin Page ───────────────────────────────────────────────
function AdminBlogPage() {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [tab, setTab] = useState<"posts" | "series" | "categories">("posts");
  const [posts, setPosts] = useState<ManagedPost[]>(INITIAL_POSTS);
  const [seriesList, setSeriesList] = useState<ManagedSeries[]>(INITIAL_SERIES);
  const [categoryList, setCategoryList] = useState<string[]>(DEFAULT_CATEGORIES);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savingSeries, setSavingSeries] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (pendingRevert?.section === "blog") {
      setPosts(pendingRevert.snapshot as ManagedPost[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  useEffect(() => {
    let mounted = true;
    async function hydrateFromSavedContent() {
      const [postsRaw, seriesRaw, categoriesRaw] = await Promise.all([
        loadContent("content/blog.json"),
        loadContent("content/blog-series.json"),
        loadContent("content/blog-categories.json"),
      ]);
      if (!mounted) return;

      const nextPosts = parseManagedPosts(postsRaw);
      const nextSeries = parseManagedSeries(seriesRaw);
      const fallbackCategories = [
        ...new Set(nextPosts.map((post) => post.meta.category).filter(Boolean)),
      ];
      const nextCategories = parseCategories(
        categoriesRaw,
        fallbackCategories.length > 0 ? fallbackCategories : DEFAULT_CATEGORIES
      );

      setPosts(nextPosts);
      setSeriesList(nextSeries);
      setCategoryList(nextCategories);
    }
    hydrateFromSavedContent();
    return () => {
      mounted = false;
    };
  }, []);

  const activePost = posts.find((p) => p.slug === activeSlug) ?? null;

  async function savePost(post: ManagedPost) {
    setSavingSlug(post.slug);
    const result = await saveBlogPost(post.slug, post, `Updated ${post.meta.title}`);
    if (result.ok) {
      const updated = posts.map((p) => (p.slug === post.slug ? post : p));
      const exists = posts.some((p) => p.slug === post.slug);
      const final = exists ? updated : [...posts, post];
      setPosts(final);
      pushHistory("blog", "Blog", `Saved: ${post.meta.title}`, final);
      setLastSaved(new Date().toLocaleTimeString());
      setActiveSlug(post.slug);
    }
    setSavingSlug(null);
  }

  async function handleSeriesUpdate(updated: ManagedSeries[]) {
    setSavingSeries(true);
    const result = await saveBlogSeries(updated, "Update blog series");
    if (result.ok) {
      setSeriesList(updated);
      pushHistory("blog", "Blog", "Updated series", updated);
      setLastSaved(new Date().toLocaleTimeString());
    }
    setSavingSeries(false);
  }

  function newPost() {
    const slug = `new-post-${Date.now()}`;
    const blank: ManagedPost = {
      slug,
      status: "draft",
      slides: [],
      meta: {
        title: "Untitled Post",
        date: new Date().toISOString().slice(0, 10),
        category: categoryList[0] ?? "Thinking",
        tags: [],
        cover: "",
        summary: "",
        readingTime: 5,
        featured: false,
      },
    };
    setPosts((p) => [blank, ...p]);
    setActiveSlug(slug);
  }

  return (
    <div>
      {!activePost ? (
        <div>
          <PageHeader
            index={6}
            title="Blog"
            description="Write and manage blog posts and series."
            lastSaved={lastSaved}
          />

          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-6">
            {(["posts", "series", "categories"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="text-[10px] tracking-[0.15em] px-4 py-2 font-['Instrument_Sans'] uppercase transition-all border"
                style={{
                  borderColor: tab === t ? "rgba(226,185,59,0.4)" : "rgba(255,255,255,0.06)",
                  color: tab === t ? "#E2B93B" : "rgba(255,255,255,0.25)",
                  background: tab === t ? "rgba(226,185,59,0.06)" : "transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "posts" && (
            <>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] tracking-[0.15em] text-white/25 font-['Instrument_Sans'] uppercase">
                  {posts.length} post{posts.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={newPost}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors"
                >
                  <Plus size={13} /> NEW POST
                </button>
              </div>
              <div className="max-w-2xl border border-white/[0.07] overflow-hidden">
                {posts.map((post) => (
                  <PostListItem
                    key={post.slug}
                    post={post}
                    isActive={false}
                    onClick={() => setActiveSlug(post.slug)}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "series" && (
            <SeriesManager
              series={seriesList}
              onUpdate={handleSeriesUpdate}
              isSaving={savingSeries}
              postSlugs={posts.map((p) => p.slug)}
            />
          )}

          {tab === "categories" && (
            <CategoriesManager
              categories={categoryList}
              onUpdate={async (updated) => {
                const result = await saveBlogCategories(updated, "Update blog categories");
                if (result.ok) {
                  setCategoryList(updated);
                  pushHistory("blog", "Blog", "Updated categories", updated);
                  setLastSaved(new Date().toLocaleTimeString());
                }
              }}
            />
          )}
        </div>
      ) : (
        /* Full editor view */
        <div className="-mx-10 -my-12 h-screen flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
          <div className="px-6 py-2.5 border-b border-white/[0.05] flex items-center gap-3 bg-[#0A0A0A] shrink-0">
            <button
              onClick={() => setActiveSlug(null)}
              className="text-[10px] font-['Instrument_Sans'] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              ← All Posts
            </button>
            <span className="text-white/10">/</span>
            <span className="text-[10px] font-['Instrument_Sans'] text-white/30 truncate">
              {activePost.meta.title}
            </span>
            {lastSaved && (
              <span className="text-[9px] text-white/15 font-['Instrument_Sans'] ml-auto">
                Saved {lastSaved}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <PostEditor
              post={activePost}
              onSave={savePost}
              onClose={() => setActiveSlug(null)}
              isSaving={savingSlug === activePost.slug}
              seriesList={seriesList}
              categoryList={categoryList}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBlogPage;
