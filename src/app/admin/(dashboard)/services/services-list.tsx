"use client";

import { useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveServices } from "../../actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { ServiceItem } from "@/lib/content/services";
import type { LibraryMediaItem } from "@/lib/content/media-library";
import { ServiceForm } from "./service-form";
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import { openOnKeyboard } from "@/lib/admin/interaction";
import { rememberAdminEditor } from "@/lib/admin/recent-editor";

type Props = { initial: ServiceItem[]; library: LibraryMediaItem[] };
type SaveStatus = "idle" | "saving" | "ok" | "error";
type ServiceStatus = NonNullable<ServiceItem["status"]>;

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `service-${Date.now()}`
  );
}

function SortableServiceRow({
  service,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  service: ServiceItem;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const mediaCount = service.media?.length ?? 0;

  return (
    <li
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onDoubleClick={onEdit}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        openOnKeyboard(event, onEdit);
      }}
      className={`group flex items-start justify-between gap-4 border p-4 cursor-pointer transition-colors focus:outline-none focus:border-[#E2B93B]/50 ${
        selected
          ? "border-[#E2B93B]/50 bg-[#E2B93B]/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-[#E2B93B]/25 hover:bg-white/[0.035]"
      } ${isDragging ? "opacity-60" : ""}`}
      title="Double-click or press Enter to edit"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelect(event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          className="mt-1 h-4 w-4 shrink-0 accent-[#E2B93B]"
          aria-label={`Select ${service.name}`}
        />
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="mt-0.5 shrink-0 cursor-grab px-2 py-1 font-mono text-xs text-white/30 transition-colors hover:text-[#E2B93B] active:cursor-grabbing"
          aria-label={`Drag ${service.name} to reorder`}
        >
          ::
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm text-white/90">{service.name}</p>
          <p className="mt-1 font-mono text-xs text-white/50">
            {service.gives.slice(0, 3).join(" · ") || "No bullets yet"}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase text-white/35">
            {service.status ?? "published"}
            {service.featured ? " · Featured" : ""}
            {service.pinned ? " · Pinned" : ""}
            {" · "}
            <span className={mediaCount ? "text-[#E2B93B]/70" : "text-white/25"}>
              {mediaCount} media
            </span>
          </p>
          {mediaCount > 0 ? (
            <div className="mt-2 flex gap-1.5">
              {service.media!.slice(0, 6).map((m) => (
                <span
                  key={m.url}
                  className="relative block h-8 w-8 overflow-hidden rounded border border-white/10 bg-black/40"
                >
                  {m.type === "video" ? (
                    <video src={m.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  )}
                </span>
              ))}
              {mediaCount > 6 ? (
                <span className="flex h-8 items-center px-1 font-mono text-[10px] text-white/35">
                  +{mediaCount - 6}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          className="p-2 text-white/40 transition-colors hover:text-[#E2B93B]"
          aria-label={`Edit ${service.name}`}
        >
          <Pencil size={14} />
        </button>
        <AdminConfirmAction
          title="Delete service?"
          description={`Delete the "${service.name}" service.`}
          confirmLabel="Delete"
          destructive
          onConfirm={onDelete}
        >
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="p-2 text-white/40 transition-colors hover:text-red-400"
            aria-label={`Delete ${service.name}`}
          >
            <Trash2 size={14} />
          </button>
        </AdminConfirmAction>
      </div>
    </li>
  );
}

export function ServicesList({ initial, library }: Props) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [services, setServices] = useState<ServiceItem[]>(initial);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.has(service.id)),
    [services, selectedIds]
  );
  const allSelected = services.length > 0 && selectedIds.size === services.length;
  const counts = useMemo(
    () => ({
      published: services.filter((item) => (item.status ?? "published") === "published").length,
      draft: services.filter((item) => item.status === "draft").length,
      archived: services.filter((item) => item.status === "archived").length,
      withMedia: services.filter((item) => (item.media?.length ?? 0) > 0).length,
    }),
    [services]
  );

  useEffect(() => {
    setServices(initial);
    setSelectedIds(new Set());
  }, [initial]);

  useEffect(() => {
    if (pendingRevert?.section === "services" && Array.isArray(pendingRevert.snapshot)) {
      setServices(pendingRevert.snapshot as ServiceItem[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  async function handleSave(updated: ServiceItem[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveServices(updated, "Update services");
    if (result.ok) {
      setServices(updated);
      setEditing(null);
      setAdding(false);
      pushHistory("services", "Services", "Updated services", updated);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 6000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function handleEdit(service: ServiceItem) {
    setAdding(false);
    setEditing(service);
    rememberAdminEditor({
      section: "services",
      label: `Service: ${service.name}`,
      href: "/admin/services",
    });
  }

  function handleAdd() {
    setEditing(null);
    setAdding(true);
  }

  function handleDelete(service: ServiceItem) {
    const updated = services.filter((s) => s.id !== service.id);
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(service.id);
      return next;
    });
    handleSave(updated);
  }

  function toggleSelection(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(services.map((s) => s.id)) : new Set());
  }

  function handleBulkStatus(nextStatus: ServiceStatus) {
    const updated = services.map((service) =>
      selectedIds.has(service.id) ? { ...service, status: nextStatus } : service
    );
    handleSave(updated);
  }

  function handleBulkDelete() {
    if (!selectedServices.length) return;
    const updated = services.filter((service) => !selectedIds.has(service.id));
    setSelectedIds(new Set());
    handleSave(updated);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    handleSave(arrayMove(services, oldIndex, newIndex));
  }

  function handleFormSubmit(data: Partial<ServiceItem>) {
    if (editing) {
      const updated = services.map((s) => (s.id === editing.id ? { ...s, ...data } : s));
      handleSave(updated);
    } else if (adding) {
      const baseId = slugify(data.name ?? "service");
      const existing = new Set(services.map((s) => s.id));
      let id = baseId;
      let n = 2;
      while (existing.has(id)) id = `${baseId}-${n++}`;
      const newService: ServiceItem = {
        id,
        name: data.name ?? "",
        gives: data.gives ?? [],
        scope: data.scope ?? "",
        media: data.media ?? [],
        status: data.status ?? "draft",
        featured: data.featured ?? false,
        pinned: data.pinned ?? false,
      };
      handleSave([...services, newService]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border border-white/10 bg-white/[0.02] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#E2B93B]">
            <Briefcase size={14} />
            Services console
          </span>
          <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
            <span>{services.length} total</span>
            <span>{counts.published} published</span>
            <span>{counts.draft} draft</span>
            <span>{counts.archived} archived</span>
            <span>{counts.withMedia} with media</span>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase transition-colors hover:bg-white active:scale-[0.98]"
        >
          <Plus size={14} />
          Add service
        </button>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/services.json..."
        successMessage="Saved to content/services.json."
        undoSection="services"
      />

      {(editing || adding) && (
        <ServiceForm
          service={editing ?? undefined}
          library={library}
          onSave={handleFormSubmit}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}

      {services.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 border border-white/10 bg-[#0d0d0d] p-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-white/60">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => toggleSelectAll(event.target.checked)}
                className="h-4 w-4 accent-[#E2B93B]"
              />
              {selectedIds.size ? `${selectedIds.size} selected` : "Select all"}
            </label>
            {selectedIds.size ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkStatus("published")}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatus("draft")}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatus("archived")}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Archive
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 transition-colors hover:text-white"
                >
                  Clear
                </button>
                <AdminConfirmAction
                  title="Delete selected services?"
                  description={`Delete ${selectedServices.length} selected service(s).`}
                  confirmLabel="Delete"
                  destructive
                  onConfirm={handleBulkDelete}
                >
                  <button
                    type="button"
                    className="border border-red-400/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-red-300/70 transition-colors hover:border-red-400/50 hover:text-red-300"
                  >
                    Delete
                  </button>
                </AdminConfirmAction>
              </div>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/30">
                Drag handles reorder and save immediately
              </span>
            )}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-3">
                {services.map((service) => (
                  <SortableServiceRow
                    key={service.id}
                    service={service}
                    selected={selectedIds.has(service.id)}
                    onSelect={(checked) => toggleSelection(service.id, checked)}
                    onEdit={() => handleEdit(service)}
                    onDelete={() => handleDelete(service)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="border border-dashed border-[#E2B93B]/30 bg-[#E2B93B]/[0.04] p-8">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#E2B93B]">No services yet</p>
          <p className="mt-3 max-w-xl font-mono text-sm text-white/55">
            Add a service with a name, &quot;what you get&quot; bullets, a scope line, and media pulled
            from your existing case studies and craft.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-5 flex items-center gap-2 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white active:scale-[0.98]"
          >
            <Plus size={14} />
            Add first service
          </button>
        </div>
      )}
    </div>
  );
}
