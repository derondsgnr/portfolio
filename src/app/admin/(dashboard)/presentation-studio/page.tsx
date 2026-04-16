"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import { Clapperboard, Download, ImagePlus, Layers, Trash2 } from "lucide-react";
import { fetchAllBookmarks } from "@/app/admin/actions";
import { adminCx, FormField, PageHeader } from "@/components/admin/admin-primitives";
import { PresentationSlide } from "@/components/admin/presentation-studio/engine/presentation-slide";
import { STUDIO_FORMATS } from "@/components/admin/presentation-studio/engine/format-config";
import { CAMERA_PRESETS } from "@/components/admin/presentation-studio/engine/camera-presets";
import { GRADING_PRESETS } from "@/components/admin/presentation-studio/engine/grading-presets";
import {
  SCENE_CATEGORY_LABELS,
  SCENE_PRESETS,
  scenePresetsByCategory,
} from "@/components/admin/presentation-studio/engine/scene-presets";
import { waitForFontsAndImages } from "@/components/admin/presentation-studio/export-utils";
import {
  bookmarkToInspiration,
  enqueueInspirationRefs,
  getInspirationQueue,
  removeFromQueue,
} from "@/lib/admin/presentation-inspiration";
import type {
  CameraPresetId,
  DeckSlide,
  GradingPresetId,
  InspirationRef,
  MockupSource,
  PresentationDeck,
  SlideTemplateId,
  StudioFormat,
} from "@/types/presentation-studio";
import {
  PRESENTATION_DECK_STORAGE_KEY,
} from "@/types/presentation-studio";
import type { DeviceType } from "@/types/case-study";

