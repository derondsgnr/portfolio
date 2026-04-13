"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/admin-primitives";
import type { AutomationHealth } from "@/components/admin/growth-os";
import { StatusPill } from "@/components/admin/growth-ui";
import { Bot, PauseCircle, PlayCircle, Siren } from "lucide-react";
import { useGrowthState } from "@/components/admin/use-growth-state";
import { projectId } from "@/lib/supabase/info";

function tone(health: AutomationHealth): "good" | "warn" | "muted" {
  if (health === "healthy") return "good";
  if (health === "warning") return "warn";
  return "muted";
}

export default function AdminAutomationsPage() {
  const { state, patchState } = useGrowthState();
  const [killSwitch, setKillSwitch] = useState(state.settings.killSwitch);
  const heartbeatUrl = projectId
    ? `https://${projectId}.supabase.co/functions/v1/make-server-3fa6479f/admin/growth/heartbeat`
    : "Set NEXT_PUBLIC_SUPABASE_PROJECT_ID to render heartbeat URL";

  useEffect(() => {
    setKillSwitch(state.settings.killSwitch);
  }, [state.settings.killSwitch]);

  return (
    <div>
      <PageHeader
        index={23}
        title="Automations"
        description="Monitor your workflow health, run cadence, and emergency controls. Pause all jobs instantly when behavior drifts."
      />

      <div className="max-w-3xl space-y-2">
        {state.automations.map((flow) => (
          <div key={flow.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-white/82 font-['Instrument_Sans']">{flow.name}</p>
                <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1">
                  {flow.cadence} • Last run {flow.lastRun}
                </p>
              </div>
              <StatusPill label={flow.health} tone={tone(flow.health)} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-white/35 font-['Instrument_Sans']">{flow.throughput}</p>
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1.5 border border-white/[0.08] text-white/35 hover:text-white transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase">
                  Inspect
                </button>
                <button className="px-2.5 py-1.5 border border-white/[0.08] text-white/35 hover:text-white transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase">
                  Retry
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mt-7 p-4 border border-red-500/25 bg-red-500/[0.04]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Siren size={14} className="text-red-400/70 mt-0.5" />
            <div>
              <p className="text-[10px] text-red-300/80 font-['Instrument_Sans'] tracking-[0.14em] uppercase">Global kill switch</p>
              <p className="text-[10px] text-white/45 font-['Instrument_Sans'] mt-1 leading-relaxed">
                Stops publishing and outreach runs while preserving queue state for later recovery.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setKillSwitch((current) => {
                const next = !current;
                void patchState((growth) => ({
                  ...growth,
                  settings: {
                    ...growth.settings,
                    killSwitch: next,
                  },
                }));
                return next;
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase ${
              killSwitch
                ? "border-emerald-500/30 text-emerald-300/80 hover:text-emerald-300"
                : "border-red-500/35 text-red-300/80 hover:text-red-300"
            }`}
          >
            {killSwitch ? <PlayCircle size={12} /> : <PauseCircle size={12} />}
            {killSwitch ? "Resume all" : "Pause all"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mt-5 p-4 border border-white/[0.05] bg-white/[0.02]">
        <div className="flex items-start gap-2">
          <Bot size={14} className="text-[#E2B93B]/70 mt-0.5" />
          <div className="w-full">
            <p className="text-[10px] text-white/40 font-['Instrument_Sans'] leading-relaxed">
              n8n webhook target for automation health events:
            </p>
            <code className="block mt-2 text-[9px] text-[#E2B93B]/70 bg-black/20 border border-white/[0.06] px-2 py-2 break-all">
              {heartbeatUrl}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
