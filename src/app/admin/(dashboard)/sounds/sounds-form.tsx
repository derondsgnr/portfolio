"use client";

import { useState } from "react";
import { saveSounds } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { SaveButton } from "@/design-system";
import type { SoundsConfig } from "@/lib/content/sounds";

const EVENTS: (keyof SoundsConfig)[] = [
  "loaderComplete",
  "loaderTick",
  "click",
  "hover",
  "navigate",
  "textReveal",
];

const LABELS: Record<keyof SoundsConfig, string> = {
  loaderComplete: "Loader complete",
  loaderTick: "Loader tick",
  click: "Button click",
  hover: "Hover",
  navigate: "Navigation",
  textReveal: "Text reveal (hero/header)",
};

type Props = { initial: SoundsConfig };

export function SoundsForm({ initial }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<SoundsConfig>(initial);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);

    const result = await saveSounds(data, "Update sounds");

    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  const inputClass = "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {EVENTS.map((key) => (
        <div key={key}>
          <label htmlFor={key} className={labelClass}>
            {LABELS[key]}
          </label>
          <input
            id={key}
            type="url"
            value={data[key] ?? ""}
            onChange={(e) => setData((prev) => ({ ...prev, [key]: e.target.value }))}
            className={inputClass}
            placeholder="https://... or /sounds/click.mp3"
          />
        </div>
      ))}

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/sounds.json..."
        successMessage="Saved to content/sounds.json."
      />
      <SaveButton status={status} />
    </form>
  );
}
