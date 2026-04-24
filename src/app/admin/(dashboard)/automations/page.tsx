"use client";

import { useEffect, useState } from "react";
import { AdminNotice } from "@/components/admin/admin-notice";
import { PageHeader } from "@/components/admin/admin-primitives";
import type { AutomationHealth } from "@/components/admin/growth-os";
import { MetricCard, StatusPill } from "@/components/admin/growth-ui";
import { Bot, PauseCircle, PlayCircle, Siren } from "lucide-react";
import { useGrowthState } from "@/components/admin/use-growth-state";
import { useMonitoringState } from "@/components/admin/use-monitoring-state";
import type {
  MonitoringAlertRecord,
  MonitoringOverview,
  MonitoringServiceStatus,
} from "@/lib/monitoring/types";
import { projectId } from "@/lib/supabase/info";

function automationTone(health: AutomationHealth): "good" | "warn" | "danger" | "muted" {
  if (health === "healthy") return "good";
  if (health === "failed") return "danger";
  if (health === "warning") return "warn";
  return "muted";
}

function serviceTone(status: MonitoringServiceStatus): "good" | "warn" | "danger" | "muted" {
  if (status === "healthy") return "good";
  if (status === "failed") return "danger";
  if (status === "warning") return "warn";
  return "muted";
}

