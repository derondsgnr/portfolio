"use client";

import { useState, useEffect } from "react";
import type { Exploration } from "@/lib/content/explorations";

type Props = {
  exploration?: Exploration;
  onSave: (data: Exploration) => void;
  onCancel: () => void;
};

const empty: Exploration = {
  id: "",
  title: "",
  category: "",
  type: "image",
  image: "",
  videoUrl: "",
  tools: [],
  date: new Date().getFullYear().toString(),
};

export function ExplorationForm({ exploration, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Exploration & { toolsRaw: string }>(
    exploration
      ? { ...exploration, toolsRaw: exploration.tools.join(", ") }
      : { ...empty, toolsRaw: "" }
  );

  useEffect(() => {
    setForm(
      exploration
        ? { ...exploration, toolsRaw: exploration.tools.join(", ") }
        : { ...empty, toolsRaw: "" }
    );
  }, [exploration]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tools = form.toolsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { toolsRaw: _, ...rest } = form;
    onSave({ ...rest, tools });
  }

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-4 p-4 border border-[#E2B93B]/30 bg-[#0d0d0d]"
    >
      <h2 className="font-mono text-sm text-[#E2B93B]">
        {exploration ? "Edit exploration" : "New exploration"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={inputClass}
            required
            placeholder="Void Gradient 001"
          />
        </div>
        <div>
          <label className={labelClass}>Category / Tag *</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={inputClass}
            required
            placeholder="Graphics, Motion, Brand…"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Type</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value as "image" | "video" }))
            }
            className={inputClass}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={inputClass}
            placeholder="2025"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Image URL *</label>
        <input
          type="url"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          className={inputClass}
          required
          placeholder="https://res.cloudinary.com/…"
        />
        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.image}
            alt="Preview"
            className="mt-2 max-h-32 object-contain border border-white/10"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      {form.type === "video" && (
        <div>
          <label className={labelClass}>Video URL</label>
          <input
            type="url"
            value={form.videoUrl ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
            className={inputClass}
            placeholder="https://res.cloudinary.com/…/video/…"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Tools (comma-separated)</label>
        <input
          type="text"
          value={form.toolsRaw}
          onChange={(e) => setForm((f) => ({ ...f, toolsRaw: e.target.value }))}
          className={inputClass}
          placeholder="Figma, After Effects, Cinema 4D"
        />
        {form.toolsRaw && (
          <div className="mt-1 flex flex-wrap gap-1">
            {form.toolsRaw
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#E2B93B]/80 border border-[#E2B93B]/20 px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={!form.title.trim() || !form.image.trim()}
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {exploration ? "Save changes" : "Add exploration"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs uppercase tracking-wider transition-colors hover:text-white hover:border-white/40"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
