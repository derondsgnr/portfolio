"use server";

import { getAdminSession } from "@/lib/admin/auth";
import { hasAdminCapability } from "@/lib/admin/permissions";
import {
  acknowledgeMonitoringAlert,
  loadMonitoringOverview,
  resolveMonitoringAlert,
  runMonitoringSweep,
} from "@/lib/monitoring/health";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.authenticated || !session.role) throw new Error("Unauthorized");
  if (!hasAdminCapability(session.role, "monitoring")) throw new Error("Forbidden");
}

export async function fetchMonitoringOverview() {
  try {
    await requireAdmin();
    const overview = await loadMonitoringOverview();
    return { ok: true, overview };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to load monitoring overview.",
    };
  }
}

export async function triggerMonitoringSweep() {
  try {
    await requireAdmin();
    const overview = await runMonitoringSweep();
    return { ok: true, overview };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to run monitoring sweep.",
    };
  }
}

export async function acknowledgeAlertAction(alertId: string) {
  try {
    await requireAdmin();
    await acknowledgeMonitoringAlert(alertId);
    const overview = await loadMonitoringOverview();
    return { ok: true, overview };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to acknowledge alert.",
    };
  }
}

export async function resolveAlertAction(alertId: string) {
  try {
    await requireAdmin();
    await resolveMonitoringAlert(alertId);
    const overview = await loadMonitoringOverview();
    return { ok: true, overview };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to resolve alert.",
    };
  }
}
