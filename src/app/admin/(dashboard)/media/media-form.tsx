"use client";

import { useState } from "react";
import { saveMedia, saveCraftItems, saveExplorations } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import type { MediaConfig } from "@/lib/content/media";
import type { CraftItem } from "@/lib/content/craft";
import type { Exploration } from "@/lib/content/explorations";

type Props = {
  initialMedia: MediaConfig;
  initialCraft: CraftItem[];
  initialExplorations: Exploration[];
};

const inputClass =
  "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
const labelClass = "block font-mono text-xs text-white/60 mb-1";

export function MediaForm({ initialMedia, initialCraft, initialExplorations }: Props) {
  const [media, setMedia] = useState(initialMedia);
  const [craft, setCraft] = useState(initialCraft);
  const [explorations, setExplorations] = useState(initialExplorations);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<"media" | "craft" | "explorations">("media");

  async function handleSaveMedia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedbackTarget("media");
    setSavingSection("media");
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveMedia(media, "Update media");
    setSavingSection(null);
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  async function handleSaveCraft(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedbackTarget("craft");
    setSavingSection("craft");
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveCraftItems(craft, "Update craft items");
    setSavingSection(null);
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  async function handleSaveExplorations(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedbackTarget("explorations");
    setSavingSection("explorations");
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveExplorations(explorations, "Update explorations");
    setSavingSection(null);
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function updateCraftImage(index: number, image: string) {
    setCraft((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], image };
      return next;
    });
  }

  function updateExplorationImage(index: number, image: string) {
    setExplorations((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], image };
      return next;
    });
  }

  const sectionBgKeys = Object.keys(media.sectionBackgrounds);
  const defaultSectionKeys = ["hero", "craft", "about"];
  const allSectionKeys = [...new Set([...defaultSectionKeys, ...sectionBgKeys])];

  return (
    <div className="space-y-12 max-w-3xl">
      {/* Section 1: Global assets */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Global assets
        </h2>
        <form onSubmit={handleSaveMedia} className="space-y-4">
          <div>
            <label htmlFor="heroBackground" className={labelClass}>
              Hero background URL
            </label>
            <input
              id="heroBackground"
              type="url"
              value={media.heroBackground}
              onChange={(e) => setMedia((m) => ({ ...m, heroBackground: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <span className={labelClass}>Section backgrounds</span>
            {allSectionKeys.map((key) => (
              <div key={key} className="mb-3">
                <label htmlFor={`sectionBg-${key}`} className="font-mono text-xs text-white/40">
                  {key}
                </label>
                <input
                  id={`sectionBg-${key}`}
                  type="url"
                  value={media.sectionBackgrounds[key] ?? ""}
                  onChange={(e) =>
                    setMedia((m) => ({
                      ...m,
                      sectionBackgrounds: {
                        ...m.sectionBackgrounds,
                        [key]: e.target.value,
                      },
                    }))
                  }
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={savingSection === "media"}
            className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "media" ? "Saving…" : "Save global assets"}
          </button>
        </form>
      </section>

      {/* Section 2: Craft items */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Craft items
        </h2>
        <form onSubmit={handleSaveCraft} className="space-y-4">
          <div className="space-y-3">
            {craft.map((item, i) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-white/10 rounded"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-white/50 block truncate">
                    [{item.id}] {item.title}
                  </span>
                  <input
                    type="url"
                    value={item.image}
                    onChange={(e) => updateCraftImage(i, e.target.value)}
                    className={`${inputClass} mt-1`}
                    placeholder="Image URL"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={savingSection === "craft"}
            className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "craft" ? "Saving…" : "Save craft items"}
          </button>
        </form>
      </section>

      {/* Section 3: Explorations */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Explorations
        </h2>
        <form onSubmit={handleSaveExplorations} className="space-y-4">
          <div className="space-y-3">
            {explorations.map((item, i) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-white/10 rounded"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-white/50 block truncate">
                    [{item.id}] {item.title}
                  </span>
                  <input
                    type="url"
                    value={item.image}
                    onChange={(e) => updateExplorationImage(i, e.target.value)}
                    className={`${inputClass} mt-1`}
                    placeholder="Image URL"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={savingSection === "explorations"}
            className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingSection === "explorations" ? "Saving…" : "Save explorations"}
          </button>
        </form>
      </section>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage={
          feedbackTarget === "craft"
            ? "Saving changes to content/craft.json..."
            : feedbackTarget === "explorations"
              ? "Saving changes to content/explorations.json..."
              : "Saving changes to content/media.json..."
        }
        successMessage={
          feedbackTarget === "craft"
            ? "Saved to content/craft.json."
            : feedbackTarget === "explorations"
              ? "Saved to content/explorations.json."
              : "Saved to content/media.json."
        }
      />
    </div>
  );
}
