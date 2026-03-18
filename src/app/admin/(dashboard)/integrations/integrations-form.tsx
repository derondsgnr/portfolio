"use client";

import { useState } from "react";
import { saveContent } from "../../actions";
import type { IntegrationsConfig, ExtraIntegration } from "@/lib/content/integrations";
import { Plus, Trash2 } from "lucide-react";

type Props = { initial: IntegrationsConfig };

export function IntegrationsForm({ initial }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extra, setExtra] = useState<ExtraIntegration[]>(initial.extra ?? []);

  function addExtra() {
    setExtra((prev) => [
      ...prev,
      { key: `custom-${Date.now()}`, label: "New integration", enabled: false, scriptUrl: "", config: {} },
    ]);
  }

  function removeExtra(i: number) {
    setExtra((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateExtra(i: number, updates: Partial<ExtraIntegration>) {
    setExtra((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...updates } : e)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);

    const form = e.currentTarget;
    const data: IntegrationsConfig = {
      googleAnalytics: {
        enabled: (form.elements.namedItem("gaEnabled") as HTMLInputElement)?.checked ?? false,
        measurementId: (form.elements.namedItem("gaMeasurementId") as HTMLInputElement)?.value?.trim() ?? "",
      },
      googleTagManager: {
        enabled: (form.elements.namedItem("gtmEnabled") as HTMLInputElement)?.checked ?? false,
        containerId: (form.elements.namedItem("gtmContainerId") as HTMLInputElement)?.value?.trim() ?? "",
      },
      extra: extra.map((e, idx) => {
        const configEl = form.elements.namedItem(`extra-${idx}-config`) as HTMLInputElement | null;
        let config: Record<string, string> | undefined;
        if (configEl?.value?.trim()) {
          try {
            config = JSON.parse(configEl.value) as Record<string, string>;
            if (!config || typeof config !== "object") config = undefined;
          } catch {
            config = undefined;
          }
        }
        return {
          ...e,
          key: e.key.trim() || `custom-${Date.now()}`,
          label: e.label.trim() || "Unnamed",
          scriptUrl: e.scriptUrl?.trim() || undefined,
          config: config && Object.keys(config).length > 0 ? config : undefined,
        };
      }),
    };

    const content = JSON.stringify(data, null, 2);
    const result = await saveContent("content/integrations.json", content, "Update integrations");

    if (result.ok) {
      setStatus("ok");
      setExtra(data.extra ?? []);
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Save failed");
    }
  }

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {/* Google Analytics */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Google Analytics (GA4)
        </h2>
        <div className="flex items-center gap-3">
          <input
            id="gaEnabled"
            name="gaEnabled"
            type="checkbox"
            defaultChecked={initial.googleAnalytics.enabled}
            className="h-4 w-4 accent-[#E2B93B]"
          />
          <label htmlFor="gaEnabled" className="font-mono text-sm text-white/80">
            Enable Google Analytics
          </label>
        </div>
        <div>
          <label htmlFor="gaMeasurementId" className={labelClass}>
            Measurement ID (e.g. G-XXXXXXXXXX)
          </label>
          <input
            id="gaMeasurementId"
            name="gaMeasurementId"
            type="text"
            defaultValue={initial.googleAnalytics.measurementId}
            className={inputClass}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
      </section>

      {/* Google Tag Manager */}
      <section className="space-y-4">
        <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
          Google Tag Manager
        </h2>
        <div className="flex items-center gap-3">
          <input
            id="gtmEnabled"
            name="gtmEnabled"
            type="checkbox"
            defaultChecked={initial.googleTagManager.enabled}
            className="h-4 w-4 accent-[#E2B93B]"
          />
          <label htmlFor="gtmEnabled" className="font-mono text-sm text-white/80">
            Enable Google Tag Manager
          </label>
        </div>
        <div>
          <label htmlFor="gtmContainerId" className={labelClass}>
            Container ID (e.g. GTM-XXXXXXX)
          </label>
          <input
            id="gtmContainerId"
            name="gtmContainerId"
            type="text"
            defaultValue={initial.googleTagManager.containerId}
            className={inputClass}
            placeholder="GTM-XXXXXXX"
          />
        </div>
      </section>

      {/* Custom integrations (Plausible, Fathom, Hotjar, etc.) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm text-white/80 uppercase tracking-wider">
            Custom Integrations
          </h2>
          <button
            type="button"
            onClick={addExtra}
            className="flex items-center gap-1 px-3 py-1.5 border border-white/20 text-white/80 font-mono text-xs hover:bg-white/5 transition-colors"
          >
            <Plus size={12} />
            Add
          </button>
        </div>
        <p className="font-mono text-xs text-white/50">
          Add Plausible, Fathom, Hotjar, or any script-based analytics. Paste the script URL and optional data attributes (e.g. <code className="text-white/60">data-domain</code> for Plausible).
        </p>
        {extra.map((e, i) => (
          <div
            key={e.key}
            className="p-4 border border-white/10 bg-white/[0.02] space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={e.label}
                onChange={(ev) => updateExtra(i, { label: ev.target.value })}
                placeholder="Label (e.g. Plausible)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeExtra(i)}
                className="p-2 text-white/40 hover:text-red-400 transition-colors"
                aria-label="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                id={`extra-${i}-enabled`}
                type="checkbox"
                checked={e.enabled}
                onChange={(ev) => updateExtra(i, { enabled: ev.target.checked })}
                className="h-4 w-4 accent-[#E2B93B]"
              />
              <label htmlFor={`extra-${i}-enabled`} className="font-mono text-xs text-white/70">
                Enabled
              </label>
            </div>
            <div>
              <label className={labelClass}>Script URL</label>
              <input
                type="url"
                value={e.scriptUrl ?? ""}
                onChange={(ev) => updateExtra(i, { scriptUrl: ev.target.value })}
                placeholder="https://plausible.io/js/script.js"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Data attributes (JSON, e.g. &#123;&quot;data-domain&quot;: &quot;yoursite.com&quot;&#125;)</label>
              <input
                type="text"
                defaultValue={e.config ? JSON.stringify(e.config) : ""}
                name={`extra-${i}-config`}
                placeholder='{"data-domain": "yoursite.com"}'
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </section>

      {errorMsg && (
        <p className="font-mono text-sm text-red-400">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "saving"}
        className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : status === "ok" ? "Saved" : "Save"}
      </button>
    </form>
  );
}
