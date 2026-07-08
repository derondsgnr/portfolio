"use client";

import { useRef, useState } from "react";
import { saveMedia, saveCraftItems, saveExplorations } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { ImageFieldGuide, ImageRatioHint } from "@/components/admin/image-system-guide";
import { useAdminEditorShortcuts } from "@/hooks/useAdminEditorShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import type { MediaConfig } from "@/lib/content/media";
import {
  CRAFT_LAYOUT_MODES,
  normalizeCraftItem,
  type CraftDocument,
  type CraftItem,
  type CraftLayoutMode,
} from "@/lib/content/craft-model";
import type { Exploration } from "@/lib/content/explorations";
import type { CloudinaryUploadResult } from "@/lib/admin/cloudinary-upload";
import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";
import { VideoUrlHint } from "@/components/admin/video-url-hint";

type Props = {
  initialMedia: MediaConfig;
  initialCraft: CraftDocument;
  initialExplorations: Exploration[];
};

const inputClass =
  "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#ECFF95]/50";
const labelClass = "block font-mono text-xs text-white/60 mb-1";

export function MediaForm({ initialMedia, initialCraft, initialExplorations }: Props) {
  const [media, setMedia] = useState(initialMedia);
  const [craft, setCraft] = useState(initialCraft);
  const [explorations, setExplorations] = useState(initialExplorations);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<"media" | "craft" | "explorations">("media");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedExplorations, setExpandedExplorations] = useState<Set<string>>(new Set());
  const [explorationToolsRaw, setExplorationToolsRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      initialExplorations.map((e) => [e.id, (e.tools ?? []).join(", ")])
    )
  );

  function toggleExploration(key: string) {
    setExpandedExplorations((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  const savedSnapshotRef = useRef({
    media: initialMedia,
    craft: initialCraft,
    explorations: initialExplorations,
  });
  const hasUnsavedChanges =
    JSON.stringify(media) !== JSON.stringify(savedSnapshotRef.current.media) ||
    JSON.stringify(craft) !== JSON.stringify(savedSnapshotRef.current.craft) ||
    JSON.stringify(explorations) !== JSON.stringify(savedSnapshotRef.current.explorations);
  useUnsavedChangesGuard(
    hasUnsavedChanges,
    "You have unsaved media changes. Leave without saving?"
  );
  useAdminEditorShortcuts({
    onSave: () => {
      void saveDirtySections();
    },
    saveEnabled: hasUnsavedChanges && savingSection === null,
  });

  async function persistMedia() {
    setFeedbackTarget("media");
    setSavingSection("media");
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveMedia(media, "Update media");
    setSavingSection(null);
    if (result.ok) {
      savedSnapshotRef.current.media = media;
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  async function persistCraft() {
    setFeedbackTarget("craft");
    setSavingSection("craft");
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveCraftItems(craft, "Update craft items");
    setSavingSection(null);
    if (result.ok) {
      savedSnapshotRef.current.craft = craft;
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  async function persistExplorations() {
    setFeedbackTarget("explorations");
    setSavingSection("explorations");
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveExplorations(explorations, "Update explorations");
    setSavingSection(null);
    if (result.ok) {
      savedSnapshotRef.current.explorations = explorations;
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  async function saveDirtySections() {
    if (JSON.stringify(media) !== JSON.stringify(savedSnapshotRef.current.media)) {
      await persistMedia();
    }
    if (JSON.stringify(craft) !== JSON.stringify(savedSnapshotRef.current.craft)) {
      await persistCraft();
    }
    if (JSON.stringify(explorations) !== JSON.stringify(savedSnapshotRef.current.explorations)) {
      await persistExplorations();
    }
  }

  async function handleSaveMedia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await persistMedia();
  }

  async function handleSaveCraft(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await persistCraft();
  }

  async function handleSaveExplorations(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await persistExplorations();
  }

  function updateCraftSectionLayout(si: number, layoutMode: CraftLayoutMode) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => (i === si ? { ...s, layoutMode } : s));
      return { sections };
    });
  }

  function updateCraftSectionTitle(si: number, title: string) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => (i === si ? { ...s, title } : s));
      return { sections };
    });
  }

  function updateCraftSectionId(si: number, id: string) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => (i === si ? { ...s, id } : s));
      return { sections };
    });
  }

  function updateCraftImage(si: number, ii: number, image: string) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== si) return s;
        const items = s.items.map((it, j) => (j === ii ? { ...it, image } : it));
        return { ...s, items };
      });
      return { sections };
    });
  }

  function updateCraftDims(si: number, ii: number, field: "width" | "height", raw: string) {
    const parsed = raw.trim() === "" ? undefined : Number(raw);
    const value = typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== si) return s;
        const items = s.items.map((it, j) => (j === ii ? { ...it, [field]: value } : it));
        return { ...s, items };
      });
      return { sections };
    });
  }

  function updateCraftMeta(si: number, ii: number, updates: Partial<Pick<CraftItem, "status" | "featured" | "pinned">>) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== si) return s;
        const items = s.items.map((it, j) => (j === ii ? { ...it, ...updates } : it));
        return { ...s, items };
      });
      return { sections };
    });
  }

  function addCraftSection() {
    setCraft((prev) => ({
      sections: [
        ...prev.sections,
        { id: `section-${Date.now()}`, title: "", layoutMode: "masonry-3" as const, items: [] },
      ],
    }));
  }

  function removeCraftSection(si: number) {
    setCraft((prev) => {
      if (prev.sections.length <= 1) return prev;
      return { sections: prev.sections.filter((_, i) => i !== si) };
    });
  }

  function addCraftItem(si: number) {
    const newId = `c-${Date.now()}`;
    const draft: CraftItem = {
      id: newId,
      title: "New piece",
      category: "Visual",
      description: "",
      image: "",
      videoUrl: undefined,
      status: "draft",
      featured: false,
      pinned: false,
    };
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== si) return s;
        return { ...s, items: [...s.items, normalizeCraftItem(draft)] };
      });
      return { sections };
    });
    // Expand the new item by POSITION (its index = previous length), never by
    // its editable id — keying on the id is what broke typing focus.
    const newIndex = craft.sections[si]?.items.length ?? 0;
    setExpandedItems((prev) => new Set([...prev, `${si}-${newIndex}`]));
  }

  function toggleCraftItem(key: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function updateCraftText(
    si: number,
    ii: number,
    field: "title" | "category" | "description",
    value: string
  ) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== si) return s;
        const items = s.items.map((it, j) => (j === ii ? { ...it, [field]: value } : it));
        return { ...s, items };
      });
      return { sections };
    });
  }

  function updateCraftItemId(si: number, ii: number, id: string) {
    setCraft((prev) => {
      const sections = prev.sections.map((s, i) => {
        if (i !== si) return s;
        const items = s.items.map((it, j) => (j === ii ? { ...it, id } : it));
        return { ...s, items };
      });
      return { sections };
    });
  }

  function removeCraftItem(si: number, ii: number) {
    setCraft((prev) => ({
      sections: prev.sections.map((s, i) =>
        i !== si ? s : { ...s, items: s.items.filter((_, j) => j !== ii) }
      ),
    }));
  }

  function patchCraftItem(si: number, ii: number, patch: Partial<CraftItem>) {
    setCraft((prev) => ({
      sections: prev.sections.map((s, i) => {
        if (i !== si) return s;
        const items = s.items.map((it, j) =>
          j === ii ? normalizeCraftItem({ ...it, ...patch } as CraftItem) : it
        );
        return { ...s, items };
      }),
    }));
  }

  function applyCraftCloudinaryResult(si: number, ii: number, r: CloudinaryUploadResult) {
    if (r.resource_type === "video") {
      patchCraftItem(si, ii, {
        videoUrl: r.secure_url,
        ...(r.thumbnail_url ? { image: r.thumbnail_url } : {}),
        ...(typeof r.width === "number" && typeof r.height === "number" ? { width: r.width, height: r.height } : {}),
      });
    } else if (r.resource_type === "raw") {
      patchCraftItem(si, ii, { lottieUrl: r.secure_url });
    } else {
      patchCraftItem(si, ii, {
        image: r.secure_url,
        videoUrl: undefined,
        lottieUrl: undefined,
        width: r.width,
        height: r.height,
      });
    }
  }

  function updateExplorationField(id: string, updates: Partial<Exploration>) {
    setExplorations((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  function updateExplorationToolsRaw(id: string, raw: string) {
    setExplorationToolsRaw((prev) => ({ ...prev, [id]: raw }));
    const tools = raw.split(",").map((t) => t.trim()).filter(Boolean);
    setExplorations((prev) => prev.map((e) => (e.id === id ? { ...e, tools } : e)));
  }

  function addExploration() {
    const newId = `ex-${String(Date.now()).slice(-5)}`;
    const newEx: Exploration = {
      id: newId,
      title: "New exploration",
      category: "Visual",
      type: "image",
      image: "",
      tools: [],
      date: new Date().getFullYear().toString(),
    };
    setExplorations((prev) => [...prev, newEx]);
    setExplorationToolsRaw((prev) => ({ ...prev, [newId]: "" }));
    setExpandedExplorations((prev) => new Set([...prev, newId]));
  }

  function removeExploration(id: string) {
    setExplorations((prev) => prev.filter((e) => e.id !== id));
    setExplorationToolsRaw((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function applyExplorationCloudinaryResult(id: string, r: CloudinaryUploadResult) {
    if (r.resource_type === "video") {
      updateExplorationField(id, {
        type: "video",
        ...(r.secure_url ? { videoUrl: r.secure_url } : {}),
        ...(r.thumbnail_url ? { image: r.thumbnail_url } : {}),
      });
    } else if (r.resource_type === "raw") {
      updateExplorationField(id, {
        type: "lottie",
        lottieUrl: r.secure_url,
        videoUrl: undefined,
      });
    } else {
      updateExplorationField(id, {
        type: "image",
        image: r.secure_url,
        videoUrl: undefined,
        lottieUrl: undefined,
      });
    }
  }

  const sectionBgKeys = Object.keys(media.sectionBackgrounds);
  const defaultSectionKeys = ["hero", "craft", "about"];
  const allSectionKeys = [...new Set([...defaultSectionKeys, ...sectionBgKeys])];

  return (
    <div className="space-y-12 max-w-3xl">
      {hasUnsavedChanges ? (
        <div className="border border-[#ECFF95]/25 bg-[#ECFF95]/[0.05] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ECFF95]/80">
            Unsaved media changes · Cmd/Ctrl+S saves changed sections
          </p>
        </div>
      ) : null}
      <section className="space-y-4 border border-white/10 bg-white/[0.02] p-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Cloudinary setup guide (save this flow)
        </h2>
        <p className="font-mono text-xs text-white/60 leading-relaxed">
          You only need to do this once. After setup, just upload, copy URL, paste here, and save.
        </p>
        <ol className="space-y-2 list-decimal pl-5 font-mono text-xs text-white/75 leading-relaxed">
          <li>Create a free Cloudinary account and open your Media Library.</li>
          <li>
            Create a folder for your portfolio (example: <span className="text-white">portfolio</span>).
          </li>
          <li>Upload your image files into that folder.</li>
          <li>Open an uploaded image and copy the Secure URL.</li>
          <li>Paste the URL into the matching field in this page (Global assets, Craft, or Explorations).</li>
          <li>Click the Save button for the section you edited.</li>
        </ol>
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            Optional quality tip
          </p>
          <p className="font-mono text-xs text-white/60 leading-relaxed">
            For faster pages, use Cloudinary optimization on <span className="text-white">image</span> URLs:
            add <span className="text-white">f_auto,q_auto</span> in the transformation part of the link.
          </p>
          <p className="font-mono text-xs text-white/40 leading-relaxed">
            Don&apos;t add <span className="text-white/70">f_auto,q_auto</span> to <span className="text-white/70">video</span> links —
            it forces a transcode that can be blocked (403) so the video won&apos;t play. Paste the plain{" "}
            <span className="text-white/70">/video/upload/…</span> URL.
          </p>
        </div>
      </section>

      {/* Section 1: Global assets */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Global assets
        </h2>
        <form onSubmit={handleSaveMedia} className="space-y-4">
          <div>
            <label htmlFor="heroBackground" className={labelClass}>
              Hero background URL
            </label>
            <ImageRatioHint role="global-background" className="mb-2" />
            <input
              id="heroBackground"
              type="url"
              value={media.heroBackground}
              onChange={(e) => setMedia((m) => ({ ...m, heroBackground: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
            <ImageFieldGuide role="global-background" imageUrl={media.heroBackground} compact className="mt-3" />
          </div>
          <div>
            <span className={labelClass}>Section backgrounds</span>
            {allSectionKeys.map((key) => (
              <div key={key} className="mb-3">
                <label htmlFor={`sectionBg-${key}`} className="font-mono text-xs text-white/40">
                  {key}
                </label>
                <ImageRatioHint role="global-background" className="mb-2 mt-1" />
                <input
                  id={`sectionBg-${key}`}
                  type="url"
                  value={media.sectionBackgrounds[key] ?? ""}
                  onChange={(e) =>
                    setMedia((m) => ({
                      ...m,
                      sectionBackgrounds: {
                        ...m.sectionBackgrounds,
                        [key]: e.target.value,
                      },
                    }))
                  }
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={savingSection === "media"}
            className="px-6 py-2 bg-[#ECFF95] text-[#121316] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "media" ? "Saving…" : "Save global assets"}
          </button>
        </form>
      </section>

      {/* Section 2: Craft document (sections + layouts) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">Craft</h2>
          <button
            type="button"
            onClick={() => addCraftSection()}
            className="px-4 py-1.5 border border-[#ECFF95]/40 font-mono text-[10px] uppercase tracking-[0.12em] text-[#ECFF95] hover:bg-[#ECFF95]/10 transition-colors"
          >
            Add section
          </button>
        </div>
        <p className="font-mono text-xs text-white/50 leading-relaxed max-w-2xl">
          Each section renders in order on the Craft page (Projects tab / Grid view). Masonry preserves real poster proportions — set Width and Height from your source file when needed. Use <strong className="text-white/65 font-normal">Upload file</strong> when Cloudinary env is configured; otherwise paste still and video links.
        </p>
        <ImageFieldGuide role="craft-gallery" compact />
        <form onSubmit={handleSaveCraft} className="space-y-8">
          {craft.sections.map((section, si) => (
            <div key={`craft-section-${si}`} className="border border-white/12 p-4 space-y-4 bg-black/20">
              <div className="flex flex-wrap gap-4 items-start justify-between">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-1">
                  <div className="min-w-0">
                    <label className={labelClass}>Section id</label>
                    <input
                      type="text"
                      value={section.id}
                      onChange={(e) => updateCraftSectionId(si, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="min-w-0 sm:col-span-2">
                    <label className={labelClass}>Heading (optional)</label>
                    <input
                      type="text"
                      value={section.title ?? ""}
                      onChange={(e) => updateCraftSectionTitle(si, e.target.value)}
                      className={inputClass}
                      placeholder="Displayed above this block"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className={labelClass}>Layout mode</label>
                    <select
                      value={section.layoutMode}
                      onChange={(e) =>
                        updateCraftSectionLayout(si, e.target.value as CraftLayoutMode)
                      }
                      className={inputClass}
                    >
                      {CRAFT_LAYOUT_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={craft.sections.length <= 1}
                  onClick={() => removeCraftSection(si)}
                  className="font-mono text-[10px] uppercase tracking-wider text-red-400/90 hover:text-red-300 disabled:opacity-25 disabled:pointer-events-none"
                >
                  Remove section
                </button>
              </div>
              <div className="border-t border-white/[0.07] pt-3 space-y-1">
                {section.items.length === 0 ? (
                  <p className="font-mono text-[11px] text-white/35 py-2">No items in this section.</p>
                ) : null}
                {section.items.map((item, ii) => {
                  // Track expansion + React key by POSITION, not the editable id.
                  const itemKey = `${si}-${ii}`;
                  const isExpanded = expandedItems.has(itemKey);
                  const itemStatus = item.status ?? "published";
                  return (
                    <div
                      key={`craft-item-${si}-${ii}`}
                      className="rounded border border-white/[0.08] bg-[#16171B] overflow-hidden"
                    >
                      {/* Collapsed row */}
                      <button
                        type="button"
                        onClick={() => toggleCraftItem(itemKey)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.025] transition-colors text-left"
                      >
                        <div className="w-9 h-9 flex-shrink-0 bg-white/[0.04] border border-white/[0.07] overflow-hidden">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-mono text-[7px] text-white/20 tracking-wider">IMG</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs text-white/80 truncate">{item.title || "Untitled"}</p>
                        </div>
                        <span className="font-mono text-[10px] text-white/30 tracking-wider shrink-0 hidden sm:block">
                          {item.category}
                        </span>
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 shrink-0 ${
                          itemStatus === "published"
                            ? "text-[#ECFF95]/70 bg-[#ECFF95]/[0.07]"
                            : itemStatus === "draft"
                            ? "text-white/30 bg-white/[0.04]"
                            : "text-red-400/60 bg-red-400/[0.07]"
                        }`}>
                          {itemStatus}
                        </span>
                        <svg
                          className={`w-3 h-3 text-white/25 flex-shrink-0 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded fields */}
                      {isExpanded && (
                        <div className="border-t border-white/[0.07] p-3 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className={labelClass}>Item id</label>
                              <input
                                type="text"
                                value={item.id}
                                onChange={(e) => updateCraftItemId(si, ii, e.target.value)}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Category</label>
                              <input
                                type="text"
                                value={item.category}
                                onChange={(e) => updateCraftText(si, ii, "category", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Poster"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={labelClass}>Title</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateCraftText(si, ii, "title", e.target.value)}
                                className={inputClass}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={labelClass}>Description</label>
                              <textarea
                                value={item.description}
                                onChange={(e) => updateCraftText(si, ii, "description", e.target.value)}
                                className={`${inputClass} min-h-[72px]`}
                                rows={3}
                              />
                            </div>
                          </div>
                          <ImageRatioHint role="craft-gallery" className="mb-2" />
                          <div>
                            <label className={labelClass}>Still / poster image URL</label>
                            <input
                              type="url"
                              value={item.image}
                              onChange={(e) => updateCraftImage(si, ii, e.target.value)}
                              className={inputClass}
                              placeholder="https://…"
                            />
                          </div>
                          <CloudinaryUploadField
                            onUploaded={(r) => applyCraftCloudinaryResult(si, ii, r)}
                          />
                          <div>
                            <label className={labelClass}>Video URL (optional)</label>
                            <input
                              type="url"
                              value={item.videoUrl ?? ""}
                              onChange={(e) =>
                                patchCraftItem(si, ii, {
                                  videoUrl: e.target.value.trim() ? e.target.value.trim() : undefined,
                                })
                              }
                              className={inputClass}
                              placeholder="YouTube / Vimeo / MP4…"
                            />
                            <VideoUrlHint url={item.videoUrl} />
                          </div>
                          <div>
                            <label className={labelClass}>Lottie JSON URL (optional)</label>
                            <input
                              type="url"
                              value={item.lottieUrl ?? ""}
                              onChange={(e) =>
                                patchCraftItem(si, ii, {
                                  lottieUrl: e.target.value.trim() ? e.target.value.trim() : undefined,
                                })
                              }
                              className={inputClass}
                              placeholder="https://res.cloudinary.com/…/raw/…"
                            />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <label className={labelClass}>Width px</label>
                              <input
                                type="number"
                                min={1}
                                value={item.width ?? ""}
                                onChange={(e) => updateCraftDims(si, ii, "width", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. 1200"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Height px</label>
                              <input
                                type="number"
                                min={1}
                                value={item.height ?? ""}
                                onChange={(e) => updateCraftDims(si, ii, "height", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. 1800"
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <select
                                value={item.status ?? "published"}
                                onChange={(e) =>
                                  updateCraftMeta(si, ii, {
                                    status: e.target.value as CraftItem["status"],
                                  })
                                }
                                className="bg-[#111] border border-white/10 text-white/70 font-mono text-[11px] px-2 py-1"
                              >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                              </select>
                              <label className="font-mono text-[11px] text-white/55 inline-flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={Boolean(item.featured)}
                                  onChange={(e) => updateCraftMeta(si, ii, { featured: e.target.checked })}
                                  className="h-3.5 w-3.5 accent-[#ECFF95]"
                                />
                                Featured
                              </label>
                              <label className="font-mono text-[11px] text-white/55 inline-flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={Boolean(item.pinned)}
                                  onChange={(e) => updateCraftMeta(si, ii, { pinned: e.target.checked })}
                                  className="h-3.5 w-3.5 accent-[#ECFF95]"
                                />
                                Pinned
                              </label>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCraftItem(si, ii)}
                              className="font-mono text-[10px] uppercase tracking-wider text-red-400/85 hover:text-red-300"
                            >
                              Remove item
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => addCraftItem(si)}
                    className="font-mono text-[10px] uppercase tracking-wider text-[#ECFF95]/90 hover:text-[#ECFF95]"
                  >
                    + Add item
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={savingSection === "craft"}
            className="px-6 py-2 bg-[#ECFF95] text-[#121316] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "craft" ? "Saving…" : "Save craft"}
          </button>
        </form>
      </section>

      {/* Section 3: Explorations */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
            Explorations
          </h2>
          <button
            type="button"
            onClick={addExploration}
            className="px-4 py-1.5 border border-[#ECFF95]/40 font-mono text-[10px] uppercase tracking-[0.12em] text-[#ECFF95] hover:bg-[#ECFF95]/10 transition-colors"
          >
            Add exploration
          </button>
        </div>
        <p className="font-mono text-xs text-white/50 leading-relaxed max-w-2xl">
          Motion and visual experiments shown in the Craft page gallery. Supports image and video types.
        </p>
        <ImageFieldGuide role="craft-gallery" compact />
        <form onSubmit={handleSaveExplorations} className="space-y-4">
          <div className="space-y-1">
            {explorations.length === 0 && (
              <p className="font-mono text-[11px] text-white/35 py-2">No explorations yet — add one above.</p>
            )}
            {explorations.map((item, exIdx) => {
              const isExpanded = expandedExplorations.has(item.id);
              const toolsRaw = explorationToolsRaw[item.id] ?? (item.tools ?? []).join(", ");
              return (
                <div
                  key={`exploration-${exIdx}`}
                  className="rounded border border-white/[0.08] bg-[#16171B] overflow-hidden"
                >
                  {/* Collapsed row */}
                  <button
                    type="button"
                    onClick={() => toggleExploration(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.025] transition-colors text-left"
                  >
                    <div className="w-9 h-9 flex-shrink-0 bg-white/[0.04] border border-white/[0.07] overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-mono text-[7px] text-white/20 tracking-wider">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-white/80 truncate">{item.title || "Untitled"}</p>
                    </div>
                    <span className="font-mono text-[10px] text-white/30 tracking-wider shrink-0 hidden sm:block">
                      {item.category}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 shrink-0 text-white/30 bg-white/[0.04]">
                      {item.type}
                    </span>
                    {(() => {
                      const s = item.status ?? "published";
                      return (
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 shrink-0 ${
                          s === "published" ? "text-[#ECFF95]/70 bg-[#ECFF95]/[0.07]"
                          : s === "draft" ? "text-white/30 bg-white/[0.04]"
                          : "text-red-400/60 bg-red-400/[0.07]"
                        }`}>{s}</span>
                      );
                    })()}
                    <svg
                      className={`w-3 h-3 text-white/25 flex-shrink-0 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded fields */}
                  {isExpanded && (
                    <div className="border-t border-white/[0.07] p-3 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Item id</label>
                          <input
                            type="text"
                            value={item.id}
                            onChange={(e) => {
                              const newId = e.target.value;
                              setExplorations((prev) => prev.map((ex) => ex.id === item.id ? { ...ex, id: newId } : ex));
                              setExplorationToolsRaw((prev) => {
                                const raw = prev[item.id] ?? "";
                                const next = { ...prev };
                                delete next[item.id];
                                return { ...next, [newId]: raw };
                              });
                              setExpandedExplorations((prev) => {
                                const next = new Set(prev);
                                next.delete(item.id);
                                next.add(newId);
                                return next;
                              });
                            }}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Status</label>
                          <select
                            value={item.status ?? "published"}
                            onChange={(e) =>
                              updateExplorationField(item.id, { status: e.target.value as Exploration["status"] })
                            }
                            className={inputClass}
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateExplorationField(item.id, { title: e.target.value })}
                            className={inputClass}
                            placeholder="Void Gradient 001"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Category / Tag</label>
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => updateExplorationField(item.id, { category: e.target.value })}
                            className={inputClass}
                            placeholder="Graphics, Motion, Brand…"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Type</label>
                          <select
                            value={item.type}
                            onChange={(e) =>
                              updateExplorationField(item.id, { type: e.target.value as "image" | "video" | "lottie" })
                            }
                            className={inputClass}
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="lottie">Lottie</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Year</label>
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => updateExplorationField(item.id, { date: e.target.value })}
                            className={inputClass}
                            placeholder="2025"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelClass}>Description</label>
                          <textarea
                            value={item.description ?? ""}
                            onChange={(e) => updateExplorationField(item.id, { description: e.target.value })}
                            className={`${inputClass} min-h-[72px]`}
                            rows={3}
                            placeholder="Short note about this piece (shown in lightbox)"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label className={labelClass}>Width px</label>
                          <input
                            type="number"
                            min={1}
                            value={item.width ?? ""}
                            onChange={(e) => {
                              const v = e.target.value.trim();
                              const n = v === "" ? undefined : Math.round(Number(v));
                              updateExplorationField(item.id, { width: Number.isFinite(n) && n! > 0 ? n : undefined });
                            }}
                            className={inputClass}
                            placeholder="e.g. 1080"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Height px</label>
                          <input
                            type="number"
                            min={1}
                            value={item.height ?? ""}
                            onChange={(e) => {
                              const v = e.target.value.trim();
                              const n = v === "" ? undefined : Math.round(Number(v));
                              updateExplorationField(item.id, { height: Number.isFinite(n) && n! > 0 ? n : undefined });
                            }}
                            className={inputClass}
                            placeholder="e.g. 1350"
                          />
                        </div>
                      </div>
                      <ImageRatioHint role="craft-gallery" className="mb-2" />
                      <div>
                        <label className={labelClass}>Image URL</label>
                        <input
                          type="url"
                          value={item.image}
                          onChange={(e) => updateExplorationField(item.id, { image: e.target.value })}
                          className={inputClass}
                          placeholder="https://res.cloudinary.com/…"
                        />
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt="Preview"
                            className="mt-2 max-h-28 object-contain border border-white/10"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        )}
                      </div>
                      <CloudinaryUploadField
                        onUploaded={(r) => applyExplorationCloudinaryResult(item.id, r)}
                      />
                      {item.type === "video" && (
                        <div>
                          <label className={labelClass}>Video URL</label>
                          <input
                            type="url"
                            value={item.videoUrl ?? ""}
                            onChange={(e) =>
                              updateExplorationField(item.id, {
                                videoUrl: e.target.value.trim() ? e.target.value.trim() : undefined,
                              })
                            }
                            className={inputClass}
                            placeholder="YouTube, Vimeo, or Cloudinary /video/upload/… .mp4"
                          />
                          <VideoUrlHint url={item.videoUrl} />
                        </div>
                      )}
                      {item.type === "lottie" && (
                        <div>
                          <label className={labelClass}>Lottie JSON URL</label>
                          <input
                            type="url"
                            value={item.lottieUrl ?? ""}
                            onChange={(e) =>
                              updateExplorationField(item.id, {
                                lottieUrl: e.target.value.trim() ? e.target.value.trim() : undefined,
                              })
                            }
                            className={inputClass}
                            placeholder="https://res.cloudinary.com/…/raw/…"
                          />
                        </div>
                      )}
                      <div>
                        <label className={labelClass}>Tools (comma-separated)</label>
                        <input
                          type="text"
                          value={toolsRaw}
                          onChange={(e) => updateExplorationToolsRaw(item.id, e.target.value)}
                          className={inputClass}
                          placeholder="Figma, After Effects, Cinema 4D"
                        />
                        {toolsRaw && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {toolsRaw
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                              .map((t) => (
                                <span
                                  key={t}
                                  className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#ECFF95]/80 border border-[#ECFF95]/20 px-2 py-0.5"
                                >
                                  {t}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => removeExploration(item.id)}
                          className="font-mono text-[10px] uppercase tracking-wider text-red-400/85 hover:text-red-300"
                        >
                          Remove exploration
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="submit"
            disabled={savingSection === "explorations"}
            className="px-6 py-2 bg-[#ECFF95] text-[#121316] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "explorations" ? "Saving…" : "Save explorations"}
          </button>
        </form>
      </section>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage={
          feedbackTarget === "craft"
            ? "Saving changes to content/craft.json..."
            : feedbackTarget === "explorations"
              ? "Saving changes to content/explorations.json..."
              : "Saving changes to content/media.json..."
        }
        successMessage={
          feedbackTarget === "craft"
            ? "Saved to content/craft.json."
            : feedbackTarget === "explorations"
              ? "Saved to content/explorations.json."
              : "Saved to content/media.json."
        }
      />
    </div>
  );
}
