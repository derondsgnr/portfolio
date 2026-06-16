"use client";

/**
 * MEDIA LIBRARY PICKER
 * ====================
 * Attach media to a service by referencing assets that already live elsewhere on
 * the site (case studies, craft, media config) — no re-uploading. Two paths, per
 * the brief: drag a tile from the library onto the tray, OR pick from the dropdown.
 * The selected tray supports remove + reorder so the crawl order is editable.
 */

import { useMemo, useState } from "react";
import { X, GripVertical, Plus } from "lucide-react";
import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";
import { isLottieUrl, isPlayableVideoUrl } from "@/lib/media-url";
import type { LibraryMediaItem } from "@/lib/content/media-library";
import type { ServiceMediaRef } from "@/lib/content/defaults";

type Props = {
  library: LibraryMediaItem[];
  value: ServiceMediaRef[];
  onChange: (next: ServiceMediaRef[]) => void;
};

type TypeFilter = "all" | "image" | "video" | "lottie";

function toRef(item: LibraryMediaItem): ServiceMediaRef {
  return { url: item.url, type: item.type, label: item.label };
}

function classifyUrl(url: string): ServiceMediaRef["type"] {
  if (isLottieUrl(url)) return "lottie";
  if (isPlayableVideoUrl(url)) return "video";
  return "image";
}

/** Square thumbnail for a media url. Lottie shows a labelled placeholder. */
function Thumb({ type, url }: { type: ServiceMediaRef["type"]; url: string }) {
  if (type === "lottie") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#161616]">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#E2B93B]/80">◇ Lottie</span>
      </div>
    );
  }
  if (type === "video") {
    return <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />;
}

export function MediaLibraryPicker({ library, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dragOver, setDragOver] = useState(false);

  const selectedUrls = useMemo(() => new Set(value.map((m) => m.url)), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return library.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (!q) return true;
      return item.label.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
    });
  }, [library, query, typeFilter]);

  function addByUrl(url: string) {
    if (!url || selectedUrls.has(url)) return;
    const item = library.find((m) => m.url === url);
    if (!item) return;
    onChange([...value, toRef(item)]);
  }

  function toggle(item: LibraryMediaItem) {
    if (selectedUrls.has(item.url)) {
      onChange(value.filter((m) => m.url !== item.url));
    } else {
      onChange([...value, toRef(item)]);
    }
  }

  function remove(url: string) {
    onChange(value.filter((m) => m.url !== url));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function handleDropFromLibrary(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const url = e.dataTransfer.getData("text/plain");
    if (url) addByUrl(url);
  }

  function addUploaded(url: string) {
    const u = url.trim();
    if (!u || selectedUrls.has(u)) return;
    onChange([...value, { url: u, type: classifyUrl(u), label: "Uploaded" }]);
  }

  return (
    <div className="space-y-4">
      {/* Selected tray — drop target + reorder */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="font-mono text-xs text-white/60">
            Attached media ({value.length})
          </label>
          {value.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 transition-colors hover:text-red-300"
            >
              Clear all
            </button>
          ) : null}
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDropFromLibrary}
          className={`min-h-[92px] rounded border border-dashed p-2 transition-colors ${
            dragOver ? "border-[#E2B93B]/60 bg-[#E2B93B]/[0.06]" : "border-white/15 bg-[#111]"
          }`}
        >
          {value.length === 0 ? (
            <p className="flex h-[72px] items-center justify-center px-3 text-center font-mono text-[11px] text-white/35">
              Drag a tile here, click a tile below, or use the dropdown — the crawl plays in this order.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {value.map((m, i) => (
                <li
                  key={m.url}
                  className="group relative flex w-[104px] flex-col overflow-hidden rounded border border-white/10 bg-black/40"
                >
                  <div className="relative h-[60px] w-full bg-black/60">
                    <Thumb type={m.type} url={m.url} />
                    <span className="absolute left-1 top-1 rounded bg-black/70 px-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#E2B93B]">
                      {m.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(m.url)}
                      className="absolute right-1 top-1 rounded bg-black/70 p-0.5 text-white/70 transition-colors hover:text-red-300"
                      aria-label="Remove media"
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-1 py-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="font-mono text-[11px] text-white/40 enabled:hover:text-[#E2B93B] disabled:opacity-25"
                      aria-label="Move earlier"
                    >
                      ‹
                    </button>
                    <span className="font-mono text-[8px] text-white/30">{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === value.length - 1}
                      className="font-mono text-[11px] text-white/40 enabled:hover:text-[#E2B93B] disabled:opacity-25"
                      aria-label="Move later"
                    >
                      ›
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Dropdown add path */}
      <div className="flex items-center gap-2">
        <Plus size={13} className="shrink-0 text-white/35" />
        <select
          value=""
          onChange={(e) => {
            addByUrl(e.target.value);
            e.currentTarget.selectedIndex = 0;
          }}
          className="w-full bg-[#111] px-3 py-2 font-mono text-xs text-white/80 border border-white/10 focus:border-[#E2B93B]/50 focus:outline-none"
        >
          <option value="">Add from library…</option>
          {library
            .filter((item) => !selectedUrls.has(item.url))
            .map((item) => (
              <option key={item.url} value={item.url}>
                [{item.type}] {item.label}
              </option>
            ))}
        </select>
      </div>

      {/* Upload a new file (image / video / Lottie .json) */}
      <div className="rounded border border-white/10 bg-white/[0.02] px-3 py-2">
        <p className="font-mono text-[10px] text-white/45">
          …or upload a new image, video, or Lottie (.json) — it attaches straight to this service.
        </p>
        <CloudinaryUploadField
          accept="image/*,video/*,.json,.lottie,application/json"
          label="Upload media"
          busyNote="Uploading…"
          onUploaded={(r) => addUploaded(r.secure_url)}
        />
      </div>

      {/* Library grid — drag source + click to toggle */}
      <div className="rounded border border-white/10 bg-white/[0.02] p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search library…"
            className="flex-1 min-w-[140px] bg-[#111] px-3 py-1.5 font-mono text-xs text-white/80 border border-white/10 placeholder:text-white/30 focus:border-[#E2B93B]/50 focus:outline-none"
          />
          <div className="flex gap-1">
            {(["all", "image", "video", "lottie"] as TypeFilter[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] border transition-colors ${
                  typeFilter === t
                    ? "border-[#E2B93B]/50 bg-[#E2B93B]/10 text-[#E2B93B]"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-center font-mono text-[11px] text-white/35">
            {library.length === 0
              ? "No media found across case studies, craft, or media yet."
              : "Nothing matches this filter."}
          </p>
        ) : (
          <ul className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
            {filtered.map((item) => {
              const on = selectedUrls.has(item.url);
              return (
                <li key={item.url}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", item.url)}
                    onClick={() => toggle(item)}
                    title={item.label}
                    className={`group relative block aspect-square w-full overflow-hidden rounded border text-left transition-colors ${
                      on ? "border-[#E2B93B]" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Thumb type={item.type} url={item.url} />
                    <span className="absolute left-1 top-1 rounded bg-black/70 px-1 font-mono text-[8px] uppercase tracking-[0.1em] text-white/70">
                      {item.type}
                    </span>
                    <span className="pointer-events-none absolute right-1 top-1 text-white/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical size={11} />
                    </span>
                    {on ? (
                      <span className="absolute inset-x-0 bottom-0 bg-[#E2B93B] py-0.5 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                        Added
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
