"use client";

/**
 * ADMIN — BLOG
 * Full post editor: metadata + slide content editor.
 *
 * TODO (Cursor): On mount, fetch:
 *   GET /make-server-3fa6479f/admin/content/blog → BlogPost[]
 *   Currently uses static BLOG_POSTS as initial data.
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saveBlogSeries, saveBlogCategories, loadContent, saveContent } from "@/app/admin/actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, PageHeader, FormField } from "@/components/admin/admin-primitives";
import { ImageFieldGuide, ImageRatioHint } from "@/components/admin/image-system-guide";
import { SlideEditor } from "@/components/admin/slide-editor";
import { useAdminEditorShortcuts } from "@/hooks/useAdminEditorShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import { BLOG_SERIES } from "@/lib/data/blog-series-data";
import { openOnKeyboard } from "@/lib/admin/interaction";
import { rememberAdminEditor } from "@/lib/admin/recent-editor";
import type { BlogSeries } from "@/types/blog";
import type { Slide } from "@/types/case-study";
import { Plus, Eye, Tag, X, ChevronDown, ChevronRight, Pencil, Trash2, Copy } from "lucide-react";

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
  status: "published" | "draft" | "scheduled" | "archived";
}

const DEFAULT_CATEGORIES = ["Thinking", "Craft", "Case Notes", "Process", "Life", "Industry", "Tools"];
const BLOG_FILTER_STORAGE_KEY = "admin:blog:filters";

type BlogFilterState = {
  searchQuery: string;
  statusFilter: "all" | ManagedPost["status"];
  categoryFilter: string;
};

function getPublicPostUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/blog/${slug}`;
  }
  return `https://derondsgnr.com/blog/${slug}`;
}

function markdownImage(url?: string, alt = ""): string {
  if (!url?.trim()) return "";
  return `![${alt}](${url.trim()})`;
}

function slideToSubstackMarkdown(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return [
        slide.headline ? `# ${slide.headline}` : "",
        slide.subtitle ?? "",
        markdownImage(slide.heroImage, slide.headline),
      ].filter(Boolean).join("\n\n");
    case "section-break":
      return [
        `## ${slide.actTitle}`,
        slide.subtitle ?? "",
      ].filter(Boolean).join("\n\n");
    case "narrative":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.body,
        slide.annotation ? `> ${slide.annotation}` : "",
      ].filter(Boolean).join("\n\n");
    case "quote":
      return [
        `> ${slide.quote}`,
        slide.attribution ? `- ${slide.attribution}${slide.role ? `, ${slide.role}` : ""}` : "",
      ].filter(Boolean).join("\n\n");
    case "insight":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.body ?? "",
        slide.insightLabel ? `**${slide.insightLabel}**` : "",
        slide.insightText,
        markdownImage(slide.image, slide.headline),
      ].filter(Boolean).join("\n\n");
    case "metric":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.metrics.map((metric) => `- **${metric.value}** ${metric.label}${metric.delta ? ` (${metric.delta})` : ""}`).join("\n"),
        markdownImage(slide.image, slide.headline),
      ].filter(Boolean).join("\n\n");
    case "single-mockup":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        markdownImage(slide.image, slide.caption ?? slide.headline),
        slide.caption ?? "",
        slide.annotation ? `> ${slide.annotation}` : "",
      ].filter(Boolean).join("\n\n");
    case "comparison":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        markdownImage(slide.before.image, slide.before.label),
        slide.before.label,
        markdownImage(slide.after.image, slide.after.label),
        slide.after.label,
      ].filter(Boolean).join("\n\n");
    case "flow":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.screens
          .map((screen) => [markdownImage(screen.image, screen.label), screen.label ?? ""].filter(Boolean).join("\n\n"))
          .join("\n\n"),
      ].filter(Boolean).join("\n\n");
    case "embed":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.embedUrl,
        markdownImage(slide.fallbackImage, slide.caption ?? slide.headline),
        slide.caption ?? "",
      ].filter(Boolean).join("\n\n");
    case "video":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.videoUrl ?? "",
        markdownImage(slide.posterImage, slide.caption ?? slide.headline),
        slide.caption ?? "",
      ].filter(Boolean).join("\n\n");
    case "mockup-gallery":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.mockups
          .map((mockup) => [markdownImage(mockup.image, mockup.label), mockup.label ?? ""].filter(Boolean).join("\n\n"))
          .join("\n\n"),
      ].filter(Boolean).join("\n\n");
    case "process":
      return [
        slide.headline ? `## ${slide.headline}` : "",
        slide.artifacts
          .map((artifact) => [
            markdownImage(artifact.image, artifact.label),
            `**${artifact.label}**`,
            artifact.description ?? "",
          ].filter(Boolean).join("\n\n"))
          .join("\n\n"),
      ].filter(Boolean).join("\n\n");
    default:
      return "";
  }
}

function buildSubstackMarkdown(post: ManagedPost): string {
  const url = getPublicPostUrl(post.slug);
  const body = post.slides.map(slideToSubstackMarkdown).filter(Boolean).join("\n\n---\n\n");
  return [
    `# ${post.meta.title}`,
    post.meta.summary,
    markdownImage(post.meta.cover, post.meta.title),
    body,
    `Originally published at ${url}`,
  ].filter(Boolean).join("\n\n");
}

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
  onToggleArchive,
  onDelete,
}: {
  post: ManagedPost;
  isActive: boolean;
  onClick: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}) {
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
            {post.status === "scheduled" && <span className="ml-1.5 text-[#E2B93B]/55">SCHEDULED {post.meta.date}</span>}
            {post.status === "archived" && <span className="ml-1.5 text-white/20">ARCHIVED</span>}
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
          {post.status === "archived" ? "Unarchive" : "Archive"}
        </button>
        <AdminConfirmAction
          title="Delete post?"
          description={`Delete "${post.meta.title}" permanently from the blog JSON.`}
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
  const [substackCopyState, setSubstackCopyState] = useState<"idle" | "markdown" | "source" | "error">("idle");
  const categoryOptions =
    form.meta.category && !categoryList.includes(form.meta.category)
      ? [form.meta.category, ...categoryList]
      : categoryList;
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(post),
    [form, post]
  );
  const confirmIfUnsaved = useUnsavedChangesGuard(
    hasUnsavedChanges,
    "You have unsaved changes in this blog post. Leave without saving?"
  );
  useAdminEditorShortcuts({
    onSave: () => onSave(form),
    onCancel: () => {
      if (confirmIfUnsaved()) onClose();
    },
    saveEnabled: !isSaving,
  });

  // Sync when post changes (switching posts)
  useEffect(() => { setForm(post); }, [post]);

  function setMeta(key: keyof PostMeta, value: unknown) {
    setForm((f) => ({ ...f, meta: { ...f.meta, [key]: value } }));
  }

  async function copySubstackText(type: "markdown" | "source") {
    const url = getPublicPostUrl(form.slug);
    const text =
      type === "markdown"
        ? buildSubstackMarkdown(form)
        : `Originally published on derondsgnr.com: ${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setSubstackCopyState(type);
      window.setTimeout(() => setSubstackCopyState("idle"), 2200);
    } catch {
      setSubstackCopyState("error");
    }
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
          {hasUnsavedChanges ? (
            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#E2B93B]/70 font-['Instrument_Sans']">
              Unsaved changes · Cmd/Ctrl+S saves
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ManagedPost["status"] }))}
            className="text-[10px] font-['Instrument_Sans'] tracking-wider bg-white/[0.03] border border-white/[0.08] text-white/40 px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
            <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
            <option value="scheduled" style={{ background: "#0A0A0A" }}>Scheduled</option>
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
                        {categoryOptions.map((c) => <option key={c} value={c} style={{ background: "#0A0A0A" }}>{c}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Status">
                      <select className={adminCx.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ManagedPost["status"] }))}>
                        <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
                        <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
                        <option value="scheduled" style={{ background: "#0A0A0A" }}>Scheduled</option>
                        <option value="archived" style={{ background: "#0A0A0A" }}>Archived</option>
                      </select>
                      {form.status === "scheduled" ? (
                        <p className="mt-1 text-[10px] leading-relaxed text-[#E2B93B]/65 font-['Instrument_Sans']">
                          Uses the Date field as the publish date. The post stays hidden publicly until that date.
                        </p>
                      ) : null}
                    </FormField>
                  </div>
                  <FormField label="Cover Image URL" className="lg:col-span-2">
                    <ImageRatioHint role="blog-cover" className="mb-2" />
                    <input className={adminCx.input} value={form.meta.cover} onChange={(e) => setMeta("cover", e.target.value)} placeholder="https://..." />
                    <ImageFieldGuide role="blog-cover" imageUrl={form.meta.cover} compact className="mt-3" />
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
        <div className="border-b border-white/[0.06] px-6 py-5">
          <div className="border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] tracking-[0.2em] text-[#E2B93B]/70 font-['Instrument_Sans'] uppercase">
                  Substack Distribution
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/55 font-['Instrument_Sans']">
                  Publish here first, then use this helper to move a clean version into Substack.
                  Final formatting and email send still happen inside Substack.
                </p>
                <div className="mt-3 grid gap-1 text-[10px] leading-relaxed text-white/35 font-['Instrument_Sans']">
                  <span>1. Save or publish the portfolio version.</span>
                  <span>2. Copy the Substack-ready Markdown.</span>
                  <span>3. Paste into Substack, review images/embeds, then send or schedule there.</span>
                  <span>4. Keep the source note so readers can find the canonical portfolio post.</span>
                </div>
                <p className="mt-3 break-all text-[10px] text-white/25 font-['Instrument_Sans']">
                  Source URL: {getPublicPostUrl(form.slug)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => copySubstackText("markdown")}
                  className="flex items-center gap-1.5 border border-[#E2B93B]/30 bg-[#E2B93B]/10 px-3 py-2 text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-[#E2B93B]/80 transition-colors hover:bg-[#E2B93B]/15"
                >
                  <Copy size={12} />
                  {substackCopyState === "markdown" ? "Copied" : "Copy Markdown"}
                </button>
                <button
                  type="button"
                  onClick={() => copySubstackText("source")}
                  className="flex items-center gap-1.5 border border-white/[0.08] px-3 py-2 text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-white/35 transition-colors hover:border-white/20 hover:text-white/65"
                >
                  <Copy size={12} />
                  {substackCopyState === "source" ? "Copied" : "Copy Source Note"}
                </button>
                <a
                  href="https://substack.com/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-white/[0.08] px-3 py-2 text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-white/35 transition-colors hover:border-white/20 hover:text-white/65"
                >
                  Open Substack
                </a>
                {substackCopyState === "error" ? (
                  <p className="basis-full text-[10px] uppercase tracking-[0.12em] text-red-300/60 font-['Instrument_Sans']">
                    Clipboard blocked. Select and copy manually from the generated post preview later.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

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

function isManagedPostArray(value: unknown): value is ManagedPost[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<ManagedPost>;
    return typeof candidate.slug === "string" && Array.isArray(candidate.slides) && Boolean(candidate.meta);
  });
}

function isManagedSeriesArray(value: unknown): value is ManagedSeries[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<ManagedSeries>;
    return typeof candidate.slug === "string" && Array.isArray(candidate.posts);
  });
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
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
  const originalSeries = editingSlug && editingSlug !== "__new__"
    ? series.find((item) => item.slug === editingSlug) ?? null
    : null;
  const hasUnsavedChanges = Boolean(
    form && JSON.stringify(form) !== JSON.stringify(originalSeries)
  );
  const confirmIfUnsaved = useUnsavedChangesGuard(
    hasUnsavedChanges,
    "You have unsaved changes in this series. Leave without saving?"
  );
  useAdminEditorShortcuts({
    onSave: saveForm,
    onCancel: cancelEdit,
    saveEnabled: Boolean(form?.title.trim()) && !isSaving,
  });

  function startEdit(s: ManagedSeries) {
    if (!confirmIfUnsaved()) return;
    setEditingSlug(s.slug);
    setForm({ ...s });
  }

  function startNew() {
    if (!confirmIfUnsaved()) return;
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
    if (!confirmIfUnsaved()) return;
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
        {hasUnsavedChanges ? (
          <p className="mb-3 text-[9px] uppercase tracking-[0.16em] text-[#E2B93B]/70 font-['Instrument_Sans']">
            Unsaved changes · Cmd/Ctrl+S saves · Esc closes when not typing
          </p>
        ) : null}
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
            <ImageRatioHint role="blog-cover" className="mb-2" />
            <input className={adminCx.input} value={form.cover ?? ""} onChange={(e) => setForm({ ...form, cover: e.target.value || undefined })} placeholder="https://..." />
            <ImageFieldGuide role="blog-cover" imageUrl={form.cover} compact className="mt-3" />
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
            <AdminConfirmAction
              title="Delete series?"
              description={`Delete "${s.title}" from series organization. Posts inside it will not be deleted.`}
              confirmLabel="Delete"
              destructive
              onConfirm={() => deleteSeries(s.slug)}
            >
              <button
                className="text-white/20 hover:text-red-400/60 transition-colors p-1"
                title="Delete series"
              >
                <Trash2 size={13} />
              </button>
            </AdminConfirmAction>
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

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  function addCategory() {
    const cat = newCat.trim();
    if (!cat || items.includes(cat)) return;
    const next = [...items, cat];
    setItems(next);
    onUpdate(next);
    setNewCat("");
  }

  function removeCategory(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    onUpdate(next);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const arr = [...items];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setItems(arr);
    onUpdate(arr);
  }

  function moveDown(idx: number) {
    if (idx === items.length - 1) return;
    const arr = [...items];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setItems(arr);
    onUpdate(arr);
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] tracking-[0.15em] text-white/25 font-['Instrument_Sans'] uppercase">
          {items.length} categories
        </span>
        <span className="text-[9px] tracking-[0.14em] text-white/35 font-['Instrument_Sans'] uppercase">
          Auto-saves on edit
        </span>
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
  const [seriesError, setSeriesError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ManagedPost["status"]>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [filterStorageReady, setFilterStorageReady] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const latestCategorySave = useRef(0);
  const latestSeriesSave = useRef(0);
  const skipHydrateOnceRef = useRef(false);
  const POSTS_PAGE_SIZE = 20;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BLOG_FILTER_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<BlogFilterState>;
      if (typeof parsed.searchQuery === "string") setSearchQuery(parsed.searchQuery);
      if (
        parsed.statusFilter === "all" ||
        parsed.statusFilter === "published" ||
        parsed.statusFilter === "draft" ||
        parsed.statusFilter === "scheduled" ||
        parsed.statusFilter === "archived"
      ) {
        setStatusFilter(parsed.statusFilter);
      }
      if (typeof parsed.categoryFilter === "string") setCategoryFilter(parsed.categoryFilter);
    } catch {
      window.localStorage.removeItem(BLOG_FILTER_STORAGE_KEY);
    } finally {
      setFilterStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!filterStorageReady) return;
    const state: BlogFilterState = { searchQuery, statusFilter, categoryFilter };
    window.localStorage.setItem(BLOG_FILTER_STORAGE_KEY, JSON.stringify(state));
  }, [categoryFilter, filterStorageReady, searchQuery, statusFilter]);

  useEffect(() => {
    if (pendingRevert?.section === "blog") {
      skipHydrateOnceRef.current = true;
      if (pendingRevert.target === "series" && isManagedSeriesArray(pendingRevert.snapshot)) {
        setSeriesList(pendingRevert.snapshot);
        clearPendingRevert();
        return;
      }
      if (pendingRevert.target === "categories" && isStringArray(pendingRevert.snapshot)) {
        setCategoryList(pendingRevert.snapshot);
        clearPendingRevert();
        return;
      }
      if (isManagedPostArray(pendingRevert.snapshot)) {
        setPosts(pendingRevert.snapshot);
      }
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  useEffect(() => {
    let mounted = true;
    async function hydrateFromSavedContent() {
      if (skipHydrateOnceRef.current) {
        skipHydrateOnceRef.current = false;
        return;
      }
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

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("post");
    if (slug && posts.some((post) => post.slug === slug)) {
      setActiveSlug(slug);
    }
  }, [posts]);

  const activePost = posts.find((p) => p.slug === activeSlug) ?? null;
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        if (statusFilter !== "all" && post.status !== statusFilter) return false;
        if (categoryFilter !== "all" && post.meta.category !== categoryFilter) return false;
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          post.meta.title.toLowerCase().includes(query) ||
          post.meta.summary.toLowerCase().includes(query) ||
          post.meta.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }),
    [posts, statusFilter, categoryFilter, searchQuery],
  );
  const postsPageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice(
    (postsPage - 1) * POSTS_PAGE_SIZE,
    postsPage * POSTS_PAGE_SIZE,
  );

  useEffect(() => {
    setPostsPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    if (postsPage > postsPageCount) {
      setPostsPage(postsPageCount);
    }
  }, [postsPage, postsPageCount]);

  async function savePost(post: ManagedPost) {
    setSavingSlug(post.slug);
    const updated = posts.map((p) => (p.slug === post.slug ? post : p));
    const exists = posts.some((p) => p.slug === post.slug);
    const final = exists ? updated : [...posts, post];
    const ok = await persistPosts(final, `Saved: ${post.meta.title}`);
    if (ok) openPost(post);
    setSavingSlug(null);
  }

  async function persistPosts(nextPosts: ManagedPost[], message: string) {
    const result = await saveContent("content/blog.json", JSON.stringify(nextPosts, null, 2), message);
    if (!result.ok) return false;
    setPosts(nextPosts);
    pushHistory("blog", "Blog", message, nextPosts, "posts");
    setLastSaved(new Date().toLocaleTimeString());
    return true;
  }

  async function toggleArchiveFromList(post: ManagedPost) {
    const nextStatus: ManagedPost["status"] = post.status === "archived" ? "published" : "archived";
    const nextPosts = posts.map((item) =>
      item.slug === post.slug ? { ...item, status: nextStatus } : item
    );
    await persistPosts(
      nextPosts,
      `${nextStatus === "archived" ? "Archived" : "Unarchived"}: ${post.meta.title}`
    );
  }

  async function deletePostFromList(post: ManagedPost) {
    const nextPosts = posts.filter((item) => item.slug !== post.slug);
    const ok = await persistPosts(nextPosts, `Deleted: ${post.meta.title}`);
    if (ok && activeSlug === post.slug) {
      setActiveSlug(null);
    }
  }

  function openPost(post: ManagedPost) {
    rememberAdminEditor({
      section: "blog",
      label: post.meta.title,
      href: `/admin/blog?post=${post.slug}`,
    });
    window.history.replaceState(null, "", `/admin/blog?post=${post.slug}`);
    setActiveSlug(post.slug);
  }

  async function handleSeriesUpdate(updated: ManagedSeries[]) {
    const previous = seriesList;
    const requestId = latestSeriesSave.current + 1;
    latestSeriesSave.current = requestId;
    setSavingSeries(true);
    setSeriesError(null);
    setSeriesList(updated);
    const result = await saveBlogSeries(updated, "Update blog series");
    if (requestId !== latestSeriesSave.current) return;
    if (result.ok) {
      pushHistory("blog", "Blog", "Updated series", updated, "series");
      setLastSaved(new Date().toLocaleTimeString());
      setSavingSeries(false);
      return;
    }
    setSeriesList(previous);
    setSeriesError(result.error ?? "Couldn't save series right now.");
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
    openPost(blank);
  }

  function closePostEditor() {
    window.history.replaceState(null, "", "/admin/blog");
    setActiveSlug(null);
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
                  {filteredPosts.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={newPost}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[11px] tracking-[0.12em] hover:bg-white transition-colors"
                >
                  <Plus size={13} /> NEW POST
                </button>
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2 max-w-2xl">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={adminCx.input}
                  placeholder="Search title, summary, or tag..."
                />
                <select
                  className={adminCx.select}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | ManagedPost["status"])}
                >
                  <option value="all" style={{ background: "#0A0A0A" }}>All statuses</option>
                  <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
                  <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
                  <option value="scheduled" style={{ background: "#0A0A0A" }}>Scheduled</option>
                  <option value="archived" style={{ background: "#0A0A0A" }}>Archived</option>
                </select>
                <select
                  className={adminCx.select}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all" style={{ background: "#0A0A0A" }}>All categories</option>
                  {categoryList.map((category) => (
                    <option key={category} value={category} style={{ background: "#0A0A0A" }}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="max-w-2xl border border-white/[0.07] overflow-hidden">
                {paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post) => (
                    <PostListItem
                      key={post.slug}
                      post={post}
                      isActive={false}
                      onClick={() => openPost(post)}
                      onToggleArchive={() => toggleArchiveFromList(post)}
                      onDelete={() => deletePostFromList(post)}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-['Instrument_Sans']">
                      No posts match this view
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/30 font-['Instrument_Sans']">
                      Clear the search or switch filters. Your filters are saved so this view will be waiting when you come back.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setCategoryFilter("all");
                      }}
                      className="mt-4 border border-white/[0.08] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:border-[#E2B93B]/35 hover:text-[#E2B93B]/80 font-['Instrument_Sans']"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              {filteredPosts.length > POSTS_PAGE_SIZE ? (
                <div className="max-w-2xl mt-3 flex items-center justify-between">
                  <p className="text-[10px] text-white/30 font-['Instrument_Sans']">
                    Page {postsPage} of {postsPageCount}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={postsPage === 1}
                      onClick={() => setPostsPage((page) => Math.max(1, page - 1))}
                      className="px-3 py-1.5 border border-white/[0.08] text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-white/40 hover:text-white/70 hover:border-white/20 disabled:opacity-30"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={postsPage === postsPageCount}
                      onClick={() => setPostsPage((page) => Math.min(postsPageCount, page + 1))}
                      className="px-3 py-1.5 border border-white/[0.08] text-[10px] font-['Instrument_Sans'] uppercase tracking-[0.12em] text-white/40 hover:text-white/70 hover:border-white/20 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {tab === "series" && (
            <div>
              <SeriesManager
                series={seriesList}
                onUpdate={handleSeriesUpdate}
                isSaving={savingSeries}
                postSlugs={posts.map((p) => p.slug)}
              />
              {seriesError ? (
                <p className="mt-3 text-[11px] font-['Instrument_Sans'] text-red-400/80">
                  {seriesError}
                </p>
              ) : null}
            </div>
          )}

          {tab === "categories" && (
            <div>
              <CategoriesManager
                categories={categoryList}
                onUpdate={async (updated) => {
                  const previous = categoryList;
                  const requestId = latestCategorySave.current + 1;
                  latestCategorySave.current = requestId;
                  setCategoryList(updated);
                  setCategoryError(null);
                  const result = await saveBlogCategories(updated, "Update blog categories");
                  if (requestId !== latestCategorySave.current) return;
                  if (result.ok) {
                    pushHistory("blog", "Blog", "Updated categories", updated, "categories");
                    setLastSaved(new Date().toLocaleTimeString());
                    return;
                  }
                  setCategoryList(previous);
                  setCategoryError(result.error ?? "Couldn't save categories right now.");
                }}
              />
              {categoryError ? (
                <p className="mt-3 text-[11px] font-['Instrument_Sans'] text-red-400/80">
                  {categoryError}
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        /* Full editor view */
        <div className="-mx-6 lg:-mx-8 -mt-6 lg:-mt-8 -mb-6 lg:-mb-8 h-[calc(100dvh-3.5rem)] lg:h-[100dvh] flex flex-col">
          <div className="px-6 py-2.5 border-b border-white/[0.05] flex items-center gap-3 bg-[#0A0A0A] shrink-0 sticky top-0 z-20">
            <button
              data-unsaved-guard-trigger
              onClick={closePostEditor}
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
          <div className="flex-1 min-h-0 overflow-hidden">
            <PostEditor
              post={activePost}
              onSave={savePost}
              onClose={closePostEditor}
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
