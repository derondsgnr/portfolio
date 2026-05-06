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
import { saveTestimonials } from "../../actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { TestimonialItem } from "@/lib/content/testimonials";
import { TestimonialForm } from "./testimonial-form";
import { MessageSquare, Plus, Pencil, Trash2 } from "lucide-react";
import { openOnKeyboard } from "@/lib/admin/interaction";
import { rememberAdminEditor } from "@/lib/admin/recent-editor";

type Props = { initial: TestimonialItem[] };
type SaveStatus = "idle" | "saving" | "ok" | "error";
type TestimonialStatus = NonNullable<TestimonialItem["status"]>;

function getTestimonialKey(testimonial: TestimonialItem) {
  return String(testimonial.id);
}

function SortableTestimonialRow({
  testimonial,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  testimonial: TestimonialItem;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const rowId = getTestimonialKey(testimonial);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rowId,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
          aria-label={`Select testimonial from ${testimonial.name}`}
        />
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="mt-0.5 shrink-0 cursor-grab px-2 py-1 font-mono text-xs text-white/30 transition-colors hover:text-[#E2B93B] active:cursor-grabbing"
          aria-label={`Drag testimonial from ${testimonial.name} to reorder`}
        >
          ::
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm text-white/90">&quot;{testimonial.quote}&quot;</p>
          <p className="mt-1 font-mono text-xs text-white/50">
            {testimonial.name} - {testimonial.role}, {testimonial.company}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase text-white/35">
            {testimonial.status ?? "published"}
            {testimonial.featured ? " · Featured" : ""}
            {testimonial.pinned ? " · Pinned" : ""}
            <span className="ml-2 text-white/15 opacity-0 transition-opacity group-hover:opacity-100">
              Double-click to edit
            </span>
          </p>
          <div className="mt-2 flex gap-3">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt=""
                className="h-8 w-8 rounded-full border border-white/10 object-cover"
              />
            ) : null}
            {testimonial.companyLogo ? (
              <img
                src={testimonial.companyLogo}
                alt=""
                className="h-6 w-auto object-contain opacity-80"
              />
            ) : null}
          </div>
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
          aria-label={`Edit testimonial from ${testimonial.name}`}
        >
          <Pencil size={14} />
        </button>
        <AdminConfirmAction
          title="Delete testimonial?"
          description={`Delete the testimonial from ${testimonial.name}.`}
          confirmLabel="Delete"
          destructive
          onConfirm={onDelete}
        >
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="p-2 text-white/40 transition-colors hover:text-red-400"
            aria-label={`Delete testimonial from ${testimonial.name}`}
          >
            <Trash2 size={14} />
          </button>
        </AdminConfirmAction>
      </div>
    </li>
  );
}

