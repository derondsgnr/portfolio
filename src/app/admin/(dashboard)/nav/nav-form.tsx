"use client";

import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
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
import { saveNav } from "../../actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { formCx } from "@/design-system";
import type { NavItem } from "@/lib/content/nav";

type Props = { initial: NavItem[] };

function SortableNavItem({
  id,
  item,
  index,
  editing,
  itemCount,
  onEditStart,
  onEditCancel,
  onEditSave,
  onToggleHidden,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  id: string;
  item: NavItem;
  index: number;
  editing: boolean;
  itemCount: number;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: (data: { label?: string; path?: string; href?: string }) => void;
  onToggleHidden: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 border bg-[#121316] ${isDragging ? "opacity-50" : ""} ${
        item.hidden ? "border-[#ECFF95]/30" : "border-white/10"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-white/25 hover:text-[#ECFF95]/70"
        aria-label={`Drag ${item.label} to reorder`}
      >
        ⋮⋮
      </button>

      <div className="flex flex-col gap-1 shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="font-mono text-xs text-white/60 hover:text-white disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === itemCount - 1}
          className="font-mono text-xs text-white/60 hover:text-white disabled:opacity-30"
        >
          ↓
        </button>
      </div>

      {editing ? (
        <div className="flex-1 space-y-3">
          <div>
            <label className={formCx.label}>Label</label>
            <input
              type="text"
              defaultValue={item.label}
              id={`nav-label-${index}`}
              className={formCx.input}
              placeholder="Work"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={formCx.label}>Path (internal, e.g. /work)</label>
              <input
                type="text"
                defaultValue={item.path ?? ""}
                id={`nav-path-${index}`}
                className={formCx.input}
                placeholder="/work"
              />
            </div>
            <div>
              <label className={formCx.label}>Href (external URL)</label>
              <input
                type="text"
                defaultValue={item.href ?? ""}
                id={`nav-href-${index}`}
                className={formCx.input}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const labelInput = document.getElementById(`nav-label-${index}`) as HTMLInputElement;
                const pathInput = document.getElementById(`nav-path-${index}`) as HTMLInputElement;
                const hrefInput = document.getElementById(`nav-href-${index}`) as HTMLInputElement;
                onEditSave({
                  label: labelInput?.value?.trim() || item.label,
                  path: pathInput?.value?.trim() || undefined,
                  href: hrefInput?.value?.trim() || undefined,
                });
              }}
              className="px-3 py-1.5 bg-[#ECFF95] text-[#121316] font-mono text-xs uppercase"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onEditCancel}
              className="px-3 py-1.5 border border-white/20 text-white/60 font-mono text-xs hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <span className={`font-mono text-sm ${item.hidden ? "text-white/45" : "text-white"}`}>
            {item.label}
          </span>
          <span className="font-mono text-xs text-white/50 ml-2">
            {item.path ?? item.href ?? "—"}
          </span>
          {item.hidden && (
            <span className="ml-2 border border-[#ECFF95]/40 bg-[#ECFF95]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ECFF95]">
              Hidden
            </span>
          )}
        </div>
      )}

      {!editing && (
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleHidden}
            className={`font-mono text-xs ${
              item.hidden ? "text-[#ECFF95] hover:text-white" : "text-white/40 hover:text-[#ECFF95]"
            }`}
            title={item.hidden ? "Make this page public again" : "Hide this page from the site"}
          >
            {item.hidden ? "Show" : "Hide"}
          </button>
          <button
            type="button"
            onClick={onEditStart}
            className="font-mono text-xs text-[#ECFF95] hover:text-white"
          >
            Edit
          </button>
          <AdminConfirmAction
            title="Remove nav item?"
            description={`Remove "${item.label}" from the public navigation.`}
            confirmLabel="Remove"
            destructive
            onConfirm={onRemove}
          >
            <button
              type="button"
              className="font-mono text-xs text-white/40 hover:text-red-400"
            >
              Remove
            </button>
          </AdminConfirmAction>
        </div>
      )}
    </li>
  );
}

export function NavForm({ initial }: Props) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [items, setItems] = useState<NavItem[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (pendingRevert?.section === "nav" && Array.isArray(pendingRevert.snapshot)) {
      setItems(pendingRevert.snapshot as NavItem[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  async function handleSave(updated: NavItem[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveNav(updated, "Update nav");
    if (result.ok) {
      setItems(updated);
      setEditing(null);
      pushHistory("nav", "Navigation", "Updated nav", updated);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 6000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function moveUp(i: number) {
    if (i <= 0) return;
    const updated = [...items];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    handleSave(updated);
  }

  function moveDown(i: number) {
    if (i >= items.length - 1) return;
    const updated = [...items];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    handleSave(updated);
  }

  function handleRemove(i: number) {
    handleSave(items.filter((_, idx) => idx !== i));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item, index) => `${item.label}-${index}` === active.id);
    const newIndex = items.findIndex((item, index) => `${item.label}-${index}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    handleSave(arrayMove(items, oldIndex, newIndex));
  }

  function handleEdit(i: number, data: { label?: string; path?: string; href?: string }) {
    const updated = [...items];
    const curr = { ...updated[i] };
    if (data.label !== undefined) curr.label = data.label;
    if (data.path !== undefined) curr.path = data.path;
    if (data.href !== undefined) curr.href = data.href;
    const next: NavItem = { label: curr.label };
    if (curr.path?.trim()) {
      next.path = curr.path.trim();
    } else if (curr.href?.trim()) {
      next.href = curr.href.trim();
    } else {
      next.path = "/";
    }
    // Preserve visibility state across edits (the form doesn't expose it).
    if (curr.hidden) next.hidden = true;
    updated[i] = next;
    setEditing(null);
    handleSave(updated);
  }

  function toggleHidden(i: number) {
    const updated = items.map((item, idx) =>
      idx === i ? { ...item, hidden: !item.hidden } : item
    );
    handleSave(updated);
  }

  function handleAdd() {
    const newItem: NavItem = { label: "New", path: "/" };
    handleSave([...items, newItem]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/50">{items.length} items</span>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#ECFF95] text-[#121316] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors"
        >
          Add item
        </button>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/nav.json..."
        successMessage="Saved to content/nav.json."
        undoSection="nav"
      />

      {items.length === 0 ? (
        <div className="border border-white/[0.08] bg-white/[0.02] p-8 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-white/50">No nav items yet</p>
          <p className="mt-2 font-mono text-xs text-white/30">Add your first public route, then drag items to control the order.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((item, i) => `${item.label}-${i}`)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {items.map((item, i) => (
                <SortableNavItem
                  key={`${item.label}-${i}`}
                  id={`${item.label}-${i}`}
                  item={item}
                  index={i}
                  editing={editing === i}
                  itemCount={items.length}
                  onEditStart={() => setEditing(i)}
                  onEditCancel={() => setEditing(null)}
                  onEditSave={(data) => handleEdit(i, data)}
                  onToggleHidden={() => toggleHidden(i)}
                  onMoveUp={() => moveUp(i)}
                  onMoveDown={() => moveDown(i)}
                  onRemove={() => handleRemove(i)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
