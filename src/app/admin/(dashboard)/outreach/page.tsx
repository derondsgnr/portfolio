"use client";

import { PageHeader } from "@/components/admin/admin-primitives";
import { StatusPill } from "@/components/admin/growth-ui";
import { AlertTriangle, SendHorizonal } from "lucide-react";
import { useGrowthState } from "@/components/admin/use-growth-state";

function riskTone(risk: number): "good" | "warn" | "neutral" {
  if (risk >= 45) return "warn";
  if (risk <= 24) return "good";
  return "neutral";
}

export default function AdminOutreachPage() {
  const { state } = useGrowthState();
  return (
    <div>
      <PageHeader
        index={22}
        title="Outreach"
        description="Evaluate outgoing cold messages before send. Prioritize high uniqueness and low spam-risk rows for autonomous dispatch."
      />

      <div className="max-w-3xl space-y-2">
        {state.outreachQueue.map((item) => (
          <div key={item.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-white/80 font-['Instrument_Sans']">{item.lead}</p>
                <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1">
                  {item.channel.toUpperCase().replace("-", " ")}
                </p>
              </div>
              <StatusPill
                label={item.status}
                tone={item.status === "replied" ? "good" : item.status === "paused" ? "warn" : "neutral"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 border border-white/[0.06]">
                <p className="text-[9px] text-white/25 font-['Instrument_Sans'] tracking-[0.14em] uppercase">Uniqueness</p>
                <p className="font-['Anton'] text-2xl text-white mt-1">{item.uniqueness}</p>
              </div>
              <div className="p-3 border border-white/[0.06]">
                <p className="text-[9px] text-white/25 font-['Instrument_Sans'] tracking-[0.14em] uppercase">Risk</p>
                <p className="font-['Anton'] text-2xl text-white mt-1">{item.risk}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <StatusPill
                label={item.risk >= 45 ? "manual approval required" : "eligible for auto-send"}
                tone={riskTone(item.risk)}
              />
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-white/35 hover:text-white hover:border-white/[0.15] transition-all text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase">
                <SendHorizonal size={12} />
                Open draft
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mt-7 p-4 border border-amber-500/20 bg-amber-500/[0.04]">
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-400/70 mt-0.5" />
          <p className="text-[10px] text-white/45 font-['Instrument_Sans'] leading-relaxed">
            Reddit DMs and first-touch LinkedIn outreach should keep a manual gate until you collect enough positive replies and low complaint rates.
          </p>
        </div>
      </div>
    </div>
  );
}
