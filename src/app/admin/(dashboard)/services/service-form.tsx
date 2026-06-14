"use client";

import { useEffect, useState } from "react";
import { useAdminEditorShortcuts } from "@/hooks/useAdminEditorShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { MediaLibraryPicker } from "@/components/admin/media-library-picker";
import type { ServiceItem, ServiceMediaRef } from "@/lib/content/services";
import type { LibraryMediaItem } from "@/lib/content/media-library";

type Props = {
  service?: ServiceItem;
  library: LibraryMediaItem[];
  onSave: (data: Partial<ServiceItem>) => void;
  onCancel: () => void;
};

export function ServiceForm({ service, library, onSave, onCancel }: Props) {
  const [name, setName] = useState(service?.name ?? "");
  const [givesText, setGivesText] = useState((service?.gives ?? []).join("\n"));
  const [scope, setScope] = useState(service?.scope ?? "");
  const [status, setStatus] = useState(service?.status ?? "published");
  const [featured, setFeatured] = useState(Boolean(service?.featured));
  const [pinned, setPinned] = useState(Boolean(service?.pinned));
  const [media, setMedia] = useState<ServiceMediaRef[]>(service?.media ?? []);

  const gives = givesText
    .split("\n")
    .map((g) => g.trim())
    .filter(Boolean);

  const formValue = { name, gives, scope, status, featured, pinned, media };
  const baselineValue = {
    name: service?.name ?? "",
    gives: service?.gives ?? [],
    scope: service?.scope ?? "",
    status: service?.status ?? "published",
    featured: Boolean(service?.featured),
    pinned: Boolean(service?.pinned),
    media: service?.media ?? [],
  };
  const hasUnsavedChanges = JSON.stringify(formValue) !== JSON.stringify(baselineValue);
  const confirmIfUnsaved = useUnsavedChangesGuard(
    hasUnsavedChanges,
    "You have unsaved changes in this service. Leave without saving?"
  );
  const submitForm = () => onSave(formValue);
  const cancelForm = () => {
    if (confirmIfUnsaved()) onCancel();
  };
  useAdminEditorShortcuts({
    onSave: submitForm,
    onCancel: cancelForm,
    saveEnabled: Boolean(name.trim()),
  });

  useEffect(() => {
    setName(service?.name ?? "");
    setGivesText((service?.gives ?? []).join("\n"));
    setScope(service?.scope ?? "");
    setStatus(service?.status ?? "published");
    setFeatured(Boolean(service?.featured));
    setPinned(Boolean(service?.pinned));
    setMedia(service?.media ?? []);
  }, [service]);

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitForm();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border border-white/10 bg-white/[0.02] space-y-4 max-w-3xl"
    >
      <h3 className="font-mono text-sm text-white/80 uppercase tracking-wider">
        {service ? "Edit service" : "Add service"}
      </h3>
      {hasUnsavedChanges ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#E2B93B]/75">
          Unsaved changes · Cmd/Ctrl+S saves · Esc closes when not typing
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          placeholder="Product Design"
        />
      </div>

      <div>
        <label htmlFor="gives" className={labelClass}>
          What you get — one per line
        </label>
        <textarea
          id="gives"
          value={givesText}
          onChange={(e) => setGivesText(e.target.value)}
          rows={4}
          className={inputClass}
          placeholder={"Research → shipped pixels\nFlows, IA, journeys\nHigh-fidelity surface"}
        />
      </div>

      <div>
        <label htmlFor="scope" className={labelClass}>
          Scope line
        </label>
        <input
          id="scope"
          type="text"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className={inputClass}
          placeholder="End-to-end, solo or embedded in your team."
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="status" className={labelClass}>
            Lifecycle
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft" | "archived")}
            className={inputClass}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex gap-4 pb-2">
          <label className="font-mono text-xs text-white/70 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-[#E2B93B]"
            />
            Featured
          </label>
          <label className="font-mono text-xs text-white/70 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 accent-[#E2B93B]"
            />
            Pinned
          </label>
        </div>
      </div>

      <div className="rounded border border-[#E2B93B]/25 bg-[#E2B93B]/[0.05] px-3 py-2">
        <p className="font-mono text-[11px] text-[#E2B93B]/85">
          Media is pulled from existing case study & craft uploads — nothing to re-upload. Drag a tile
          onto the tray or pick from the dropdown. Order = crawl order.
        </p>
      </div>

      <MediaLibraryPicker library={library} value={media} onChange={setMedia} />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={cancelForm}
          className="px-6 py-2 border border-white/20 text-white/70 font-mono text-xs hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
