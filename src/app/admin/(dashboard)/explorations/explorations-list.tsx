"use client";

import { useState, useEffect } from "react";
import { saveExplorations } from "../../actions";
import { AdminConfirmAction } from "@/components/admin/admin-confirm-dialog";
import { useAdmin } from "@/components/admin/admin-context";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { Exploration } from "@/lib/content/explorations";
import { ExplorationForm } from "./exploration-form";

type SaveStatus = "idle" | "saving" | "ok" | "error";

export function ExplorationsList({ initial }: { initial: Exploration[] }) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [items, setItems] = useState<Exploration[]>(initial);
  const [editing, setEditing] = useState<Exploration | null>(null);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => { setItems(initial); }, [initial]);

  useEffect(() => {
    if (pendingRevert?.section === "explorations" && Array.isArray(pendingRevert.snapshot)) {
      setItems(pendingRevert.snapshot as Exploration[]);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  async function handleSave(updated: Exploration[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveExplorations(updated, "Update explorations");
    if (result.ok) {
      setItems(updated);
      setEditing(null);
      setAdding(false);
      pushHistory("explorations", "Explorations", "Updated explorations", updated);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 6000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function handleFormSubmit(data: Exploration) {
    if (editing) {
      handleSave(items.map((item) => (item.id === editing.id ? { ...item, ...data } : item)));
    } else if (adding) {
      const newId = `ex-${String(Date.now()).slice(-5)}`;
      handleSave([...items, { ...data, id: newId }]);
    }
  }

  function handleDelete(item: Exploration) {
    handleSave(items.filter((i) => i.id !== item.id));
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border border-white/10 bg-white/[0.02] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#E2B93B]">
            Explorations
          </span>
          <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
            <span>{items.length} total</span>
            <span>{items.filter((i) => i.type === "image").length} images</span>
            <span>{items.filter((i) => i.type === "video").length} videos</span>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setAdding(true); }}
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase transition-colors hover:bg-white active:scale-[0.98]"
        >
          Add exploration
        </button>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving to content/explorations.json…"
        successMessage="Saved to content/explorations.json."
        undoSection="explorations"
      />

      {(editing || adding) && (
        <ExplorationForm
          exploration={editing ?? undefined}
          onSave={handleFormSubmit}
          onCancel={() => { setEditing(null); setAdding(false); }}
        />
      )}

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 border border-white/10 p-3 hover:border-[#E2B93B]/25 transition-colors"
            >
              {/* Thumbnail */}
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-cover shrink-0 border border-white/10"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="w-14 h-14 bg-[#111] shrink-0 flex items-center justify-center font-mono text-[8px] text-white/20">
                  NO IMG
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-white/40">[{item.id}]</span>
                  <span className="font-mono text-sm text-white">{item.title}</span>
                  <span className="font-mono text-xs text-[#E2B93B]/70 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/30 uppercase">{item.type}</span>
                  <span className="font-mono text-[10px] text-white/25">{item.date}</span>
                </div>
                {item.tools.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.tools.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/30 border border-white/10 px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setAdding(false); setEditing(item); }}
                  className="font-mono text-xs text-[#E2B93B] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <AdminConfirmAction
                  title="Delete exploration?"
                  description={`Delete "${item.title}" from the explorations gallery.`}
                  confirmLabel="Delete"
                  destructive
                  onConfirm={() => handleDelete(item)}
                >
                  <button
                    type="button"
                    className="font-mono text-xs text-white/40 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </AdminConfirmAction>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-dashed border-[#E2B93B]/30 bg-[#E2B93B]/[0.04] p-8">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#E2B93B]">
            No explorations yet
          </p>
          <p className="mt-3 font-mono text-sm text-white/55">
            Add images and motion experiments. They appear in the explorations gallery on the Craft page.
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-5 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors"
          >
            Add first exploration
          </button>
        </div>
      )}
    </div>
  );
}
