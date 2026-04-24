"use client";

import { useState } from "react";
import { saveProjects } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { Project } from "@/lib/content/projects";
import { ProjectForm } from "./project-form";

type Props = { initial: Project[] };

export function ProjectsList({ initial }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave(updated: Project[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveProjects(updated, "Update projects");
    if (result.ok) {
      setProjects(updated);
      setEditing(null);
      setAdding(false);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function handleEdit(project: Project) {
    setAdding(false);
    setEditing(project);
  }

  function handleAdd() {
    setEditing(null);
    setAdding(true);
  }

  function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"?`)) return;
    const updated = projects.filter((p) => p.id !== project.id);
    handleSave(updated);
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
      };
      handleSave([...projects, newProject]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/50">{projects.length} projects</span>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors"
        >
          Add project
        </button>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/projects.json..."
        successMessage="Saved to content/projects.json."
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

      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-4 p-4 border border-white/10"
          >
            <div className="min-w-0 flex-1">
              <span className="font-mono text-xs text-white/40">[{p.id}]</span>{" "}
              <span className="font-mono text-sm text-white">{p.title}</span>
              <span className="font-mono text-xs text-white/50 ml-2">
                {p.category} · {p.year}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(p)}
                className="font-mono text-xs text-[#E2B93B] hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="font-mono text-xs text-white/40 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