function formatTimestamp(value: string | null | undefined) {
  if (!value) return "Not checked yet";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatLastSweep(overview: MonitoringOverview | null) {
  if (!overview) return "No sweep yet";
  return formatTimestamp(overview.checkedAt);
}

function alertTone(alert: MonitoringAlertRecord): "warn" | "danger" {
  return alert.severity === "critical" ? "danger" : "warn";
}

export default function AdminAutomationsPage() {
  const { state, patchState, syncStatus, syncMessage } = useGrowthState();
  const { overview, loading: monitoringLoading, running, error, notice, runSweep, acknowledge, resolve } = useMonitoringState();
  const [killSwitch, setKillSwitch] = useState(state.settings.killSwitch);
  const heartbeatUrl = projectId
    ? `https://${projectId}.supabase.co/functions/v1/make-server-3fa6479f/admin/growth/heartbeat`
    : "Set NEXT_PUBLIC_SUPABASE_PROJECT_ID to render heartbeat URL";
  const monitorUrl = "/api/monitor/run";

  useEffect(() => {
    setKillSwitch(state.settings.killSwitch);
  }, [state.settings.killSwitch]);

  return (
    <div>
      <PageHeader
        index={23}
        title="Automations"
        description="Monitor Supabase health, heartbeat freshness, and incidents. Run sweeps manually or wire the cron endpoint so failures surface here automatically."
      />

      <div className="max-w-5xl grid gap-3 md:grid-cols-4 mb-7">
        <MetricCard
          label="Healthy Services"
          value={String(overview?.summary.healthy ?? 0)}
          hint={monitoringLoading ? "Loading..." : "Checks currently passing"}
        />
        <MetricCard
          label="Needs Attention"
          value={String((overview?.summary.warning ?? 0) + (overview?.summary.failed ?? 0))}
          hint="Warning and failed services"
        />
        <MetricCard
          label="Active Alerts"
          value={String(overview?.summary.openAlerts ?? 0)}
          hint="Open incidents awaiting attention"
        />
        <MetricCard
          label="Last Sweep"
          value={overview ? "DONE" : "PENDING"}
          hint={formatLastSweep(overview)}
        />
      </div>

      <div className="max-w-5xl mb-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void runSweep()}
          disabled={running}
          className="px-3 py-2 border border-[#E2B93B]/25 text-[#E2B93B]/75 hover:text-[#E2B93B] disabled:opacity-50 transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase"
        >
          {running ? "Running sweep..." : "Run sweep now"}
        </button>
      </div>

      {error || running || notice || syncMessage ? (
        <div className="max-w-5xl mb-7 space-y-3">
          {error ? <AdminNotice kind="error">{error}</AdminNotice> : null}
          {!error && running ? <AdminNotice kind="info">Updating monitoring state...</AdminNotice> : null}
          {!error && !running && notice ? <AdminNotice kind="success">{notice}</AdminNotice> : null}
          {syncMessage ? (
            <AdminNotice kind={syncStatus === "error" ? "error" : syncStatus === "ok" ? "success" : "info"}>
              {syncMessage}
            </AdminNotice>
          ) : null}
        </div>
      ) : null}

      <div className="max-w-5xl space-y-2">
        {state.automations.map((flow) => (
          <div key={flow.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-white/82 font-['Instrument_Sans']">{flow.name}</p>
                <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-1">
                  {flow.cadence} • Last run {flow.lastRun}
                </p>
              </div>
              <StatusPill label={flow.health} tone={automationTone(flow.health)} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-white/35 font-['Instrument_Sans']">{flow.throughput}</p>
              <div className="flex items-center gap-2">
                <p className="text-[9px] text-white/25 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
                  Heartbeats sync through the endpoint below
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mt-7 p-4 border border-red-500/25 bg-red-500/[0.04]">
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

      <div className="max-w-5xl mt-5 grid gap-4 lg:grid-cols-2">
        <div className="p-4 border border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-start gap-2">
            <Bot size={14} className="text-[#E2B93B]/70 mt-0.5" />
            <div className="w-full">
              <p className="text-[10px] text-white/40 font-['Instrument_Sans'] leading-relaxed">
                n8n or external job heartbeat target:
              </p>
              <code className="block mt-2 text-[9px] text-[#E2B93B]/70 bg-black/20 border border-white/[0.06] px-2 py-2 break-all">
                {heartbeatUrl}
              </code>
              <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-2">
                POST `{`{"automationId":"au-02","health":"healthy","throughput":"6 drafts","checkedAt":"2026-04-23T10:00:00.000Z"}`}`
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-start gap-2">
            <Bot size={14} className="text-[#E2B93B]/70 mt-0.5" />
            <div className="w-full">
              <p className="text-[10px] text-white/40 font-['Instrument_Sans'] leading-relaxed">
                Protected cron sweep endpoint:
              </p>
              <code className="block mt-2 text-[9px] text-[#E2B93B]/70 bg-black/20 border border-white/[0.06] px-2 py-2 break-all">
                {monitorUrl}
              </code>
              <p className="text-[10px] text-white/30 font-['Instrument_Sans'] mt-2 leading-relaxed">
                Call this on a schedule with `Authorization: Bearer MONITORING_CRON_SECRET` to persist checks and open alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mt-7">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-[10px] text-white/35 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
            Active alerts
          </p>
          <p className="text-[10px] text-white/25 font-['Instrument_Sans']">
            {overview?.alerts.length ?? 0} unresolved
          </p>
        </div>

        <div className="space-y-2">
          {overview?.alerts.length ? (
            overview.alerts.map((alert) => (
              <div key={alert.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] text-white/82 font-['Instrument_Sans']">{alert.title}</p>
                      <StatusPill label={alert.severity} tone={alertTone(alert)} />
                      <StatusPill label={alert.status} tone={alert.status === "open" ? "warn" : "muted"} />
                    </div>
                    <p className="text-[10px] text-white/35 font-['Instrument_Sans'] mt-2 leading-relaxed">
                      {alert.message ?? "No alert details recorded."}
                    </p>
                    <p className="text-[9px] text-white/25 font-['Instrument_Sans'] mt-2 tracking-[0.14em] uppercase">
                      Created {formatTimestamp(alert.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status === "open" ? (
                      <button
                        type="button"
                        onClick={() => void acknowledge(alert.id)}
                        disabled={running}
                        className="px-2.5 py-1.5 border border-white/[0.08] text-white/45 hover:text-white disabled:opacity-50 transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase"
                      >
                        Acknowledge
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void resolve(alert.id)}
                      disabled={running}
                      className="px-2.5 py-1.5 border border-white/[0.08] text-white/45 hover:text-white disabled:opacity-50 transition-colors text-[10px] font-['Instrument_Sans'] tracking-[0.14em] uppercase"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[11px] text-white/55 font-['Instrument_Sans']">
                {monitoringLoading ? "Loading alerts..." : "No unresolved alerts."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mt-7">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-[10px] text-white/35 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
            Service status
          </p>
          <p className="text-[10px] text-white/25 font-['Instrument_Sans']">
            {overview?.services.length ?? 0} tracked services
          </p>
        </div>

        <div className="space-y-2">
          {overview?.services.length ? (
            overview.services.map((service) => (
              <div key={service.id} className="p-4 border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] text-white/82 font-['Instrument_Sans']">{service.name}</p>
                      <StatusPill label={service.status} tone={serviceTone(service.status)} />
                    </div>
                    <p className="text-[10px] text-white/35 font-['Instrument_Sans'] mt-2 leading-relaxed">
                      {service.message ?? "No status message."}
                    </p>
                    <p className="text-[9px] text-white/25 font-['Instrument_Sans'] mt-2 tracking-[0.14em] uppercase">
                      Last checked {formatTimestamp(service.last_checked_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-white/25 font-['Instrument_Sans'] tracking-[0.14em] uppercase">
                      {service.category}
                    </p>
                    <p className="text-[10px] text-white/35 font-['Instrument_Sans'] mt-2">
                      {service.response_time_ms ? `${service.response_time_ms} ms` : "No timing"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[11px] text-white/55 font-['Instrument_Sans']">
                {monitoringLoading ? "Loading service checks..." : "Run a sweep to populate monitored services."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
