"use client";

import { useState } from "react";
import { saveNav } from "../../actions";
import { formCx } from "@/design-system";
import type { NavItem } from "@/lib/content/nav";

type Props = { initial: NavItem[] };

export function NavForm({ initial }: Props) {
  const [items, setItems] = useState<NavItem[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave(updated: NavItem[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveNav(updated, "Update nav");
    if (result.ok) {
      setItems(updated);
      setEditing(null);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Save failed");
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
    if (!confirm(`Remove "${items[i].label}"?`)) return;
    handleSave(items.filter((_, idx) => idx !== i));
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
    updated[i] = next;
    setEditing(null);
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
          className="px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors"
        >
          Add item
        </button>
      </div>

      {errorMsg && <p className="font-mono text-sm text-red-400">{errorMsg}</p>}
      {status === "saving" && <p className="font-mono text-xs text-white/50">Saving…</p>}
      {status === "ok" && <p className="font-mono text-xs text-[#E2B93B]">Saved</p>}

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-4 border border-white/10"
          >
            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="font-mono text-xs text-white/60 hover:text-white disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === items.length - 1}
                className="font-mono text-xs text-white/60 hover:text-white disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            {editing === i ? (
              <div className="flex-1 space-y-3">
                <div>
                  <label className={formCx.label}>Label</label>
                  <input
                    type="text"
                    defaultValue={item.label}
                    id={`nav-label-${i}`}
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
                      id={`nav-path-${i}`}
                      className={formCx.input}
                      placeholder="/work"
                    />
                  </div>
                  <div>
                    <label className={formCx.label}>Href (external URL)</label>
                    <input
                      type="text"
                      defaultValue={item.href ?? ""}
                      id={`nav-href-${i}`}
                      className={formCx.input}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const form = document.getElementById(`nav-label-${i}`) as HTMLInputElement;
                      const pathInput = document.getElementById(`nav-path-${i}`) as HTMLInputElement;
                      const hrefInput = document.getElementById(`nav-href-${i}`) as HTMLInputElement;
                      const label = form?.value?.trim() || item.label;
                      const path = pathInput?.value?.trim() || undefined;
                      const href = hrefInput?.value?.trim() || undefined;
                      handleEdit(i, { label, path: path || undefined, href: href || undefined });
                    }}
                    className="px-3 py-1.5 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs uppercase"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="px-3 py-1.5 border border-white/20 text-white/60 font-mono text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <span className="font-mono text-sm text-white">{item.label}</span>
                <span className="font-mono text-xs text-white/50 ml-2">
                  {item.path ?? item.href ?? "—"}
                </span>
              </div>
            )}

            {editing !== i && (
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditing(i)}
                  className="font-mono text-xs text-[#E2B93B] hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="font-mono text-xs text-white/40 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
