"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { savePagesConfig } from "../../actions";
import { SECTION_OPTIONS } from "@/lib/section-registry";
import type { PageSectionConfig } from "@/lib/content/pages";

type Props = { initial: { sections: PageSectionConfig[] } };

function SortableSection({
  section,
  index,
  onVariationChange,
  onRemove,
}: {
  section: PageSectionConfig;
  index: number;
  onVariationChange: (index: number, variation: string) => void;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: index,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const options = SECTION_OPTIONS[section.id] ?? ["synthesis"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-4 p-4 border border-white/10 bg-[#111] ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 text-white/40 hover:text-white shrink-0"
          aria-label="Drag to reorder"
        >
          ⋮⋮
        </button>
        <span className="font-mono text-sm text-white shrink-0">{section.id}</span>
        <select
          value={section.variation}
          onChange={(e) => onVariationChange(index, e.target.value)}
          className="px-3 py-1.5 bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#E2B93B]/50"
        >
          {options.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="font-mono text-xs text-white/40 hover:text-red-400 shrink-0"
      >
        Remove
      </button>
    </div>
  );
}

export function LayoutBuilderForm({ initial }: Props) {
  const [sections, setSections] = useState<PageSectionConfig[]>(initial.sections);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = active.id as number;
      const newIndex = over.id as number;
      setSections((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  function handleVariationChange(index: number, variation: string) {
    setSections((items) =>
      items.map((s, i) => (i === index ? { ...s, variation } : s))
    );
  }

  function handleRemove(index: number) {
    setSections((items) => items.filter((_, i) => i !== index));
  }

  function handleAdd() {
    const allIds = Object.keys(SECTION_OPTIONS);
    const used = new Set(sections.map((s) => s.id));
    const next = allIds.find((id) => !used.has(id)) ?? "hero";
    const options = SECTION_OPTIONS[next] ?? ["synthesis"];
    setSections((items) => [...items, { id: next, variation: options[0] ?? "synthesis" }]);
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg(null);
    const data = { homepage: { sections } };
    const result = await savePagesConfig(data, "Update page layout");
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Save failed");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((_, i) => i)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <SortableSection
                key={`${section.id}-${index}`}
                section={section}
                index={index}
                onVariationChange={handleVariationChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleAdd}
          className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs hover:text-white"
        >
          Add section
        </button>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : status === "ok" ? "Saved" : "Save"}
        </button>
      </div>

      {errorMsg && <p className="font-mono text-sm text-red-400">{errorMsg}</p>}

      <div className="mt-8 p-4 border border-white/10 font-mono text-xs text-white/50">
        <p className="mb-2">Available sections:</p>
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(SECTION_OPTIONS).map(([id, vars]) => (
            <li key={id}>
              {id}: {vars.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
