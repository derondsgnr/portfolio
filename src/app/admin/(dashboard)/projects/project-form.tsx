"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/lib/content/projects";

type Props = {
  project?: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
};

const empty: Partial<Project> = {
  title: "",
  category: "",
  year: "",
  description: "",
  image: "",
  slug: "",
};

export function ProjectForm({ project, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<Project>>(project ?? empty);

  useEffect(() => {
    setForm(project ?? empty);
  }, [project]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug?.trim() || (form.title ?? "").toLowerCase().replace(/\s+/g, "-");
    onSave({ ...form, slug });
  }

  const inputClass = "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 p-4 border border-[#E2B93B]/30 bg-[#0d0d0d]">
      <h2 className="font-mono text-sm text-[#E2B93B]">
        {project ? "Edit project" : "New project"}
      </h2>
      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          value={form.title ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inputClass}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <input
            type="text"
            value={form.category ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={inputClass}
            placeholder="e.g. Fintech"
          />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            type="text"
            value={form.year ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            className={inputClass}
            placeholder="e.g. 2025"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={inputClass}
          rows={3}
        />
      </div>
      <div>
        <label className={labelClass}>Image URL</label>
        <input
          type="text"
          value={form.image ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          className={inputClass}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className={labelClass}>Slug (URL path)</label>
        <input
          type="text"
          value={form.slug ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className={inputClass}
          placeholder="dara"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
