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
import { saveProjects } from "../../actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { Project } from "@/lib/content/projects";
import { ProjectForm } from "./project-form";
import { openOnKeyboard } from "@/lib/admin/interaction";
import { rememberAdminEditor } from "@/lib/admin/recent-editor";

type Props = { initial: Project[] };
type SaveStatus = "idle" | "saving" | "ok" | "error";
type ProjectStatus = NonNullable<Project["status"]>;

function SortableProjectRow({
  project,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  project: Project;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
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
      className={`group flex items-center justify-between gap-4 border p-4 cursor-pointer transition-colors focus:outline-none focus:border-[#E2B93B]/50 ${
        selected
          ? "border-[#E2B93B]/50 bg-[#E2B93B]/[0.06]"
          : "border-white/10 hover:border-[#E2B93B]/25 hover:bg-white/[0.02]"
      } ${isDragging ? "opacity-60" : ""}`}
      title="Double-click or press Enter to edit"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelect(event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          className="h-4 w-4 shrink-0 accent-[#E2B93B]"
          aria-label={`Select ${project.title}`}
        />
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="shrink-0 cursor-grab px-2 py-1 font-mono text-xs text-white/30 transition-colors hover:text-[#E2B93B] active:cursor-grabbing"
          aria-label={`Drag ${project.title} to reorder`}
        >
          ::
        </button>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-xs text-white/40">[{project.id}]</span>{" "}
          <span className="font-mono text-sm text-white">{project.title}</span>
          <span className="ml-2 font-mono text-xs text-white/50">
            {project.category} · {project.year}
          </span>
          <span className="ml-2 font-mono text-[10px] uppercase text-white/35">
            {project.status ?? "published"}
          </span>
          {project.featured ? (
            <span className="ml-2 font-mono text-[10px] text-[#E2B93B]/70">Featured</span>
          ) : null}
          {project.pinned ? (
            <span className="ml-2 font-mono text-[10px] text-[#E2B93B]">Pinned</span>
          ) : null}
          <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/15 opacity-0 transition-opacity group-hover:opacity-100">
            Double-click to edit
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          className="font-mono text-xs text-[#E2B93B] transition-colors hover:text-white"
        >
          Edit
        </button>
        <AdminConfirmAction
          title="Delete project?"
          description={`Delete "${project.title}" from the project grid.`}
          confirmLabel="Delete"
          destructive
          onConfirm={onDelete}
        >
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="font-mono text-xs text-white/40 transition-colors hover:text-red-400"
          >
            Delete
          </button>
        </AdminConfirmAction>
      </div>
    </li>
  );
}

export function ProjectsList({ initial }: Props) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [projects, setProjects] = useState<Project[]>(initial);
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedProjects = useMemo(
    () => projects.filter((project) => selectedIds.has(project.id)),
    [projects, selectedIds]
  );
  const allSelected = projects.length > 0 && selectedIds.size === projects.length;
  const counts = useMemo(
    () => ({
      published: projects.filter((project) => (project.status ?? "published") === "published").length,
      comingSoon: projects.filter((project) => project.status === "coming-soon").length,
      draft: projects.filter((project) => project.status === "draft").length,
      archived: projects.filter((project) => project.status === "archived").length,
      featured: projects.filter((project) => project.featured).length,
      pinned: projects.filter((project) => project.pinned).length,
    }),
    [projects]
  );

  useEffect(() => {
    setProjects(initial);
    setSelectedIds(new Set());
  }, [initial]);

  useEffect(() => {
    if (pendingRevert?.section === "projects" && Array.isArray(pendingRevert.snapshot)) {
      setProjects(pendingRevert.snapshot as Project[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  async function handleSave(updated: Project[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveProjects(updated, "Update projects");
    if (result.ok) {
      setProjects(updated);
      setEditing(null);
      setAdding(false);
      pushHistory("projects", "Projects", "Updated projects", updated);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 6000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function handleEdit(project: Project) {
    setAdding(false);
    setEditing(project);
    rememberAdminEditor({
      section: "projects",
      label: project.title,
      href: "/admin/projects",
    });
  }

  function handleAdd() {
    setEditing(null);
    setAdding(true);
  }

  function handleDelete(project: Project) {
    const updated = projects.filter((p) => p.id !== project.id);
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(project.id);
      return next;
    });
    handleSave(updated);
  }

  function toggleSelection(projectId: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(projectId);
      else next.delete(projectId);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(projects.map((project) => project.id)) : new Set());
  }

  function handleBulkStatus(nextStatus: ProjectStatus) {
    const updated = projects.map((project) =>
      selectedIds.has(project.id) ? { ...project, status: nextStatus } : project
    );
    handleSave(updated);
  }

  function handleBulkFlag(field: "featured" | "pinned", value: boolean) {
    const updated = projects.map((project) =>
      selectedIds.has(project.id) ? { ...project, [field]: value } : project
    );
    handleSave(updated);
  }

  function handleBulkDelete() {
    if (!selectedProjects.length) return;
    const updated = projects.filter((project) => !selectedIds.has(project.id));
    setSelectedIds(new Set());
    handleSave(updated);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((project) => project.id === active.id);
    const newIndex = projects.findIndex((project) => project.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    handleSave(arrayMove(projects, oldIndex, newIndex));
  }

  function handleFormSubmit(data: Partial<Project>) {
    if (editing) {
      const updated = projects.map((p) =>
        p.id === editing.id ? { ...p, ...data } : p
      );
      handleSave(updated);
    } else if (adding) {
      const maxId = Math.max(0, ...projects.map((p) => parseInt(p.id, 10) || 0));
      const newProject: Project = {
        id: String(maxId + 1).padStart(2, "0"),
        title: data.title ?? "",
        category: data.category ?? "",
        year: data.year ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
        slug: data.slug ?? (data.title ?? "").toLowerCase().replace(/\s+/g, "-"),
        status: data.status ?? "draft",
        featured: data.featured ?? false,
        pinned: data.pinned ?? false,
      };
      handleSave([...projects, newProject]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border border-white/10 bg-white/[0.02] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#E2B93B]">
            Projects console
          </span>
          <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
            <span>{projects.length} total</span>
            <span>{counts.published} published</span>
            <span>{counts.comingSoon} coming soon</span>
            <span>{counts.draft} draft</span>
            <span>{counts.archived} archived</span>
            <span>{counts.featured} featured</span>
            <span>{counts.pinned} pinned</span>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase transition-colors hover:bg-white active:scale-[0.98]"
        >
          Add project
        </button>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/projects.json..."
        successMessage="Saved to content/projects.json."
        undoSection="projects"
      />

      {(editing || adding) && (
        <ProjectForm
          project={editing ?? undefined}
          onSave={handleFormSubmit}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}

      {projects.length > 0 ? (
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
                  onClick={() => handleBulkStatus("coming-soon")}
                  className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#E2B93B]/40 hover:text-[#E2B93B]"
                >
                  Coming Soon
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
                  title="Delete selected projects?"
                  description={`Delete ${selectedProjects.length} selected project(s) from the project grid.`}
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
            <SortableContext items={projects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-3">
                {projects.map((project) => (
                  <SortableProjectRow
                    key={project.id}
                    project={project}
                    selected={selectedIds.has(project.id)}
                    onSelect={(checked) => toggleSelection(project.id, checked)}
                    onEdit={() => handleEdit(project)}
                    onDelete={() => handleDelete(project)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="border border-dashed border-[#E2B93B]/30 bg-[#E2B93B]/[0.04] p-8">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#E2B93B]">
            No projects yet
          </p>
          <p className="mt-3 max-w-xl font-mono text-sm text-white/55">
            Start with one strong case study card. Add title, category, year, image, and lifecycle status here; the same save flow will write it to content/projects.json.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-5 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white active:scale-[0.98]"
          >
            Add first project
          </button>
        </div>
      )}
    </div>
  );
}
