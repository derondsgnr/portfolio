import { getSupabaseProjectUrl, getSupabasePublicAnonKey, getSupabaseServerAdmin } from "@/lib/supabase/server";
import { DEFAULT_AUTOMATION_MONITORS, getAutomationServiceId } from "./config";
import { notifyMonitoringAlert } from "./notifications";
import type {
  MonitoringAlertRecord,
  MonitoringAlertSeverity,
  MonitoringCheckResult,
  MonitoringOverview,
  MonitoringServiceRecord,
  MonitoringServiceStatus,
} from "./types";

const KV_TABLE = "kv_store_3fa6479f";
const ACTIVE_ALERT_STATES = ["open", "acknowledged"] as const;
const ATTENTION_TRIGGER = "service_attention";

type HeartbeatRow = {
  automation_id: string;
  source: string;
  health: "healthy" | "warning" | "paused" | "failed";
  throughput: string | null;
  payload: Record<string, unknown> | null;
  received_at: string;
};

function getSiteUrl() {
  const raw =
    process.env.MONITORING_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!raw) return null;
  return raw.startsWith("http") ? raw.replace(/\/$/, "") : `https://${raw.replace(/\/$/, "")}`;
}

function nowIso() {
  return new Date().toISOString();
}

function statusToSeverity(status: MonitoringServiceStatus): MonitoringAlertSeverity | null {
  if (status === "failed") return "critical";
  if (status === "warning") return "warning";
  return null;
}

function toSummary(services: MonitoringServiceRecord[], alerts: MonitoringAlertRecord[]) {
  return {
    healthy: services.filter((service) => service.status === "healthy").length,
    warning: services.filter((service) => service.status === "warning").length,
    failed: services.filter((service) => service.status === "failed").length,
    unknown: services.filter((service) => service.status === "unknown").length,
    openAlerts: alerts.filter((alert) => alert.status === "open").length,
    acknowledgedAlerts: alerts.filter((alert) => alert.status === "acknowledged").length,
  };
}

async function timed<T>(work: () => Promise<T>) {
  const started = Date.now();
  const value = await work();
  return { value, responseTimeMs: Date.now() - started };
}

async function checkSupabaseRest(): Promise<MonitoringCheckResult> {
  try {
    const supabase = getSupabaseServerAdmin();
    const { responseTimeMs } = await timed(async () => {
      const { error } = await supabase.from(KV_TABLE).select("key").limit(1);
      if (error) throw new Error(error.message);
    });

    return {
      serviceId: "platform:supabase-rest",
      name: "Supabase KV",
      category: "platform",
      status: "healthy",
      message: "REST access to the Supabase KV table succeeded.",
      target: KV_TABLE,
      responseTimeMs,
      metadata: { kind: "supabase_rest" },
    };
  } catch (error) {
    return {
      serviceId: "platform:supabase-rest",
      name: "Supabase KV",
      category: "platform",
      status: "failed",
      message: error instanceof Error ? error.message : "Supabase KV check failed.",
      target: KV_TABLE,
      metadata: { kind: "supabase_rest" },
    };
  }
}

async function checkSupabaseEdgeFunction(): Promise<MonitoringCheckResult> {
  const url = `${getSupabaseProjectUrl()}/functions/v1/make-server-3fa6479f/admin/growth`;
  const headers: Record<string, string> = {};

  try {
    headers.Authorization = `Bearer ${getSupabasePublicAnonKey()}`;
  } catch {
    // The function can still be public in development; fall through without auth.
  }

  try {
    const { value: response, responseTimeMs } = await timed(() =>
      fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      })
    );

    if (!response.ok) {
      throw new Error(`Edge function returned ${response.status}`);
    }

    return {
      serviceId: "integration:supabase-edge-growth",
      name: "Supabase Growth Function",
      category: "integration",
      status: "healthy",
      message: "Growth edge function responded successfully.",
      target: url,
      responseTimeMs,
      metadata: { kind: "edge_function" },
    };
  } catch (error) {
    return {
      serviceId: "integration:supabase-edge-growth",
      name: "Supabase Growth Function",
      category: "integration",
      status: "failed",
      message: error instanceof Error ? error.message : "Growth edge function check failed.",
      target: url,
      metadata: { kind: "edge_function" },
    };
  }
}

