"use client";

import { useMemo, useState } from "react";
import { PageHeader, adminCx } from "@/components/admin/admin-primitives";
import type { LeadStage } from "@/components/admin/growth-os";
import { StatusPill } from "@/components/admin/growth-ui";
import { Search, SlidersHorizontal } from "lucide-react";
import { useGrowthState } from "@/components/admin/use-growth-state";

const STAGE_TONE: Record<LeadStage, "neutral" | "good" | "warn" | "muted"> = {
  new: "muted",
  qualified: "good",
  contacted: "neutral",
  replying: "good",
  won: "good",
};

export default function AdminLeadsPage() {
  const { state } = useGrowthState();
  const [query, setQuery] = useState("");
  const [minScore, setMinScore] = useState(0);

  const filtered = useMemo(() => {
    return state.leads.filter((lead) => {
      if (lead.score < minScore) return false;
      if (
        query &&
        !`${lead.company} ${lead.contact} ${lead.nextAction}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [state.leads, minScore, query]);

  return (
    <div>
      <PageHeader
        index={21}
        title="Leads"
        description="Consolidate discovered opportunities, score fit quality, and track pipeline stage changes without leaving your admin system."
      />

      <div className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, contact, action..."
              className={`${adminCx.input} pl-9`}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-white/[0.06] bg-white/[0.02]">
            <SlidersHorizontal size={12} className="text-white/25" />
            <label className="text-[10px] text-white/35 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
              Min score
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(event) => setMinScore(Number(event.target.value))}
              className="w-24 accent-[#E2B93B]"
            />
            <span className="text-[10px] text-[#E2B93B]/70 font-['Instrument_Sans'] w-6 text-right">{minScore}</span>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((lead) => (
            <div key={lead.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] text-white/85 font-['Instrument_Sans']">{lead.company}</p>
                  <p className="text-[10px] text-white/35 font-['Instrument_Sans'] mt-1">
                    {lead.contact} • {lead.source.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill label={lead.stage} tone={STAGE_TONE[lead.stage]} />
                  <span className="text-[10px] text-[#E2B93B]/75 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
                    Score {lead.score}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-['Instrument_Sans'] mt-3">
                Next action: {lead.nextAction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