function makeId(): string {
  return `ps-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function defaultSlide(): DeckSlide {
  return {
    id: makeId(),
    templateId: "cinematic-plate",
    headline: "HEADLINE",
    subline: "One line that sets context for this frame.",
    cta: "LINK IN BIO",
    screenshotUrl: "",
    environmentPlateUrl: "",
    mockupSource: "composite-scene",
    scenePresetId: "hand-phone-low",
    cameraPresetId: "hero-tilt",
    gradingPresetId: "cinematic-rich",
    device: "phone",
  };
}

/** Older saved decks may omit photoreal fields */
function migrateDeck(parsed: PresentationDeck): PresentationDeck {
  const slides = parsed.slides.map((s) => {
    const base = defaultSlide();
    const merged: DeckSlide = {
      ...base,
      ...s,
      mockupSource: s.mockupSource ?? "composite-scene",
      scenePresetId: s.scenePresetId ?? "hand-phone-low",
    };
    return merged;
  });
  return { ...parsed, slides, updatedAt: parsed.updatedAt ?? Date.now() };
}

function defaultDeck(): PresentationDeck {
  const t = Date.now();
  return {
    id: `deck-${t}`,
    title: "Untitled deck",
    narrativeBrief: "",
    slides: [defaultSlide()],
    updatedAt: t,
  };
}

const TEMPLATE_OPTIONS: { id: SlideTemplateId; label: string }[] = [
  { id: "cinematic-plate", label: "Cinematic plate" },
  { id: "spotlight-device", label: "Spotlight" },
  { id: "typography-poster", label: "Type poster" },
];

function BookmarkPicker({
  items,
  onConfirm,
}: {
  items: { id: string; title: string; thumbnail: string; url: string }[];
  onConfirm: (ids: string[]) => void;
}) {
  const [sel, setSel] = useState<Record<string, boolean>>({});
  return (
    <div className="max-h-48 overflow-y-auto border border-white/[0.06] divide-y divide-white/[0.06]">
      {items.map((b) => (
        <label key={b.id} className="flex items-center gap-2 p-2 text-xs cursor-pointer hover:bg-white/[0.03]">
          <input
            type="checkbox"
            className="shrink-0"
            checked={sel[b.id] ?? false}
            onChange={(e) => setSel((s) => ({ ...s, [b.id]: e.target.checked }))}
          />
          <img src={b.thumbnail} alt="" className="w-10 h-7 object-cover border border-white/[0.08]" />
          <span className="truncate text-white/60">{b.title}</span>
        </label>
      ))}
      <button
        type="button"
        className="w-full py-2 text-[11px] text-[#E2B93B] uppercase tracking-wider"
        onClick={() => onConfirm(Object.keys(sel).filter((id) => sel[id]))}
      >
        Add selected to queue
      </button>
    </div>
  );
}

export default function PresentationStudioPage() {
  const [deck, setDeck] = useState<PresentationDeck>(defaultDeck);
  const [slideIndex, setSlideIndex] = useState(0);
  const [queue, setQueue] = useState<InspirationRef[]>([]);
  const [formatOn, setFormatOn] = useState<Record<string, boolean>>({
    "1:1": true,
    "4:5": true,
    "9:16": true,
  });
  const [previewScale, setPreviewScale] = useState(0.42);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [bookmarkPickOpen, setBookmarkPickOpen] = useState(false);
  const [bookmarksForPick, setBookmarksForPick] = useState<
    { id: string; title: string; thumbnail: string; url: string }[]
  >([]);

  const exportRef = useRef<HTMLDivElement>(null);
  /** When set, off-screen raster matches this slide + format (export pipeline). */
  const [exportContext, setExportContext] = useState<{
    slideIndex: number;
    format: StudioFormat;
  } | null>(null);

  const refreshQueue = useCallback(() => {
    setQueue(getInspirationQueue());
  }, []);

  useEffect(() => {
    refreshQueue();
    try {
      const raw = localStorage.getItem(PRESENTATION_DECK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PresentationDeck;
        if (parsed?.slides?.length) setDeck(migrateDeck(parsed));
      }
    } catch {
      /* ignore */
    }
  }, [refreshQueue]);

  useEffect(() => {
    try {
      localStorage.setItem(PRESENTATION_DECK_STORAGE_KEY, JSON.stringify(deck));
    } catch {
      /* ignore */
    }
  }, [deck]);

  useEffect(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    setPreviewScale(w < 900 ? 0.28 : 0.38);
  }, []);

  const slide = deck.slides[slideIndex] ?? deck.slides[0];
  const activeFormats = useMemo(
    () => STUDIO_FORMATS.filter((f) => formatOn[f.id]),
    [formatOn],
  );

  const updateSlide = useCallback(
    (patch: Partial<DeckSlide>) => {
      setDeck((d) => {
        const slides = [...d.slides];
        const idx = Math.min(slideIndex, slides.length - 1);
        slides[idx] = { ...slides[idx], ...patch };
        return { ...d, slides, updatedAt: Date.now() };
      });
    },
    [slideIndex],
  );

  const loadBookmarksForPicker = async () => {
    const res = await fetchAllBookmarks();
    if (!res.ok) return;
    const list = res.bookmarks as {
      id: string;
      title: string;
      thumbnail: string;
      url: string;
    }[];
    setBookmarksForPick(list);
    setBookmarkPickOpen(true);
  };

  const addFromBookmarks = (ids: string[]) => {
    const set = new Set(ids);
    const refs = bookmarksForPick
      .filter((b) => set.has(b.id))
      .map((b) =>
        bookmarkToInspiration({
          id: b.id,
          url: b.url,
          title: b.title,
          thumbnail: b.thumbnail,
          tags: [],
          notes: "",
        }),
      );
    const n = enqueueInspirationRefs(refs);
    refreshQueue();
    setExportMsg(`Added ${n} reference(s) to queue.`);
    setTimeout(() => setExportMsg(null), 4000);
  };

  const applyPlateFromRef = (ref: InspirationRef) => {
    const url = ref.thumbnailUrl || ref.url;
    updateSlide({ environmentPlateUrl: url });
    setExportMsg("Environment plate applied to this slide.");
    setTimeout(() => setExportMsg(null), 3000);
  };

  const applySceneBaseFromRef = (ref: InspirationRef) => {
    const url = ref.thumbnailUrl || ref.url;
    updateSlide({
      mockupSource: "composite-scene",
      sceneBaseUrlOverride: url,
    });
    setExportMsg("Scene base image set — tune screen rect if the crop is off.");
    setTimeout(() => setExportMsg(null), 4000);
  };

  const runExport = async () => {
    if (!slide || activeFormats.length === 0) return;
    setExporting(true);
    setExportMsg(null);
    const zip = new JSZip();
    let count = 0;
    try {
      for (let s = 0; s < deck.slides.length; s++) {
        for (const fmt of activeFormats) {
          flushSync(() => {
            setSlideIndex(s);
            setExportContext({ slideIndex: s, format: fmt });
          });
          await new Promise((r) => requestAnimationFrame(() => r(undefined)));
          await waitForFontsAndImages(exportRef.current);
          const node = exportRef.current;
          if (!node) continue;
          const blob = await toBlob(node, {
            pixelRatio: 1,
            cacheBust: true,
            backgroundColor: "#0A0A0A",
          });
          if (!blob) continue;
          const name = `slide-${String(s + 1).padStart(2, "0")}_${fmt.id.replace(":", "x")}.png`;
          zip.file(name, blob);
          count += 1;
        }
      }
      const out = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(out);
      a.download = `presentation-studio-${deck.title.replace(/\s+/g, "-").slice(0, 40) || "export"}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      setExportMsg(`Exported ${count} PNG(s).`);
    } catch (e) {
      setExportMsg(
        e instanceof Error ? e.message : "Export failed — try images that allow CORS, or host assets on your domain.",
      );
    } finally {
      flushSync(() => setExportContext(null));
      setExporting(false);
    }
  };

  const previewFormat = activeFormats[0] ?? STUDIO_FORMATS[0];
  const rasterSlide =
    exportContext != null ? deck.slides[exportContext.slideIndex] ?? slide : slide;
  const rasterFormat = exportContext?.format ?? previewFormat;

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        index={25}
        title="Presentation Studio"
        description="Compose scenic social slides from screenshots + plates. Engine: templates, camera presets, grading, multi-format export. Pull inspiration from Bookmarks / Knowledge via the queue."
      />

      {exportMsg ? (
        <p className="text-sm font-['Instrument_Sans'] text-[#E2B93B]/90 border border-[#E2B93B]/25 px-4 py-2 bg-[#E2B93B]/5">
          {exportMsg}
        </p>
      ) : null}

      <div className="grid xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#E2B93B]/80 font-['Instrument_Sans']">
              <Layers size={14} /> Deck
            </div>
            <FormField label="Deck title">
              <input
                className={adminCx.input}
                value={deck.title}
                onChange={(e) => setDeck((d) => ({ ...d, title: e.target.value, updatedAt: Date.now() }))}
              />
            </FormField>
            <FormField label="Narrative brief (your intent for this run)">
              <textarea
                className={adminCx.textarea}
                rows={3}
                placeholder="What this carousel is for, tone, beats…"
                value={deck.narrativeBrief}
                onChange={(e) => setDeck((d) => ({ ...d, narrativeBrief: e.target.value, updatedAt: Date.now() }))}
              />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeck((d) => ({
                    ...d,
                    slides: [...d.slides, defaultSlide()],
                    updatedAt: Date.now(),
                  }));
                  setSlideIndex(deck.slides.length);
                }}
                className="px-3 py-2 border border-white/[0.12] text-[11px] font-['Instrument_Sans'] uppercase tracking-wider text-white/70 hover:border-[#E2B93B]/40"
              >
                Add slide
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deck.slides.length <= 1) return;
                  setDeck((d) => {
                    const slides = d.slides.filter((_, i) => i !== slideIndex);
                    return { ...d, slides, updatedAt: Date.now() };
                  });
                  setSlideIndex((i) => Math.max(0, i - 1));
                }}
                className="inline-flex items-center gap-1 px-3 py-2 border border-red-500/20 text-[11px] uppercase tracking-wider text-red-400/80 hover:bg-red-500/10"
              >
                <Trash2 size={12} /> Remove slide
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {deck.slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border ${
                    i === slideIndex ? "border-[#E2B93B] text-[#E2B93B]" : "border-white/[0.08] text-white/35"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {slide ? (
            <div className="border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#E2B93B]/80 font-['Instrument_Sans']">
                Slide {slideIndex + 1} — content & engine
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Template">
                  <select
                    className={adminCx.select}
                    value={slide.templateId}
                    onChange={(e) => updateSlide({ templateId: e.target.value as SlideTemplateId })}
                  >
                    {TEMPLATE_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id} style={{ background: "#0A0A0A" }}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Mockup source">
                  <select
                    className={adminCx.select}
                    value={slide.mockupSource}
                    onChange={(e) => {
                      const v = e.target.value as MockupSource;
                      updateSlide({
                        mockupSource: v,
                        scenePresetId: v === "composite-scene" ? slide.scenePresetId ?? "hand-phone-low" : slide.scenePresetId,
                      });
                    }}
                  >
                    <option value="composite-scene" style={{ background: "#0A0A0A" }}>
                      Photoreal scene (hands / desk / laptop / monitor)
                    </option>
                    <option value="css-device" style={{ background: "#0A0A0A" }}>
                      CSS frames only (quick / legacy)
                    </option>
                  </select>
                </FormField>
              </div>

              {slide.mockupSource === "composite-scene" ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FormField label="Scene preset (angle & device class)">
                      <select
                        className={adminCx.select}
                        value={slide.scenePresetId ?? "hand-phone-low"}
                        onChange={(e) => updateSlide({ scenePresetId: e.target.value })}
                      >
                        {Object.entries(scenePresetsByCategory()).map(([cat, presets]) => (
                          <optgroup key={cat} label={SCENE_CATEGORY_LABELS[cat as keyof typeof SCENE_CATEGORY_LABELS]}>
                            {presets.map((p) => (
                              <option key={p.id} value={p.id} style={{ background: "#0A0A0A" }}>
                                {p.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Grading">
                      <select
                        className={adminCx.select}
                        value={slide.gradingPresetId}
                        onChange={(e) => updateSlide({ gradingPresetId: e.target.value as GradingPresetId })}
                      >
                        {(Object.keys(GRADING_PRESETS) as GradingPresetId[]).map((k) => (
                          <option key={k} value={k} style={{ background: "#0A0A0A" }}>
                            {GRADING_PRESETS[k].label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                  <p className="text-[11px] text-white/40 font-['Instrument_Sans'] leading-relaxed">
                    {SCENE_PRESETS.find((p) => p.id === slide.scenePresetId)?.hint ??
                      "Replace preset URLs with your own mockup PNGs — keep the same rough framing, then tune screen mapping in code if needed."}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FormField label="Override scene base URL (your mockup image)">
                      <input
                        className={adminCx.input}
                        placeholder="https://… or /presentation-mockups/yours.png"
                        value={slide.sceneBaseUrlOverride ?? ""}
                        onChange={(e) => updateSlide({ sceneBaseUrlOverride: e.target.value || undefined })}
                      />
                    </FormField>
                    <FormField label="Screenshot inner transform (CSS, optional)">
                      <input
                        className={adminCx.input}
                        placeholder="e.g. scale(1.02)"
                        value={slide.sceneScreenInnerTransform ?? ""}
                        onChange={(e) => updateSlide({ sceneScreenInnerTransform: e.target.value || undefined })}
                      />
                    </FormField>
                  </div>
                </>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  <FormField label="Device (CSS frame)">
                    <select
                      className={adminCx.select}
                      value={slide.device}
                      onChange={(e) => updateSlide({ device: e.target.value as DeviceType })}
                    >
                      {(["phone", "browser", "tablet", "watch", "none"] as const).map((d) => (
                        <option key={d} value={d} style={{ background: "#0A0A0A" }}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Camera (CSS mockup)">
                    <select
                      className={adminCx.select}
                      value={slide.cameraPresetId}
                      onChange={(e) => updateSlide({ cameraPresetId: e.target.value as CameraPresetId })}
                    >
                      {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((k) => (
                        <option key={k} value={k} style={{ background: "#0A0A0A" }}>
                          {CAMERA_PRESETS[k].label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Grading">
                    <select
                      className={adminCx.select}
                      value={slide.gradingPresetId}
                      onChange={(e) => updateSlide({ gradingPresetId: e.target.value as GradingPresetId })}
                    >
                      {(Object.keys(GRADING_PRESETS) as GradingPresetId[]).map((k) => (
                        <option key={k} value={k} style={{ background: "#0A0A0A" }}>
                          {GRADING_PRESETS[k].label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Hand overlay PNG (optional)">
                    <input
                      className={adminCx.input}
                      placeholder="Transparent PNG on top of CSS frame"
                      value={slide.handOverlayUrl ?? ""}
                      onChange={(e) => updateSlide({ handOverlayUrl: e.target.value || undefined })}
                    />
                  </FormField>
                </div>
              )}

              <FormField label="Headline">
                <input className={adminCx.input} value={slide.headline} onChange={(e) => updateSlide({ headline: e.target.value })} />
              </FormField>
              <FormField label="Subline">
                <input className={adminCx.input} value={slide.subline} onChange={(e) => updateSlide({ subline: e.target.value })} />
              </FormField>
              <FormField label="CTA / label">
                <input className={adminCx.input} value={slide.cta ?? ""} onChange={(e) => updateSlide({ cta: e.target.value })} />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Screenshot URL (fills device screen in scene)">
                  <input
                    className={adminCx.input}
                    placeholder="https://…"
                    value={slide.screenshotUrl}
                    onChange={(e) => updateSlide({ screenshotUrl: e.target.value })}
                  />
                </FormField>
                <FormField
                  label={
                    slide.mockupSource === "composite-scene"
                      ? "Environment plate (optional; composite is usually the full scene)"
                      : "Environment plate URL"
                  }
                >
                  <input
                    className={adminCx.input}
                    placeholder="Cinematic still / bg"
                    value={slide.environmentPlateUrl ?? ""}
                    onChange={(e) => updateSlide({ environmentPlateUrl: e.target.value })}
                  />
                </FormField>
              </div>

              {slide.mockupSource === "composite-scene" ? (
                <div className="border border-white/[0.06] p-3 text-[11px] text-white/35 font-['Instrument_Sans'] leading-relaxed">
                  Photoreal presets map your screenshot into a calibrated screen region on the base photo. Swap in{" "}
                  <span className="text-[#E2B93B]/80">your</span> hand / desk / monitor assets by overriding the scene URL
                  or editing <code className="text-white/50">scene-presets.ts</code> (rect + intrinsic size).
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="border border-white/[0.08] p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/40 font-['Instrument_Sans']">Export formats</p>
            <div className="flex flex-wrap gap-3">
              {STUDIO_FORMATS.map((f) => (
                <label key={f.id} className="inline-flex items-center gap-2 text-sm text-white/60 font-['Instrument_Sans'] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formatOn[f.id] ?? false}
                    onChange={(e) => setFormatOn((o) => ({ ...o, [f.id]: e.target.checked }))}
                  />
                  {f.label} <span className="text-white/25 font-mono text-xs">{f.w}×{f.h}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              disabled={exporting || !slide || activeFormats.length === 0}
              onClick={runExport}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#E2B93B] text-[#0A0A0A] font-['Anton'] text-[12px] tracking-[0.12em] hover:bg-white transition-colors disabled:opacity-40"
            >
              <Download size={16} />
              {exporting ? "EXPORTING…" : "DOWNLOAD ZIP (PNG)"}
            </button>
            <p className="text-xs text-white/30 font-['Instrument_Sans'] leading-relaxed max-w-xl">
              Export rasterizes each slide × each selected format. Remote images must allow CORS or use assets on your domain.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#E2B93B]/80 font-['Instrument_Sans']">
              <ImagePlus size={14} /> Inspiration queue
            </div>
            <p className="text-xs text-white/35 font-['Instrument_Sans']">
              From Bookmarks or Knowledge — set a cinematic plate or a photoreal scene base for the current slide.
            </p>
            <button
              type="button"
              onClick={loadBookmarksForPicker}
              className="w-full py-2 border border-white/[0.1] text-[11px] uppercase tracking-wider text-white/50 hover:text-white/80"
            >
              Import from Bookmarks…
            </button>
            {bookmarkPickOpen && bookmarksForPick.length > 0 ? (
              <BookmarkPicker
                items={bookmarksForPick}
                onConfirm={(ids) => {
                  addFromBookmarks(ids);
                  setBookmarkPickOpen(false);
                }}
              />
            ) : null}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-xs text-white/25 font-['Instrument_Sans'] py-4 text-center">Queue empty</p>
              ) : (
                queue.map((r) => (
                  <div
                    key={`${r.provenance}-${r.id}`}
                    className="flex gap-2 items-start border border-white/[0.06] p-2 bg-[#0A0A0A]/80"
                  >
                    {r.thumbnailUrl ? (
                      <img src={r.thumbnailUrl} alt="" className="w-14 h-10 object-cover shrink-0 border border-white/[0.08]" />
                    ) : (
                      <div className="w-14 h-10 bg-white/[0.04] shrink-0 flex items-center justify-center text-[8px] text-white/20 font-mono">
                        URL
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-white/70 truncate">{r.title}</p>
                      <p className="text-[9px] text-white/25 font-mono uppercase">{r.provenance}</p>
                      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                        <button
                          type="button"
                          onClick={() => applyPlateFromRef(r)}
                          className="text-[10px] uppercase tracking-wider text-[#E2B93B] hover:underline"
                        >
                          Plate
                        </button>
                        <button
                          type="button"
                          onClick={() => applySceneBaseFromRef(r)}
                          className="text-[10px] uppercase tracking-wider text-white/50 hover:text-[#E2B93B] hover:underline"
                        >
                          Scene base
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeFromQueue(r.id, r.provenance);
                            refreshQueue();
                          }}
                          className="text-[10px] text-white/25 hover:text-red-400/80"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border border-dashed border-white/[0.1] p-4 text-xs text-white/30 font-['Instrument_Sans'] leading-relaxed">
            <Clapperboard className="inline mb-1 text-[#E2B93B]/50" size={14} />{" "}
            Default path: <span className="text-white/45">photoreal scene presets</span> (hands, desk, laptop, monitor) with
            screen insertion. CSS frames remain for quick tests. Add your own angles in{" "}
            <code className="text-white/40">scene-presets.ts</code> or override the scene URL per slide.
          </div>
        </div>
      </div>

      {/* Full-size slide for export (off-screen). */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none" aria-hidden data-export-root>
        <div
          ref={exportRef}
          key={`${rasterSlide?.id}-${rasterFormat.id}-${exportContext ? "e" : "p"}`}
          style={{ width: rasterFormat.w, height: rasterFormat.h }}
        >
          {rasterSlide ? <PresentationSlide slide={rasterSlide} format={rasterFormat} /> : null}
        </div>
      </div>

      {/* Preview (scaled) */}
      <div className="border border-white/[0.08] bg-[#050505] p-6 overflow-x-auto">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/35 font-['Instrument_Sans'] mb-4">
          Preview ({previewFormat.label}) — scaled for screen
        </p>
        {slide ? (
          <div
            style={{
              width: previewFormat.w * previewScale,
              height: previewFormat.h * previewScale,
              position: "relative",
            }}
          >
            <div
              style={{
                width: previewFormat.w,
                height: previewFormat.h,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
                position: "absolute",
                left: 0,
                top: 0,
              }}
            >
              <PresentationSlide slide={slide} format={previewFormat} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