async function checkPublicHealthEndpoint(): Promise<MonitoringCheckResult> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return {
      serviceId: "route:public-health",
      name: "Public Health Endpoint",
      category: "route",
      status: "unknown",
      message: "Set MONITORING_SITE_URL or NEXT_PUBLIC_SITE_URL to probe the deployed site.",
      target: "/api/health",
      metadata: { kind: "public_health" },
    };
  }

  const url = `${siteUrl}/api/health`;

  try {
    const { value: response, responseTimeMs } = await timed(() =>
      fetch(url, {
        method: "GET",
        cache: "no-store",
      })
    );

    if (!response.ok) {
      throw new Error(`Health endpoint returned ${response.status}`);
    }

    const body = (await response.json()) as { status?: string };
    const status = body.status === "healthy" ? "healthy" : "warning";

    return {
      serviceId: "route:public-health",
      name: "Public Health Endpoint",
      category: "route",
      status,
      message:
        status === "healthy"
          ? "The deployed health endpoint is reachable."
          : "The deployed health endpoint responded but reported degraded checks.",
      target: url,
      responseTimeMs,
      metadata: { kind: "public_health", reportedStatus: body.status ?? "unknown" },
    };
  } catch (error) {
    return {
      serviceId: "route:public-health",
      name: "Public Health Endpoint",
      category: "route",
      status: "failed",
      message: error instanceof Error ? error.message : "Health endpoint probe failed.",
      target: url,
      metadata: { kind: "public_health" },
    };
  }
}

function formatAgeLabel(ageMinutes: number) {
  if (ageMinutes < 1) return "just now";
  if (ageMinutes < 60) return `${ageMinutes}m ago`;
  const hours = Math.floor(ageMinutes / 60);
  const remainderMinutes = ageMinutes % 60;
  if (remainderMinutes === 0) return `${hours}h ago`;
  return `${hours}h ${remainderMinutes}m ago`;
}

async function checkAutomationHeartbeats(): Promise<MonitoringCheckResult[]> {
  const supabase = getSupabaseServerAdmin();
  const { data, error } = await supabase
    .from("automation_heartbeats")
    .select("automation_id, source, health, throughput, payload, received_at")
    .order("received_at", { ascending: false })
    .limit(200);

  if (error) {
    return [
      {
        serviceId: "automation:heartbeats",
        name: "Automation Heartbeats",
        category: "automation",
        status: "failed",
        message: error.message,
        target: "automation_heartbeats",
        metadata: { kind: "automation_heartbeat_table" },
      },
    ];
  }

  const latestByAutomation = new Map<string, HeartbeatRow>();
  for (const row of (data ?? []) as HeartbeatRow[]) {
    if (!latestByAutomation.has(row.automation_id)) {
      latestByAutomation.set(row.automation_id, row);
    }
  }

  const checks: MonitoringCheckResult[] = [];
  const seen = new Set<string>();
  const currentTimeMs = Date.now();

  for (const automation of DEFAULT_AUTOMATION_MONITORS) {
    seen.add(automation.automationId);
    const latest = latestByAutomation.get(automation.automationId);
    const serviceId = getAutomationServiceId(automation.automationId);

    if (!latest) {
      checks.push({
        serviceId,
        name: automation.name,
        category: "automation",
        status: "unknown",
        message: "Waiting for the first heartbeat from this automation.",
        expectedIntervalMinutes: automation.expectedIntervalMinutes,
        metadata: {
          kind: "automation_heartbeat",
          automationId: automation.automationId,
        },
      });
      continue;
    }

    const ageMinutes = Math.max(0, Math.floor((currentTimeMs - new Date(latest.received_at).getTime()) / 60000));
    const isStale = ageMinutes > automation.expectedIntervalMinutes;

    let status: MonitoringServiceStatus = "healthy";
    if (latest.health === "failed" || isStale) status = "failed";
    else if (latest.health === "warning") status = "warning";
    else if (latest.health === "paused") status = "unknown";

    const message = isStale
      ? `Heartbeat overdue. Last signal arrived ${formatAgeLabel(ageMinutes)}.`
      : latest.health === "paused"
        ? `Latest heartbeat reports paused (${formatAgeLabel(ageMinutes)}).`
        : latest.health === "warning"
          ? `Latest heartbeat reported warnings ${formatAgeLabel(ageMinutes)}.`
          : latest.health === "failed"
            ? `Latest heartbeat reported failure ${formatAgeLabel(ageMinutes)}.`
            : `Latest heartbeat received ${formatAgeLabel(ageMinutes)}.`;

    checks.push({
      serviceId,
      name: automation.name,
      category: "automation",
      status,
      message,
      expectedIntervalMinutes: automation.expectedIntervalMinutes,
      metadata: {
        kind: "automation_heartbeat",
        automationId: automation.automationId,
        latestHeartbeatAt: latest.received_at,
        throughput: latest.throughput,
        source: latest.source,
      },
    });
  }

  for (const [automationId, latest] of latestByAutomation.entries()) {
    if (seen.has(automationId)) continue;

    checks.push({
      serviceId: getAutomationServiceId(automationId),
      name: automationId,
      category: "automation",
      status: latest.health === "failed" ? "failed" : latest.health === "warning" ? "warning" : "healthy",
      message: `Received heartbeat from unconfigured automation ${automationId}.`,
      metadata: {
        kind: "automation_heartbeat",
        automationId,
        latestHeartbeatAt: latest.received_at,
        throughput: latest.throughput,
        source: latest.source,
      },
    });
  }

  return checks;
}

