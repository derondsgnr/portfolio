"use client";

import { useState, useRef } from "react";
import { saveTheme } from "../../actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { formCx, FormField, SaveButton } from "@/design-system";
import type { Theme, FontPairId } from "@/lib/content/theme";

function ColorField({
  id,
  label,
  defaultValue,
}: {
  id: string;
  label: string;
  defaultValue: string;
}) {
  const colorRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className={formCx.label} style={{ width: 100 }}>
        {label}
      </label>
      <input
        ref={colorRef}
        type="color"
        defaultValue={defaultValue}
        onChange={() => {
          if (textRef.current && colorRef.current) textRef.current.value = colorRef.current.value;
        }}
        className="h-10 w-14 cursor-pointer rounded border border-white/10 bg-transparent p-1"
      />
      <input
        ref={textRef}
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{6}$/.test(v) && colorRef.current) colorRef.current.value = v;
        }}
        className={`${formCx.input} flex-1 font-mono`}
        placeholder="#E2B93B"
      />
    </div>
  );
}

const FONT_PAIRS: { id: FontPairId; label: string; primary: string; secondary: string }[] = [
  { id: "anton-instrument", label: "Anton + Instrument Sans", primary: "anton", secondary: "instrument-sans" },
  { id: "inter-playfair", label: "Inter + Playfair Display", primary: "playfair", secondary: "inter" },
  { id: "space-dm", label: "Space Grotesk + DM Sans", primary: "space", secondary: "dm" },
];

type Props = { initial: Theme };

export function ThemeForm({ initial }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);

    const form = e.currentTarget;
    const pair = (form.elements.namedItem("pair") as HTMLSelectElement).value as FontPairId;
    const pairMeta = FONT_PAIRS.find((p) => p.id === pair);
    const data: Theme = {
      fonts: {
        primary: pairMeta?.primary ?? initial.fonts.primary,
        secondary: pairMeta?.secondary ?? initial.fonts.secondary,
        pair,
      },
      colors: {
        primary: (form.elements.namedItem("color-primary") as HTMLInputElement).value,
        secondary: (form.elements.namedItem("color-secondary") as HTMLInputElement).value,
        accent: (form.elements.namedItem("color-accent") as HTMLInputElement).value,
        background: (form.elements.namedItem("color-background") as HTMLInputElement).value,
        text: (form.elements.namedItem("color-text") as HTMLInputElement).value,
      },
      spacing: {
        xs: (form.elements.namedItem("spacing-xs") as HTMLInputElement).value,
        sm: (form.elements.namedItem("spacing-sm") as HTMLInputElement).value,
        md: (form.elements.namedItem("spacing-md") as HTMLInputElement).value,
        lg: (form.elements.namedItem("spacing-lg") as HTMLInputElement).value,
        xl: (form.elements.namedItem("spacing-xl") as HTMLInputElement).value,
      },
    };

    const result = await saveTheme(data, "Update theme");

    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-mono text-sm text-white/80 mb-4 uppercase tracking-wider">Font pair</h2>
        <label htmlFor="pair" className={labelClass}>
          Select a font combination
        </label>
        <select
          id="pair"
          name="pair"
          defaultValue={initial.fonts.pair}
          className={inputClass}
        >
          {FONT_PAIRS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="font-mono text-sm text-white/80 mb-4 uppercase tracking-wider">Colors</h2>
        <div className="space-y-4">
          {[
            { id: "color-primary", label: "Primary", value: initial.colors.primary },
            { id: "color-secondary", label: "Secondary", value: initial.colors.secondary },
            { id: "color-accent", label: "Accent", value: initial.colors.accent },
            { id: "color-background", label: "Background", value: initial.colors.background },
            { id: "color-text", label: "Text", value: initial.colors.text },
          ].map(({ id, label, value }) => (
            <ColorField key={id} id={id} label={label} defaultValue={value} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-mono text-sm text-white/80 mb-4 uppercase tracking-wider">Spacing</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((key) => (
            <div key={key}>
              <label htmlFor={`spacing-${key}`} className={labelClass}>
                {key}
              </label>
              <input
                id={`spacing-${key}`}
                name={`spacing-${key}`}
                type="text"
                defaultValue={initial.spacing[key]}
                className={inputClass}
                placeholder="0.25rem"
              />
            </div>
          ))}
        </div>
      </div>

      <AdminSaveFeedback
        status={status}
        error={errorMsg}
        savingMessage="Saving changes to content/theme.json..."
        successMessage="Saved to content/theme.json."
      />
      <SaveButton status={status} />
    </form>
  );
}
