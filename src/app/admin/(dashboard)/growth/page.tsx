"use client";

import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { PageHeader } from "@/components/admin/admin-primitives";
import { MetricCard, PanelLink, QueueCard, StatusPill } from "@/components/admin/growth-ui";
import { useGrowthState } from "@/components/admin/use-growth-state";
import { PauseCircle, PlayCircle, ShieldAlert } from "lucide-react";

function queueTone(status: string): "neutral" | "good" | "warn" | "muted" {
  if (status === "posted" || status === "replied" || status === "scheduled") return "good";
  if (status === "needs-review" || status === "paused" || status === "warning") return "warn";
  if (status === "draft" || status === "new") return "muted";
  return "neutral";
}

export default function AdminGrowthPage() {
  const { state, loading, patchState, syncStatus, syncMessage } = useGrowthState();
  const todayScheduled = state.contentQueue.filter((item) => item.status === "scheduled").length;
  const warmLeads = state.leads.filter((lead) => lead.stage === "qualified" || lead.stage === "replying").length;
  const blockedFlows = state.automations.filter((flow) => flow.health !== "healthy").length;

  return (
    <div>
      <PageHeader
        index={19}
        title="Growth OS"
        description="Your daily operating console for publishing, pipeline, and outreach automation. Review only exceptions and let low-risk tasks run."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <MetricCard label="Today Scheduled" value={String(todayScheduled)} hint="Posts queued for same-day publishing" />
        <MetricCard label="Warm Leads" value={String(warmLeads)} hint="Qualified leads with active momentum" />
        <MetricCard label="Needs Attention" value={String(blockedFlows)} hint="Automations in warning or paused state" />
      </div>

      {syncMessage ? (
        <div className="mb-6">
          <AdminNotice kind={syncStatus === "error" ? "error" : syncStatus === "ok" ? "success" : "info"}>
            {syncMessage}
          </AdminNotice>
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-['Anton'] text-lg tracking-[0.08em] text-white uppercase">Today Queue</h2>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <Link href="/admin/content-queue" className="text-[10px] text-[#E2B93B]/60 hover:text-[#E2B93B] font-['Instrument_Sans'] tracking-[0.16em] uppercase">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {state.contentQueue.slice(0, 3).map((item) => (
                <QueueCard
                  key={item.id}
                  title={item.title}
                  meta={`${item.channel.toUpperCase()} • ${item.scheduledFor}`}
                  status={item.status}
                  tone={queueTone(item.status)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-['Anton'] text-lg tracking-[0.08em] text-white uppercase">Active Automations</h2>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="space-y-2">
              {state.automations.map((flow) => (
                <div key={flow.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] text-white/80 font-['Instrument_Sans']">{flow.name}</p>
                      <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1">
                        {flow.cadence} • Last run {flow.lastRun}
                      </p>
                    </div>
                    <StatusPill label={flow.health} tone={queueTone(flow.health)} />
                  </div>
                  <p className="text-[10px] text-white/35 font-['Instrument_Sans'] mt-3">{flow.throughput}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-3">
          <PanelLink title="Content Queue" description="Edit text-only posts, assign channels, and schedule auto-publish windows." to="/admin/content-queue" />
          <PanelLink title="Leads Pipeline" description="Review lead score, stage changes, and next action generated from your sources." to="/admin/leads" />
          <PanelLink title="Outreach Queue" description="Approve or pause cold messages based on uniqueness and spam-risk scoring." to="/admin/outreach" />
          <PanelLink title="Automation Health" description="Track failing jobs, throttling events, and trigger-level kill controls." to="/admin/automations" />

          <div className="mt-4 p-4 border border-amber-500/20 bg-amber-500/[0.04]">
            <div className="flex items-start gap-2">
              <ShieldAlert size={14} className="text-amber-400/70 mt-0.5" />
              <div>
                <p className="text-[10px] text-amber-300/75 font-['Instrument_Sans'] tracking-[0.14em] uppercase">Guardrail</p>
                <p className="text-[10px] text-white/45 font-['Instrument_Sans'] mt-1 leading-relaxed">
                  Keep first-touch outreach in manual approval mode until reply quality is stable.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                void patchState((current) => ({
                  ...current,
                  settings: {
                    ...current.settings,
                    killSwitch: true,
                  },
                }));
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 border border-white/[0.08] text-white/35 hover:text-white hover:border-white/[0.16] transition-all text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase"
            >
              <PauseCircle size={12} />
              Pause All
            </button>
            <button
              onClick={() => {
                void patchState((current) => ({
                  ...current,
                  settings: {
                    ...current.settings,
                    killSwitch: false,
                  },
                }));
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 border border-[#E2B93B]/30 text-[#E2B93B]/80 hover:text-[#E2B93B] transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase"
            >
              <PlayCircle size={12} />
              Resume
            </button>
          </div>

          <p className="text-[9px] text-white/25 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
            {loading ? "syncing state..." : state.settings.killSwitch ? "kill switch active" : "all flows enabled"}
          </p>
        </aside>
      </div>
    </div>
  );
}
