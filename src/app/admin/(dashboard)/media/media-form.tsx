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

type Props = {
  initialMedia: MediaConfig;
  initialCraft: CraftDocument;
  initialExplorations: Exploration[];
};

const inputClass =
  "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
const labelClass = "block font-mono text-xs text-white/60 mb-1";

export function MediaForm({ initialMedia, initialCraft, initialExplorations }: Props) {
  const [media, setMedia] = useState(initialMedia);
  const [craft, setCraft] = useState(initialCraft);
  const [explorations, setExplorations] = useState(initialExplorations);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<"media" | "craft" | "explorations">("media");
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
    const draft: CraftItem = {
      id: `c-${Date.now()}`,
      title: "New piece",
      category: "Visual",
      description: "",
      image: "",
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

  function updateExplorationImage(index: number, image: string) {
    setExplorations((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], image };
      return next;
    });
  }

  function updateExplorationVideoUrl(index: number, videoUrl: string) {
    setExplorations((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], videoUrl };
      return next;
    });
  }

  const sectionBgKeys = Object.keys(media.sectionBackgrounds);
  const defaultSectionKeys = ["hero", "craft", "about"];
  const allSectionKeys = [...new Set([...defaultSectionKeys, ...sectionBgKeys])];

  return (
    <div className="space-y-12 max-w-3xl">
      {hasUnsavedChanges ? (
        <div className="border border-[#E2B93B]/25 bg-[#E2B93B]/[0.05] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#E2B93B]/80">
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
            For faster pages, use Cloudinary optimization in your URL: add{" "}
            <span className="text-white">f_auto,q_auto</span> in the transformation part of the link.
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
            className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
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
            className="px-4 py-1.5 border border-[#E2B93B]/40 font-mono text-[10px] uppercase tracking-[0.12em] text-[#E2B93B] hover:bg-[#E2B93B]/10 transition-colors"
          >
            Add section
          </button>
        </div>
        <p className="font-mono text-xs text-white/50 leading-relaxed max-w-2xl">
          Each section renders in order on the Craft page (Projects tab / Grid view). Masonry preserves real poster proportions — set Width and Height from your source file so layout stays stable before images load.
        </p>
        <ImageFieldGuide role="craft-gallery" compact />
        <form onSubmit={handleSaveCraft} className="space-y-8">
          {craft.sections.map((section, si) => (
            <div key={`${section.id}-${si}`} className="border border-white/12 p-4 space-y-4 bg-black/20">
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
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={() => addCraftItem(si)}
                  className="font-mono text-[10px] uppercase tracking-wider text-[#E2B93B]/90 hover:text-[#E2B93B]"
                >
                  + Add item
                </button>
              </div>
              <div className="border-t border-white/[0.07] pt-4 space-y-4">
                {section.items.map((item, ii) => (
                  <div
                    key={`${si}-${item.id}-${ii}`}
                    className="rounded border border-white/[0.08] p-3 bg-[#0f0f0f]"
                  >
                    <div className="grid gap-3 sm:grid-cols-2 mb-3">
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
                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) => updateCraftImage(si, ii, e.target.value)}
                      className={inputClass}
                      placeholder="Image URL"
                    />
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
                            className="h-3.5 w-3.5 accent-[#E2B93B]"
                          />
                          Featured
                        </label>
                        <label className="font-mono text-[11px] text-white/55 inline-flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={Boolean(item.pinned)}
                            onChange={(e) => updateCraftMeta(si, ii, { pinned: e.target.checked })}
                            className="h-3.5 w-3.5 accent-[#E2B93B]"
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
                ))}
              </div>
              {section.items.length === 0 ? (
                <p className="font-mono text-[11px] text-white/35">No items in this section.</p>
              ) : null}
            </div>
          ))}
          <button
            type="submit"
            disabled={savingSection === "craft"}
            className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "craft" ? "Saving…" : "Save craft"}
          </button>
        </form>
      </section>

      {/* Section 3: Explorations */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Explorations
        </h2>
        <ImageFieldGuide role="craft-gallery" compact />
        <form onSubmit={handleSaveExplorations} className="space-y-4">
          <div className="space-y-3">
            {explorations.map((item, i) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-white/10 rounded"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-white/50 block truncate">
                    [{item.id}] {item.title}
                  </span>
                  <ImageRatioHint role="craft-gallery" className="mt-2" />
                  <input
                    type="url"
                    value={item.image}
                    onChange={(e) => updateExplorationImage(i, e.target.value)}
                    className={`${inputClass} mt-1`}
                    placeholder="Image URL"
                  />
                  {item.type === "video" && (
                    <input
                      type="url"
                      value={item.videoUrl ?? ""}
                      onChange={(e) => updateExplorationVideoUrl(i, e.target.value)}
                      className={`${inputClass} mt-2`}
                      placeholder="YouTube URL (optional)"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={savingSection === "explorations"}
            className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
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
