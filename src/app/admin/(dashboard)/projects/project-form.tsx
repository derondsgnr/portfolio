"use client";

import { useState, useEffect } from "react";
import { ImageFieldGuide, ImageRatioHint } from "@/components/admin/image-system-guide";
import { useAdminEditorShortcuts } from "@/hooks/useAdminEditorShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
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
  status: "published",
  featured: false,
  pinned: false,
};

export function ProjectForm({ project, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<Project>>(project ?? empty);
  const baseline = project ?? empty;
  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(baseline);
  const confirmIfUnsaved = useUnsavedChangesGuard(
    hasUnsavedChanges,
    "You have unsaved changes in this project. Leave without saving?"
  );
  const submitForm = () => {
    const slug = form.slug?.trim() || (form.title ?? "").toLowerCase().replace(/\s+/g, "-");
    onSave({ ...form, slug });
  };
  const cancelForm = () => {
    if (confirmIfUnsaved()) onCancel();
  };
  useAdminEditorShortcuts({
    onSave: submitForm,
    onCancel: cancelForm,
    saveEnabled: Boolean(form.title?.trim()),
  });

  useEffect(() => {
    setForm(project ?? empty);
  }, [project]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitForm();
  }

  const inputClass = "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 p-4 border border-[#E2B93B]/30 bg-[#0d0d0d]">
      <h2 className="font-mono text-sm text-[#E2B93B]">
        {project ? "Edit project" : "New project"}
      </h2>
      {hasUnsavedChanges ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#E2B93B]/75">
          Unsaved changes · Cmd/Ctrl+S saves · Esc closes when not typing
        </p>
      ) : null}
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Lifecycle</label>
          <select
            value={form.status ?? "published"}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as Project["status"],
              }))
            }
            className={inputClass}
          >
            <option value="published">Published</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          {form.status === "coming-soon" && (
            <p className="mt-1 font-mono text-[10px] text-white/40 leading-relaxed">
              Shows in the work grid with a "Coming soon" overlay; clicking it does nothing until set to Published.
            </p>
          )}
        </div>
        <div className="flex items-end gap-4 pb-2">
          <label className="flex items-center gap-2 font-mono text-xs text-white/70">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="h-4 w-4 accent-[#E2B93B]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 font-mono text-xs text-white/70">
            <input
              type="checkbox"
              checked={Boolean(form.pinned)}
              onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
              className="h-4 w-4 accent-[#E2B93B]"
            />
            Pinned
          </label>
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
        <ImageRatioHint role="project-cover" className="mb-2" />
        <input
          type="text"
          value={form.image ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          className={inputClass}
          placeholder="https://..."
        />
        <ImageFieldGuide role="project-cover" imageUrl={form.image} compact className="mt-3" />
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
          onClick={cancelForm}
          className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
