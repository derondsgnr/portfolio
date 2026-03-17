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
import { getSectionSchema } from "@/lib/section-schemas";
import type { PageSectionConfig } from "@/lib/content/pages";
import type { PagesConfig } from "@/lib/content/pages";

type PageKey = "homepage" | "work" | "about";

const PAGE_LABELS: Record<PageKey, string> = {
  homepage: "Homepage",
  work: "Work",
  about: "About",
};

type Props = { initial: Pick<PagesConfig, "homepage" | "work" | "about"> };

function OverrideForm({
  section,
  onOverridesChange,
}: {
  section: PageSectionConfig;
  onOverridesChange: (overrides: Record<string, unknown>) => void;
}) {
  const schema = getSectionSchema(section.id, section.variation);
  const overrides = section.overrides ?? {};

  if (!schema?.length) return null;

  const handleChange = (key: string, value: unknown) => {
    onOverridesChange({ ...overrides, [key]: value });
  };

  return (
    <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
      {schema.map((field) => {
        if (field.type === "string") {
          return (
            <div key={field.key}>
              <label className="block font-mono text-[10px] text-white/50 mb-1">{field.label ?? field.key}</label>
              <input
                type="text"
                value={(overrides[field.key] as string) ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={String(field.default ?? "")}
                className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#E2B93B]/50"
              />
            </div>
          );
        }
        if (field.type === "textarea") {
          return (
            <div key={field.key}>
              <label className="block font-mono text-[10px] text-white/50 mb-1">{field.label ?? field.key}</label>
              <textarea
                value={(overrides[field.key] as string) ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={String(field.default ?? "")}
                rows={2}
                className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#E2B93B]/50 resize-y"
              />
            </div>
          );
        }
        if (field.type === "string[]") {
          const arr = (overrides[field.key] as string[]) ?? [];
          const str = arr.join("\n");
          return (
            <div key={field.key}>
              <label className="block font-mono text-[10px] text-white/50 mb-1">{field.label ?? field.key} (one per line)</label>
              <textarea
                value={str}
                onChange={(e) => handleChange(field.key, e.target.value.split("\n").filter(Boolean))}
                rows={3}
                className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#E2B93B]/50 resize-y"
              />
            </div>
          );
        }
        if (field.type === "stats") {
          const stats = (overrides[field.key] as { label: string; value: string }[]) ?? [];
          const str = stats.map((s) => `${s.label}:${s.value}`).join("\n");
          return (
            <div key={field.key}>
              <label className="block font-mono text-[10px] text-white/50 mb-1">{field.label ?? field.key} (label:value per line)</label>
              <textarea
                value={str}
                onChange={(e) => {
                  const parsed = e.target.value
                    .split("\n")
                    .filter(Boolean)
                    .map((line) => {
                      const [label, ...v] = line.split(":");
                      return { label: label?.trim() ?? "", value: v.join(":").trim() };
                    });
                  handleChange(field.key, parsed);
                }}
                rows={3}
                placeholder={"YEARS:5+\nPROJECTS:40+\nCLIENTS:25+"}
                className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#E2B93B]/50 resize-y"
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function SortableSection({
  section,
  index,
  onVariationChange,
  onOverridesChange,
  onRemove,
}: {
  section: PageSectionConfig;
  index: number;
  onVariationChange: (index: number, variation: string) => void;
  onOverridesChange: (index: number, overrides: Record<string, unknown>) => void;
  onRemove: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: index,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const options = SECTION_OPTIONS[section.id] ?? ["synthesis"];
  const hasSchema = !!getSectionSchema(section.id, section.variation)?.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col border border-white/10 bg-[#111] ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between gap-4 p-4">
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
          {hasSchema && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="font-mono text-xs text-white/40 hover:text-[#E2B93B] shrink-0"
            >
              {expanded ? "Hide edits" : "Edit"}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(index)}
          className="font-mono text-xs text-white/40 hover:text-red-400 shrink-0"
        >
          Remove
        </button>
      </div>
      {expanded && hasSchema && (
        <div className="px-4 pb-4">
          <OverrideForm
            section={section}
            onOverridesChange={(o) => onOverridesChange(index, o)}
          />
        </div>
      )}
    </div>
  );
}

function SectionPicker({
  onAdd,
  onCancel,
}: {
  onAdd: (id: string, variation: string) => void;
  onCancel: () => void;
}) {
  const [id, setId] = useState<string>("hero");
  const options = SECTION_OPTIONS[id] ?? ["synthesis"];
  const [variation, setVariation] = useState(options[0] ?? "synthesis");

  return (
    <div className="p-4 border border-white/20 bg-[#0A0A0A] space-y-4">
      <p className="font-mono text-sm text-white">Add section</p>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block font-mono text-[10px] text-white/50 mb-1">Section type</label>
          <select
            value={id}
            onChange={(e) => {
              const next = e.target.value;
              setId(next);
              const opts = SECTION_OPTIONS[next] ?? ["synthesis"];
              setVariation(opts[0] ?? "synthesis");
            }}
            className="px-3 py-1.5 bg-[#111] border border-white/10 text-white font-mono text-xs focus:outline-none"
          >
            {Object.keys(SECTION_OPTIONS).map((sid) => (
              <option key={sid} value={sid}>
                {sid}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-white/50 mb-1">Variation</label>
          <select
            value={variation}
            onChange={(e) => setVariation(e.target.value)}
            className="px-3 py-1.5 bg-[#111] border border-white/10 text-white font-mono text-xs focus:outline-none"
          >
            {options.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onAdd(id, variation)}
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-white/20 text-white/60 font-mono text-xs hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function LayoutBuilderForm({ initial }: Props) {
  const [activeTab, setActiveTab] = useState<PageKey>("homepage");
  const [config, setConfig] = useState(() => ({
    homepage: { sections: initial.homepage?.sections ?? [] } as { sections: PageSectionConfig[] },
    work: { sections: initial.work?.sections ?? [] } as { sections: PageSectionConfig[] },
    about: { sections: initial.about?.sections ?? [] } as { sections: PageSectionConfig[] },
  }));
  const [showPicker, setShowPicker] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sections = config[activeTab].sections;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = active.id as number;
      const newIndex = over.id as number;
      setConfig((c) => ({
        ...c,
        [activeTab]: {
          sections: arrayMove(c[activeTab].sections, oldIndex, newIndex),
        },
      }));
    }
  }

  function handleVariationChange(index: number, variation: string) {
    setConfig((c) => ({
      ...c,
      [activeTab]: {
        sections: c[activeTab].sections.map((s, i) =>
          i === index ? { ...s, variation } : s
        ),
      },
    }));
  }

  function handleOverridesChange(index: number, overrides: Record<string, unknown>) {
    setConfig((c) => ({
      ...c,
      [activeTab]: {
        sections: c[activeTab].sections.map((s, i) =>
          i === index ? { ...s, overrides } : s
        ),
      },
    }));
  }

  function handleRemove(index: number) {
    setConfig((c) => ({
      ...c,
      [activeTab]: {
        sections: c[activeTab].sections.filter((_, i) => i !== index),
      },
    }));
  }

  function handleAdd(id: string, variation: string) {
    setConfig((c) => ({
      ...c,
      [activeTab]: {
        sections: [...c[activeTab].sections, { id, variation }],
      },
    }));
    setShowPicker(false);
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg(null);
    const data = {
      homepage: config.homepage,
      work: config.work,
      about: config.about,
    };
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
      <div className="flex gap-2 border-b border-white/10">
        {(Object.keys(PAGE_LABELS) as PageKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 font-mono text-sm ${
              activeTab === key
                ? "text-[#E2B93B] border-b-2 border-[#E2B93B] -mb-px"
                : "text-white/50 hover:text-white"
            }`}
          >
            {PAGE_LABELS[key]}
          </button>
        ))}
      </div>

      {showPicker ? (
        <SectionPicker onAdd={handleAdd} onCancel={() => setShowPicker(false)} />
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((_, i) => i)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <SortableSection
                key={`${section.id}-${section.variation}-${index}`}
                section={section}
                index={index}
                onVariationChange={handleVariationChange}
                onOverridesChange={handleOverridesChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setShowPicker(true)}
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