async function upsertService(check: MonitoringCheckResult) {
  const supabase = getSupabaseServerAdmin();
  const { data: previous, error: previousError } = await supabase
    .from("monitoring_services")
    .select("*")
    .eq("id", check.serviceId)
    .maybeSingle();

  if (previousError) throw new Error(previousError.message);

  const previousService = previous as MonitoringServiceRecord | null;
  const nextStatus = check.status;
  const checkedAt = nowIso();
  const nextConsecutiveFailures =
    nextStatus === "healthy"
      ? 0
      : nextStatus === "unknown"
        ? previousService?.consecutive_failures ?? 0
        : (previousService?.consecutive_failures ?? 0) + 1;

  const upsertPayload = {
    id: check.serviceId,
    name: check.name,
    category: check.category,
    status: nextStatus,
    target: check.target ?? null,
    message: check.message,
    response_time_ms: check.responseTimeMs ?? null,
    expected_interval_minutes: check.expectedIntervalMinutes ?? null,
    consecutive_failures: nextConsecutiveFailures,
    last_checked_at: checkedAt,
    last_success_at:
      nextStatus === "healthy" ? checkedAt : previousService?.last_success_at ?? null,
    last_failure_at:
      nextStatus === "warning" || nextStatus === "failed"
        ? checkedAt
        : previousService?.last_failure_at ?? null,
    metadata: check.metadata ?? {},
  };

  const { data, error } = await supabase
    .from("monitoring_services")
    .upsert(upsertPayload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as MonitoringServiceRecord;
}

async function getActiveAlert(serviceId: string) {
  const supabase = getSupabaseServerAdmin();
  const { data, error } = await supabase
    .from("monitoring_alerts")
    .select("*")
    .eq("service_id", serviceId)
    .in("status", [...ACTIVE_ALERT_STATES])
    .eq("trigger", ATTENTION_TRIGGER)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as MonitoringAlertRecord | null;
}

async function resolveActiveAlert(serviceId: string) {
  const active = await getActiveAlert(serviceId);
  if (!active) return;

  const supabase = getSupabaseServerAdmin();
  const { error } = await supabase
    .from("monitoring_alerts")
    .update({
      status: "resolved",
      resolved_at: nowIso(),
    })
    .eq("id", active.id);

  if (error) throw new Error(error.message);
}

async function upsertAlertForService(service: MonitoringServiceRecord) {
  const severity = statusToSeverity(service.status);
  if (!severity) {
    if (service.status === "healthy") {
      await resolveActiveAlert(service.id);
    }
    return;
  }

  const supabase = getSupabaseServerAdmin();
  const existing = await getActiveAlert(service.id);
  const now = nowIso();

  if (!existing) {
    const { data, error } = await supabase
      .from("monitoring_alerts")
      .insert({
        service_id: service.id,
        severity,
        status: "open",
        title: `${service.name} needs attention`,
        message: service.message,
        trigger: ATTENTION_TRIGGER,
        metadata: service.metadata ?? {},
        last_notified_at: now,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    await notifyMonitoringAlert(service, data as MonitoringAlertRecord);
    return;
  }

  const shouldNotify = existing.severity !== severity;
  const updatePayload = {
    severity,
    title: `${service.name} needs attention`,
    message: service.message,
    metadata: service.metadata ?? {},
    status: existing.status,
    last_notified_at: shouldNotify ? now : existing.last_notified_at,
  };

  const { data, error } = await supabase
    .from("monitoring_alerts")
    .update(updatePayload)
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  if (shouldNotify) {
    await notifyMonitoringAlert(service, data as MonitoringAlertRecord);
  }
}

export async function persistMonitoringCheck(check: MonitoringCheckResult) {
  const service = await upsertService(check);
  await upsertAlertForService(service);
  return service;
}

export async function collectHealthChecks() {
  const checks = await Promise.all([checkSupabaseRest(), checkSupabaseEdgeFunction(), checkPublicHealthEndpoint()]);
  return checks;
}

export async function getPublicHealthSnapshot() {
  const checks = await collectHealthChecks();
  const hasFailure = checks.some((check) => check.status === "failed");
  const hasWarning = checks.some((check) => check.status === "warning");

  return {
    status: hasFailure ? "failed" : hasWarning ? "degraded" : "healthy",
    checkedAt: nowIso(),
    checks,
  };
}

export async function loadMonitoringOverview(): Promise<MonitoringOverview> {
  const supabase = getSupabaseServerAdmin();
  const [{ data: services, error: servicesError }, { data: alerts, error: alertsError }] = await Promise.all([
    supabase.from("monitoring_services").select("*").order("category").order("name"),
    supabase
      .from("monitoring_alerts")
      .select("*")
      .in("status", [...ACTIVE_ALERT_STATES])
      .order("created_at", { ascending: false }),
  ]);

  if (servicesError) throw new Error(servicesError.message);
  if (alertsError) throw new Error(alertsError.message);

  const serviceRows = (services ?? []) as MonitoringServiceRecord[];
  const alertRows = (alerts ?? []) as MonitoringAlertRecord[];

  return {
    checkedAt: nowIso(),
    services: serviceRows,
    alerts: alertRows,
    summary: toSummary(serviceRows, alertRows),
  };
}

export async function runMonitoringSweep() {
  const [checks, automationChecks] = await Promise.all([collectHealthChecks(), checkAutomationHeartbeats()]);
  for (const check of [...checks, ...automationChecks]) {
    await persistMonitoringCheck(check);
  }
  return loadMonitoringOverview();
}

export async function acknowledgeMonitoringAlert(alertId: string) {
  const supabase = getSupabaseServerAdmin();
  const { error } = await supabase
    .from("monitoring_alerts")
    .update({
      status: "acknowledged",
      acknowledged_at: nowIso(),
    })
    .eq("id", alertId)
    .in("status", ["open"]);

  if (error) throw new Error(error.message);
}

export async function resolveMonitoringAlert(alertId: string) {
  const supabase = getSupabaseServerAdmin();
  const { error } = await supabase
    .from("monitoring_alerts")
    .update({
      status: "resolved",
      resolved_at: nowIso(),
    })
    .eq("id", alertId)
    .in("status", [...ACTIVE_ALERT_STATES]);

  if (error) throw new Error(error.message);
}
