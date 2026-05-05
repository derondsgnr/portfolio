"use client";

import { useState } from "react";
import { saveTestimonials } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { TestimonialItem } from "@/lib/content/testimonials";
import { TestimonialForm } from "./testimonial-form";
import { MessageSquare, Plus, Pencil, Trash2 } from "lucide-react";

type Props = { initial: TestimonialItem[] };

export function TestimonialsList({ initial }: Props) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initial);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave(updated: TestimonialItem[]) {
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveTestimonials(updated, "Update testimonials");
    if (result.ok) {
      setTestimonials(updated);
      setEditing(null);
      setAdding(false);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function handleEdit(t: TestimonialItem) {
    setAdding(false);
    setEditing(t);
  }

  function handleAdd() {
    setEditing(null);
    setAdding(true);
  }

  function handleDelete(t: TestimonialItem) {
    if (!confirm(`Delete testimonial from ${t.name}?`)) return;
    const updated = testimonials.filter((p) => p.id !== t.id);
    handleSave(updated);
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

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/50 flex items-center gap-2">
          <MessageSquare size={14} />
          {testimonials.length} testimonials
        </span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors"
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

      <ul className="space-y-3">
        {testimonials.map((t) => (
          <li
            key={t.id}
            className="p-4 border border-white/10 bg-white/[0.02] flex items-start justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-white/90 truncate">&quot;{t.quote}&quot;</p>
              <p className="font-mono text-xs text-white/50 mt-1">
                {t.name} — {t.role}, {t.company}
              </p>
              <p className="font-mono text-[10px] text-white/35 mt-1 uppercase">
                {t.status ?? "published"}
                {t.featured ? " · Featured" : ""}
                {t.pinned ? " · Pinned" : ""}
              </p>
              <div className="flex gap-3 mt-2">
                {t.avatar && (
                  <img src={t.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                )}
                {t.companyLogo && (
                  <img src={t.companyLogo} alt="" className="h-6 w-auto object-contain opacity-80" />
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(t)}
                className="p-2 text-white/40 hover:text-[#E2B93B] transition-colors"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t)}
                className="p-2 text-white/40 hover:text-red-400 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
