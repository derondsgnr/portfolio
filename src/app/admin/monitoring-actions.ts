"use server";

import { verifyAdminSession } from "@/lib/admin/auth";
import {
  acknowledgeMonitoringAlert,
  loadMonitoringOverview,
  resolveMonitoringAlert,
  runMonitoringSweep,
} from "@/lib/monitoring/health";

async function requireAdmin() {
  const ok = await verifyAdminSession();
  if (!ok) throw new Error("Unauthorized");
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
