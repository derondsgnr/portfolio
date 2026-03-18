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
import { saveBlogPost } from "@/app/admin/actions";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, PageHeader, FormField } from "@/components/admin/admin-primitives";
import { SlideEditor } from "@/components/admin/slide-editor";
import { BLOG_POSTS } from "@/lib/data/blog-data";
import type { Slide } from "@/types/case-study";
import { Plus, Eye, Tag, X, ChevronDown, ChevronRight } from "lucide-react";

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
}

interface ManagedPost {
  slug: string;
  meta: PostMeta;
  slides: Slide[];
  status: "published" | "draft";
}

const CATEGORIES = ["Thinking", "Craft", "Case Notes", "Process", "Life", "Industry"];

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
  },
  slides: (p.slides as Slide[]) ?? [],
  status: "published" as const,
}));

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
          {post.status === "draft" && <span className="ml-1.5 text-[#E2B93B]/40">DRAFT</span>}
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
}: {
  post: ManagedPost;
  onSave: (updated: ManagedPost) => void;
  onClose: () => void;
  isSaving: boolean;
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
                        {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0A0A0A" }}>{c}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Status">
                      <select className={adminCx.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ManagedPost["status"] }))}>
                        <option value="published" style={{ background: "#0A0A0A" }}>Published</option>
                        <option value="draft" style={{ background: "#0A0A0A" }}>Draft</option>
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

// ─── Blog Admin Page ───────────────────────────────────────────────
function AdminBlogPage() {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [posts, setPosts] = useState<ManagedPost[]>(INITIAL_POSTS);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (pendingRevert?.section === "blog") {
      setPosts(pendingRevert.snapshot as ManagedPost[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  const activePost = posts.find((p) => p.slug === activeSlug) ?? null;

  async function savePost(post: ManagedPost) {
    setSavingSlug(post.slug);
    const result = await saveBlogPost(post.slug, post, `Updated ${post.meta.title}`);
    if (result.ok) {
      const updated = posts.map((p) => (p.slug === post.slug ? post : p));
      // Handle new posts that aren't in the list yet
      const exists = posts.some((p) => p.slug === post.slug);
      const final = exists ? updated : [...posts, post];
      setPosts(final);
      pushHistory("blog", "Blog", `Saved: ${post.meta.title}`, final);
      setLastSaved(new Date().toLocaleTimeString());
      setActiveSlug(post.slug);
    }
    setSavingSlug(null);
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
        category: "Thinking",
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
        /* Post list view */
        <div>
          <PageHeader
            index={6}
            title="Blog"
            description="Write and manage blog posts. Click a post to open the full editor with metadata and slide-by-slide content."
            lastSaved={lastSaved}
          />
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
        </div>
      ) : (
        /* Full editor view */
        <div className="-mx-10 -my-12 h-screen flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
          {/* Back nav */}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBlogPage;
