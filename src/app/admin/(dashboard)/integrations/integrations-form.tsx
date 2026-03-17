"use client";

import { useState } from "react";
import { saveContent } from "../../actions";
import type { IntegrationsConfig } from "@/lib/content/integrations";

type Props = { initial: IntegrationsConfig };

export function IntegrationsForm({ initial }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    };

    const content = JSON.stringify(data, null, 2);
    const result = await saveContent("content/integrations.json", content, "Update integrations");

    if (result.ok) {
      setStatus("ok");
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
