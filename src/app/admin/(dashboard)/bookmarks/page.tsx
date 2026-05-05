"use client";

/**
 * ADMIN — BOOKMARKS REPOSITORY
 * Personal media board. Import bookmarks from social accounts manually.
 * Filter by platform, category, type. Visual masonry grid.
 *
 * Data synced to Supabase KV (key prefix: bookmark:).
 * localStorage used as fast cache; KV is source of truth.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AdminNotice } from "@/components/admin/admin-notice";
import { adminCx, FormField } from "@/components/admin/admin-primitives";
import {
  Plus, X, Search, Trash2, ExternalLink, Edit3,
  Youtube, Twitter, Instagram, Github, Figma, Grid, List,
  Bookmark, Tag, Copy, Clapperboard,
} from "lucide-react";
import {
  fetchAllBookmarks,
  saveBookmark,
  deleteBookmark as deleteBookmarkAction,
} from "@/app/admin/actions";
import { getAdminErrorMessage } from "@/lib/admin/feedback";
import { bookmarkToInspiration, enqueueInspirationRefs } from "@/lib/admin/presentation-inspiration";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────
type Platform = "youtube" | "twitter" | "instagram" | "tiktok" | "figma" | "dribbble" | "github" | "pinterest" | "other";
type MediaType = "video" | "image" | "link";
type BookmarkCategory = "design-inspo" | "typography" | "motion" | "products" | "writing" | "code" | "random";

interface BookmarkItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  platform: Platform;
  category: BookmarkCategory;
  tags: string[];
  notes: string;
  mediaType: MediaType;
  dateAdded: number;
}

// ─── Platform config ───────────────────────────────────────────────
const PLATFORMS: Record<Platform, { label: string; color: string; icon: React.ElementType }> = {
  youtube:   { label: "YouTube",   color: "#FF0000", icon: Youtube },
  twitter:   { label: "Twitter/X", color: "#1DA1F2", icon: Twitter },
  instagram: { label: "Instagram", color: "#E1306C", icon: Instagram },
  tiktok:    { label: "TikTok",    color: "#69C9D0", icon: Bookmark },
  figma:     { label: "Figma",     color: "#A259FF", icon: Figma },
  dribbble:  { label: "Dribbble",  color: "#EA4C89", icon: Bookmark },
  github:    { label: "GitHub",    color: "#6e7681", icon: Github },
  pinterest: { label: "Pinterest", color: "#E60023", icon: Bookmark },
  other:     { label: "Other",     color: "#6b6b6b", icon: ExternalLink },
};

const CATEGORIES: Record<BookmarkCategory, { label: string; color: string }> = {
  "design-inspo": { label: "Design Inspo", color: "#E2B93B" },
  "typography":   { label: "Typography",   color: "#4DABF7" },
  "motion":       { label: "Motion",       color: "#DA77F2" },
  "products":     { label: "Products",     color: "#69DB7C" },
  "writing":      { label: "Writing",      color: "#FFA94D" },
  "code":         { label: "Code",         color: "#63E6BE" },
  "random":       { label: "Random",       color: "#9CA3AF" },
};

// ─── Platform detection ────────────────────────────────────────────
function detectPlatform(url: string): Platform {
  if (!url) return "other";
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("tiktok.com")) return "tiktok";
  if (u.includes("figma.com")) return "figma";
  if (u.includes("dribbble.com")) return "dribbble";
  if (u.includes("github.com")) return "github";
  if (u.includes("pinterest.com")) return "pinterest";
  return "other";
}

function detectMediaType(url: string, platform: Platform): MediaType {
  if (platform === "youtube" || platform === "tiktok") return "video";
  if (platform === "instagram") return "image";
  return "link";
}

// ─── Mock initial data ─────────────────────────────────────────────
const MOCK_BOOKMARKS: BookmarkItem[] = [
  { id: "bm-01", url: "https://youtube.com/watch?v=dQw4w9WgXcQ", title: "Apple Vision Pro — Full UI Breakdown", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", platform: "youtube", category: "design-inspo", tags: ["spatial", "apple", "UI"], notes: "Reference for depth hierarchy in the hero", mediaType: "video", dateAdded: Date.now() - 86400000 * 2 },
  { id: "bm-02", url: "https://twitter.com/", title: "Emre Arslan — Editorial grid system thread", thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", platform: "twitter", category: "typography", tags: ["grid", "editorial", "layout"], notes: "", mediaType: "link", dateAdded: Date.now() - 86400000 * 4 },
  { id: "bm-03", url: "https://dribbble.com/", title: "Glassmorphism — Dark card system", thumbnail: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", platform: "dribbble", category: "design-inspo", tags: ["glass", "dark", "cards"], notes: "Reference for the admin panel card style", mediaType: "image", dateAdded: Date.now() - 86400000 * 7 },
  { id: "bm-04", url: "https://figma.com/", title: "Auto-layout variables — advanced patterns", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", platform: "figma", category: "code", tags: ["figma", "variables", "autolayout"], notes: "", mediaType: "link", dateAdded: Date.now() - 86400000 * 10 },
  { id: "bm-05", url: "https://github.com/", title: "Motion.dev — spring animation cookbook", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", platform: "github", category: "motion", tags: ["motion", "react", "spring"], notes: "Layout transition patterns I want to replicate", mediaType: "link", dateAdded: Date.now() - 86400000 * 14 },
  { id: "bm-06", url: "https://instagram.com/", title: "Superflux — Speculative design objects", thumbnail: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", platform: "instagram", category: "design-inspo", tags: ["speculative", "future", "objects"], notes: "", mediaType: "image", dateAdded: Date.now() - 86400000 * 3 },
];

const BM_STORAGE_KEY = "admin_bookmarks";

// ─── Quick Add Modal ───────────────────────────────────────────────
function QuickAddModal({
  onAdd,
  onClose,
}: {
  onAdd: (bookmark: BookmarkItem) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState<BookmarkCategory>("design-inspo");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"url" | "details">("url");

  const platform = detectPlatform(url);
  const PlatformIcon = PLATFORMS[platform].icon;

  function proceedToDetails() {
    if (!url.trim()) return;
    setStep("details");
    // Auto-fill title from URL domain if empty
    if (!title) {
      try { setTitle(new URL(url).pathname.split("/").filter(Boolean).join(" → ") || new URL(url).hostname); }
      catch { /* ignore */ }
    }
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags((ts) => [...ts, t]);
    setTagInput("");
  }

  function handleAdd() {
    const bookmark: BookmarkItem = {
      id: `bm-${Date.now()}`,
      url: url.trim(),
      title: title.trim() || url,
      thumbnail: thumbnail.trim(),
      platform,
      category,
      tags,
      notes,
      mediaType: detectMediaType(url, platform),
      dateAdded: Date.now(),
    };
    onAdd(bookmark);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0f0f0f] border border-white/[0.10] w-full max-w-lg max-h-[85dvh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Bookmark size={14} className="text-[#E2B93B]/60" />
            <p className="font-['Anton'] text-sm tracking-[0.12em] text-white uppercase">
              {step === "url" ? "Add Bookmark" : "Details"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === "url" ? (
            <>
              <FormField label="Paste URL" hint="YouTube, Twitter/X, Instagram, Figma, Dribbble, GitHub, or any link">
                <div className="relative">
                  <input
                    autoFocus
                    className={adminCx.input + " pr-12"}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && proceedToDetails()}
                    placeholder="https://..."
                  />
                  {url && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <PlatformIcon size={16} style={{ color: PLATFORMS[platform].color }} />
                    </div>
                  )}
                </div>
              </FormField>

              {/* Platform detection preview */}
              {url && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06]">
                  <PlatformIcon size={13} style={{ color: PLATFORMS[platform].color }} />
                  <span className="text-[11px] font-['Instrument_Sans'] text-white/50">
                    Detected: <span style={{ color: PLATFORMS[platform].color }}>{PLATFORMS[platform].label}</span>
                  </span>
                  <span className="ml-auto text-[10px] text-white/20 font-['Instrument_Sans']">
                    {detectMediaType(url, platform)}
                  </span>
                </div>
              )}

              <button
                onClick={proceedToDetails}
                disabled={!url.trim()}
                className="w-full py-3 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[12px] tracking-[0.12em] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                CONTINUE →
              </button>
            </>
          ) : (
            <>
              {/* URL read-only recap */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.06] mb-1">
                <PlatformIcon size={12} style={{ color: PLATFORMS[platform].color }} />
                <p className="text-[10px] font-['Instrument_Sans'] text-white/30 truncate flex-1">{url}</p>
                <button onClick={() => setStep("url")} className="text-[9px] text-white/20 hover:text-white/50 font-['Instrument_Sans'] tracking-wider uppercase transition-colors shrink-0">Change</button>
              </div>

              <FormField label="Title">
                <input autoFocus className={adminCx.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's this about?" />
              </FormField>

              <FormField label="Thumbnail URL" hint="Paste an image URL or leave empty">
                <input className={adminCx.input} value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Category">
                  <select className={adminCx.select} value={category} onChange={(e) => setCategory(e.target.value as BookmarkCategory)}>
                    {(Object.keys(CATEGORIES) as BookmarkCategory[]).map((c) => (
                      <option key={c} value={c} style={{ background: "#0A0A0A" }}>{CATEGORIES[c].label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Tags">
                  <div className="flex gap-1">
                    <input className={adminCx.input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="tag, Enter" />
                    <button type="button" onClick={addTag} className="px-2.5 border border-white/[0.08] text-white/25 hover:text-white transition-colors"><Tag size={12} /></button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tags.map((t) => (
                        <span key={t} className="flex items-center gap-0.5 px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[9px] font-['Instrument_Sans'] text-white/40">
                          {t}
                          <button onClick={() => setTags((ts) => ts.filter((x) => x !== t))} className="ml-0.5 text-white/20 hover:text-red-400/60"><X size={8} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </FormField>
              </div>

              <FormField label="Notes">
                <textarea className={adminCx.textarea} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Why did you save this? Reference for…" />
              </FormField>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setStep("url")} className="px-4 py-2.5 border border-white/[0.08] text-[11px] font-['Instrument_Sans'] tracking-wider uppercase text-white/30 hover:text-white hover:border-white/20 transition-all">← Back</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[12px] tracking-[0.12em] hover:bg-white transition-colors">SAVE BOOKMARK</button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────
function EditModal({
  bookmark,
  onSave,
  onClose,
}: {
  bookmark: BookmarkItem;
  onSave: (updated: BookmarkItem) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<BookmarkItem>(bookmark);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0f0f0f] border border-white/[0.10] w-full max-w-lg max-h-[85dvh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <p className="font-['Anton'] text-sm tracking-[0.12em] text-white uppercase">Edit Bookmark</p>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors"><X size={14} /></button>
        </div>
        <div className="p-6 space-y-4">
          <FormField label="Title">
            <input autoFocus className={adminCx.input} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>
          <FormField label="URL">
            <input className={adminCx.input} value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} type="url" />
          </FormField>
          <FormField label="Thumbnail URL">
            <input className={adminCx.input} value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Platform">
              <select className={adminCx.select} value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Platform }))}>
                {(Object.keys(PLATFORMS) as Platform[]).map((p) => <option key={p} value={p} style={{ background: "#0A0A0A" }}>{PLATFORMS[p].label}</option>)}
              </select>
            </FormField>
            <FormField label="Category">
              <select className={adminCx.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as BookmarkCategory }))}>
                {(Object.keys(CATEGORIES) as BookmarkCategory[]).map((c) => <option key={c} value={c} style={{ background: "#0A0A0A" }}>{CATEGORIES[c].label}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Tags">
            <div className="flex gap-1 mb-1.5">
              {form.tags.map((t) => (
                <span key={t} className="flex items-center gap-0.5 px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] text-[9px] font-['Instrument_Sans'] text-white/40">
                  {t}<button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))} className="ml-0.5"><X size={8} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={adminCx.input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag…" />
              <button type="button" onClick={addTag} className="px-2.5 border border-white/[0.08] text-white/25 hover:text-white transition-colors"><Tag size={12} /></button>
            </div>
          </FormField>
          <FormField label="Notes">
            <textarea className={adminCx.textarea} rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </FormField>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2.5 border border-white/[0.08] text-[11px] font-['Instrument_Sans'] uppercase text-white/30 hover:text-white hover:border-white/20 transition-all">Cancel</button>
            <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2.5 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[12px] tracking-[0.12em] hover:bg-white transition-colors">SAVE</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Bookmark Card (grid) ──────────────────────────────────────────
function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onCopyUrl,
  onSendToStudio,
}: {
  bookmark: BookmarkItem;
  onEdit: () => void;
  onDelete: () => void;
  onCopyUrl: () => void;
  onSendToStudio: () => void;
}) {
  const PlatformIcon = PLATFORMS[bookmark.platform].icon;
  const catCfg = CATEGORIES[bookmark.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative border border-white/[0.07] hover:border-white/[0.15] bg-white/[0.01] transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] w-full overflow-hidden relative bg-white/[0.03]">
        {bookmark.thumbnail ? (
          <img
            src={bookmark.thumbnail}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlatformIcon size={24} style={{ color: PLATFORMS[bookmark.platform].color }} className="opacity-20" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 flex-wrap px-1">
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-[#0A0A0A] font-['Anton'] text-[10px] tracking-[0.1em] hover:bg-[#E2B93B] transition-colors">
            <ExternalLink size={11} /> OPEN
          </a>
          <button
            type="button"
            onClick={onSendToStudio}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#E2B93B]/90 text-[#0A0A0A] font-['Anton'] text-[9px] tracking-[0.1em] hover:bg-white transition-colors"
            title="Send to Presentation Studio queue"
          >
            <Clapperboard size={11} /> STUDIO
          </button>
          <button onClick={onEdit} className="p-1.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"><Edit3 size={12} /></button>
          <button onClick={onCopyUrl} className="p-1.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"><Copy size={12} /></button>
          <button onClick={onDelete} className="p-1.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"><Trash2 size={12} /></button>
        </div>

        {/* Platform badge */}
        <div className="absolute top-2 right-2">
          <div className="p-1.5 rounded-sm bg-black/60 backdrop-blur-sm">
            <PlatformIcon size={12} style={{ color: PLATFORMS[bookmark.platform].color }} />
          </div>
        </div>

        {/* Media type */}
        {bookmark.mediaType === "video" && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-[8px] font-['Instrument_Sans'] tracking-wider text-white/60 uppercase">
            VIDEO
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category + date */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[8px] tracking-[0.12em] uppercase font-['Instrument_Sans'] px-1.5 py-0.5" style={{ color: catCfg.color, background: catCfg.color + "15" }}>
            {catCfg.label}
          </span>
          <span className="text-[9px] text-white/20 font-['Instrument_Sans']">
            {new Date(bookmark.dateAdded).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        </div>

        {/* Title */}
        <p className="text-[12px] font-['Instrument_Sans'] text-white/75 leading-snug line-clamp-2 mb-2">
          {bookmark.title}
        </p>

        {/* Notes */}
        {bookmark.notes && (
          <p className="text-[10px] text-white/30 font-['Instrument_Sans'] italic leading-relaxed line-clamp-2 mb-2">
            {bookmark.notes}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[8px] font-['Instrument_Sans'] text-white/20 px-1.5 py-0.5 border border-white/[0.06]">
                {tag}
              </span>
            ))}
            {bookmark.tags.length > 3 && (
              <span className="text-[8px] font-['Instrument_Sans'] text-white/15">+{bookmark.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── List Row ──────────────────────────────────────────────────────
function BookmarkRow({
  bookmark,
  onEdit,
  onDelete,
  onSendToStudio,
}: {
  bookmark: BookmarkItem;
  onEdit: () => void;
  onDelete: () => void;
  onSendToStudio: () => void;
}) {
  const PlatformIcon = PLATFORMS[bookmark.platform].icon;
  const catCfg = CATEGORIES[bookmark.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group flex items-center gap-4 px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
    >
      {/* Thumb */}
      <div className="w-12 h-9 shrink-0 border border-white/[0.06] overflow-hidden relative bg-white/[0.03]">
        {bookmark.thumbnail ? (
          <img src={bookmark.thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlatformIcon size={14} style={{ color: PLATFORMS[bookmark.platform].color }} className="opacity-30" />
          </div>
        )}
      </div>

      {/* Platform */}
      <PlatformIcon size={14} style={{ color: PLATFORMS[bookmark.platform].color }} className="shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-['Instrument_Sans'] text-white/75 truncate">{bookmark.title}</p>
        <p className="text-[10px] text-white/25 font-['Instrument_Sans'] truncate">{bookmark.url}</p>
      </div>

      {/* Category */}
      <span className="text-[8px] tracking-[0.12em] uppercase font-['Instrument_Sans'] px-2 py-0.5 shrink-0" style={{ color: catCfg.color, background: catCfg.color + "15" }}>
        {catCfg.label}
      </span>

      {/* Date */}
      <span className="text-[10px] text-white/20 font-['Instrument_Sans'] shrink-0 hidden sm:block">
        {new Date(bookmark.dateAdded).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={onSendToStudio}
          className="p-1.5 text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors"
          title="Presentation Studio"
        >
          <Clapperboard size={12} />
        </button>
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/20 hover:text-white/60 transition-colors"><ExternalLink size={12} /></a>
        <button onClick={onEdit} className="p-1.5 text-[#E2B93B]/40 hover:text-[#E2B93B] transition-colors"><Edit3 size={12} /></button>
        <button onClick={onDelete} className="p-1.5 text-white/15 hover:text-red-400/60 transition-colors"><Trash2 size={12} /></button>
      </div>
    </motion.div>
  );
}

// ─── Bookmarks Page ────────────────────────────────────────────────
function AdminBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(BM_STORAGE_KEY) : null;
      return stored ? JSON.parse(stored) : MOCK_BOOKMARKS;
    } catch { return MOCK_BOOKMARKS; }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<BookmarkCategory | "all">("all");
  const [mediaFilter, setMediaFilter] = useState<MediaType | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [notice, setNotice] = useState<{ kind: "info" | "success" | "error"; text: string } | null>(null);
  const hasLocalEditsSinceMount = useRef(false);

  // Load from Supabase KV on mount, fall back to localStorage cache
  const loadFromKV = useCallback(async () => {
    const result = await fetchAllBookmarks();
    if (result.ok) {
      if (!hasLocalEditsSinceMount.current) {
        const loaded = result.bookmarks as BookmarkItem[];
        setBookmarks(loaded);
        try { localStorage.setItem(BM_STORAGE_KEY, JSON.stringify(loaded)); } catch {}
      }
      setNotice({
        kind: "success",
        text: hasLocalEditsSinceMount.current
          ? "Storage sync completed. Local edits are kept."
          : "Bookmarks synced from storage.",
      });
    } else if (!result.ok) {
      setNotice({ kind: "error", text: getAdminErrorMessage(result.error) });
    }
  }, []);

  useEffect(() => { loadFromKV(); }, [loadFromKV]);

  // Persist to localStorage as cache
  useEffect(() => {
    try { localStorage.setItem(BM_STORAGE_KEY, JSON.stringify(bookmarks)); }
    catch { /* ignore */ }
  }, [bookmarks]);

  async function add(bookmark: BookmarkItem) {
    hasLocalEditsSinceMount.current = true;
    setBookmarks((b) => [bookmark, ...b]);
    setNotice({ kind: "info", text: "Saving bookmark..." });
    const result = await saveBookmark(bookmark);
    if (result.ok) {
      setNotice({ kind: "success", text: "Bookmark saved." });
    } else {
      setBookmarks((b) => b.filter((bm) => bm.id !== bookmark.id));
      setNotice({ kind: "error", text: getAdminErrorMessage(result.error) });
    }
  }

  async function update(updated: BookmarkItem) {
    hasLocalEditsSinceMount.current = true;
    const previous = bookmarks;
    setBookmarks((b) => b.map((bm) => bm.id === updated.id ? updated : bm));
    setNotice({ kind: "info", text: "Updating bookmark..." });
    const result = await saveBookmark(updated);
    if (result.ok) {
      setNotice({ kind: "success", text: "Bookmark updated." });
    } else {
      setBookmarks(previous);
      setNotice({ kind: "error", text: getAdminErrorMessage(result.error) });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this bookmark?")) return;
    hasLocalEditsSinceMount.current = true;
    const previous = bookmarks;
    setBookmarks((b) => b.filter((bm) => bm.id !== id));
    setNotice({ kind: "info", text: "Deleting bookmark..." });
    const result = await deleteBookmarkAction(id);
    if (result.ok) {
      setNotice({ kind: "success", text: "Bookmark deleted." });
    } else {
      setBookmarks(previous);
      setNotice({ kind: "error", text: getAdminErrorMessage(result.error) });
    }
  }

  const sendToStudio = useCallback((bm: BookmarkItem) => {
    enqueueInspirationRefs([bookmarkToInspiration(bm)]);
  }, []);

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).catch(() => {});
  }

  // Filtered + sorted
  const filtered = bookmarks
    .filter((bm) => {
      if (platformFilter !== "all" && bm.platform !== platformFilter) return false;
      if (categoryFilter !== "all" && bm.category !== categoryFilter) return false;
      if (mediaFilter !== "all" && bm.mediaType !== mediaFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!bm.title.toLowerCase().includes(q) && !bm.notes.toLowerCase().includes(q) && !bm.tags.some((t) => t.toLowerCase().includes(q))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.dateAdded - a.dateAdded;
      if (sortBy === "oldest") return a.dateAdded - b.dateAdded;
      return a.title.localeCompare(b.title);
    });

  const editingBookmark = bookmarks.find((bm) => bm.id === editingId) ?? null;

  // Platform counts
  const platformsPresent = Array.from(new Set(bookmarks.map((b) => b.platform)));

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="text-[11px] tracking-[0.2em] text-white/20 font-['Instrument_Sans']">14</span>
              <h1 className="font-['Anton'] text-3xl tracking-[0.06em] uppercase text-white">Bookmarks</h1>
            </div>
            <p className="text-sm text-white/35 font-['Instrument_Sans'] mt-1 max-w-lg leading-relaxed">
              Personal media repository. Save, categorize, and find inspiration from across the web.
            </p>
            <Link
              href="/admin/presentation-studio"
              className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-['Instrument_Sans'] uppercase tracking-wider text-[#E2B93B]/80 hover:text-[#E2B93B] border border-[#E2B93B]/25 px-3 py-1.5 w-fit"
            >
              <Clapperboard size={12} /> Presentation Studio queue
            </Link>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[12px] tracking-[0.12em] hover:bg-white transition-colors"
          >
            <Plus size={14} /> ADD
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="space-y-3 mb-6">
        {/* Search + view + sort */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input className={adminCx.input + " pl-9"} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookmarks…" />
          </div>
          <select
            className="text-[10px] font-['Instrument_Sans'] tracking-wider bg-white/[0.03] border border-white/[0.08] text-white/35 px-3 py-2 focus:outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="newest" style={{ background: "#0A0A0A" }}>Newest first</option>
            <option value="oldest" style={{ background: "#0A0A0A" }}>Oldest first</option>
            <option value="title" style={{ background: "#0A0A0A" }}>A–Z</option>
          </select>
          <div className="flex gap-1 border border-white/[0.08]">
            <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-white/[0.08] text-white" : "text-white/25 hover:text-white/60"}`}><Grid size={14} /></button>
            <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-white/[0.08] text-white" : "text-white/25 hover:text-white/60"}`}><List size={14} /></button>
          </div>
          <span className="text-[10px] text-white/20 font-['Instrument_Sans'] ml-auto">
            {filtered.length} / {bookmarks.length}
          </span>
        </div>

        {/* Platform chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setPlatformFilter("all")}
            className={`px-3 py-1 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase border transition-all ${platformFilter === "all" ? "border-white/30 text-white bg-white/[0.06]" : "border-white/[0.08] text-white/25 hover:border-white/20"}`}
          >
            All Platforms
          </button>
          {platformsPresent.map((p) => {
            const Icon = PLATFORMS[p].icon;
            return (
              <button
                key={p}
                onClick={() => setPlatformFilter(platformFilter === p ? "all" : p)}
                className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase border transition-all ${platformFilter === p ? "border-white/30 text-white bg-white/[0.06]" : "border-white/[0.08] text-white/25 hover:border-white/20"}`}
              >
                <Icon size={11} style={{ color: platformFilter === p ? PLATFORMS[p].color : undefined }} />
                {PLATFORMS[p].label}
              </button>
            );
          })}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 text-[10px] font-['Instrument_Sans'] uppercase border transition-all ${categoryFilter === "all" ? "border-white/20 text-white bg-white/[0.04]" : "border-white/[0.06] text-white/20 hover:border-white/15"}`}
          >
            All
          </button>
          {(Object.keys(CATEGORIES) as BookmarkCategory[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(categoryFilter === c ? "all" : c)}
              className={`px-3 py-1 text-[10px] font-['Instrument_Sans'] uppercase border transition-all ${categoryFilter === c ? "text-white border-white/20" : "border-white/[0.06] hover:border-white/15"}`}
              style={categoryFilter === c ? { borderColor: CATEGORIES[c].color + "40", background: CATEGORIES[c].color + "12", color: CATEGORIES[c].color } : {}}
            >
              {CATEGORIES[c].label}
            </button>
          ))}
          {/* Media type */}
          <div className="ml-auto flex gap-1">
            {(["all", "video", "image", "link"] as const).map((t) => (
              <button key={t} onClick={() => setMediaFilter(t)}
                className={`px-2.5 py-1 text-[9px] font-['Instrument_Sans'] uppercase border transition-all ${mediaFilter === t ? "border-white/20 text-white bg-white/[0.05]" : "border-white/[0.06] text-white/20 hover:border-white/15"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {notice ? (
        <div className="mb-6">
          <AdminNotice kind={notice.kind}>{notice.text}</AdminNotice>
        </div>
      ) : null}

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.04]">
          <Bookmark size={28} className="text-white/10 mx-auto mb-3" />
          <p className="text-[11px] text-white/20 font-['Instrument_Sans'] tracking-wider">
            {search || platformFilter !== "all" || categoryFilter !== "all" ? "No bookmarks match your filters" : "No bookmarks yet. Add your first one."}
          </p>
          {bookmarks.length === 0 && (
            <button onClick={() => setShowAddModal(true)} className="mt-4 px-5 py-2 border border-white/[0.08] text-[11px] font-['Instrument_Sans'] uppercase text-white/30 hover:text-white hover:border-white/20 transition-all">
              + Add Bookmark
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((bm) => (
              <BookmarkCard
                key={bm.id}
                bookmark={bm}
                onEdit={() => setEditingId(bm.id)}
                onDelete={() => remove(bm.id)}
                onCopyUrl={() => copyUrl(bm.url)}
                onSendToStudio={() => sendToStudio(bm)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <AnimatePresence>
            {filtered.map((bm) => (
              <BookmarkRow
                key={bm.id}
                bookmark={bm}
                onEdit={() => setEditingId(bm.id)}
                onDelete={() => remove(bm.id)}
                onSendToStudio={() => sendToStudio(bm)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <QuickAddModal onAdd={add} onClose={() => setShowAddModal(false)} />
        )}
        {editingBookmark && (
          <EditModal bookmark={editingBookmark} onSave={update} onClose={() => setEditingId(null)} />
        )}
      </AnimatePresence>

      {/* FAB */}
      {!showAddModal && !editingBookmark && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#E2B93B] text-[#0A0A0A] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg z-30"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
}

export default AdminBookmarksPage;