export function TestimonialsList({ initial }: Props) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initial);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedTestimonials = useMemo(
    () => testimonials.filter((testimonial) => selectedIds.has(getTestimonialKey(testimonial))),
    [testimonials, selectedIds]
  );
  const allSelected = testimonials.length > 0 && selectedIds.size === testimonials.length;
  const counts = useMemo(
    () => ({
      published: testimonials.filter((item) => (item.status ?? "published") === "published").length,
      draft: testimonials.filter((item) => item.status === "draft").length,
      archived: testimonials.filter((item) => item.status === "archived").length,
      featured: testimonials.filter((item) => item.featured).length,
      pinned: testimonials.filter((item) => item.pinned).length,
    }),
    [testimonials]
  );

  useEffect(() => {
    setTestimonials(initial);
    setSelectedIds(new Set());
  }, [initial]);

  useEffect(() => {
    if (pendingRevert?.section === "testimonials" && Array.isArray(pendingRevert.snapshot)) {
      setTestimonials(pendingRevert.snapshot as TestimonialItem[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  async function handleSave(updated: TestimonialItem[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveTestimonials(updated, "Update testimonials");
    if (result.ok) {
      setTestimonials(updated);
      setEditing(null);
      setAdding(false);
      pushHistory("testimonials", "Testimonials", "Updated testimonials", updated);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 6000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function handleEdit(t: TestimonialItem) {
    setAdding(false);
    setEditing(t);
    rememberAdminEditor({
      section: "testimonials",
      label: `Testimonial: ${t.name}`,
      href: "/admin/testimonials",
    });
  }

  function handleAdd() {
    setEditing(null);
    setAdding(true);
  }

  function handleDelete(t: TestimonialItem) {
    const updated = testimonials.filter((p) => p.id !== t.id);
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(getTestimonialKey(t));
      return next;
    });
    handleSave(updated);
  }

  function toggleSelection(testimonialId: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(testimonialId);
      else next.delete(testimonialId);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(
      checked ? new Set(testimonials.map((testimonial) => getTestimonialKey(testimonial))) : new Set()
    );
  }

  function handleBulkStatus(nextStatus: TestimonialStatus) {
    const updated = testimonials.map((testimonial) =>
      selectedIds.has(getTestimonialKey(testimonial)) ? { ...testimonial, status: nextStatus } : testimonial
    );
    handleSave(updated);
  }

  function handleBulkFlag(field: "featured" | "pinned", value: boolean) {
    const updated = testimonials.map((testimonial) =>
      selectedIds.has(getTestimonialKey(testimonial)) ? { ...testimonial, [field]: value } : testimonial
    );
    handleSave(updated);
  }

  function handleBulkDelete() {
    if (!selectedTestimonials.length) return;
    const updated = testimonials.filter((testimonial) => !selectedIds.has(getTestimonialKey(testimonial)));
    setSelectedIds(new Set());
    handleSave(updated);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex((testimonial) => getTestimonialKey(testimonial) === active.id);
    const newIndex = testimonials.findIndex((testimonial) => getTestimonialKey(testimonial) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    handleSave(arrayMove(testimonials, oldIndex, newIndex));
  }

  function handleFormSubmit(data: Partial<TestimonialItem>) {
    if (editing) {
      const updated = testimonials.map((p) =>
        p.id === editing.id ? { ...p, ...data } : p
      );
      handleSave(updated);
    } else if (adding) {
      const maxId = Math.max(0, ...testimonials.map((p) => (typeof p.id === "number" ? p.id : parseInt(String(p.id), 10) || 0)));
      const newT: TestimonialItem = {
        id: maxId + 1,
        quote: data.quote ?? "",
        name: data.name ?? "",
        role: data.role ?? "",
        company: data.company ?? "",
        avatar: data.avatar ?? null,
        companyLogo: data.companyLogo ?? null,
        status: data.status ?? "draft",
        featured: data.featured ?? false,
        pinned: data.pinned ?? false,
      };
      handleSave([...testimonials, newT]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border border-white/10 bg-white/[0.02] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#E2B93B]">
            <MessageSquare size={14} />
            Testimonials console
          </span>
          <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
            <span>{testimonials.length} total</span>
            <span>{counts.published} published</span>
            <span>{counts.draft} draft</span>
            <span>{counts.archived} archived</span>
            <span>{counts.featured} featured</span>
            <span>{counts.pinned} pinned</span>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase transition-colors hover:bg-white active:scale-[0.98]"
        >
          <Plus size={14} />
          Add testimonial
        </button>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/testimonials.json..."
        successMessage="Saved to content/testimonials.json."
        undoSection="testimonials"
      />

      {(editing || adding) && (
        <TestimonialForm
          testimonial={editing ?? undefined}
          onSave={handleFormSubmit}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}

      {testimonials.length > 0 ? (
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
                  onClick={() => handleBulkFlag("featured", true)}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Feature
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkFlag("featured", false)}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Unfeature
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkFlag("pinned", true)}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Pin
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkFlag("pinned", false)}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Unpin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 transition-colors hover:text-white"
                >
                  Clear
                </button>
                <AdminConfirmAction
                  title="Delete selected testimonials?"
                  description={`Delete ${selectedTestimonials.length} selected testimonial(s).`}
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
            <SortableContext
              items={testimonials.map((testimonial) => getTestimonialKey(testimonial))}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {testimonials.map((testimonial) => {
                  const key = getTestimonialKey(testimonial);
                  return (
                    <SortableTestimonialRow
                      key={key}
                      testimonial={testimonial}
                      selected={selectedIds.has(key)}
                      onSelect={(checked) => toggleSelection(key, checked)}
                      onEdit={() => handleEdit(testimonial)}
                      onDelete={() => handleDelete(testimonial)}
                    />
                  );
                })}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="border border-dashed border-[#E2B93B]/30 bg-[#E2B93B]/[0.04] p-8">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#E2B93B]">
            No testimonials yet
          </p>
          <p className="mt-3 max-w-xl font-mono text-sm text-white/55">
            Add a client quote with name, role, company, and optional imagery. Drafts stay available here until you publish them.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-5 flex items-center gap-2 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white active:scale-[0.98]"
          >
            <Plus size={14} />
            Add first testimonial
          </button>
        </div>
      )}
    </div>
  );
}
