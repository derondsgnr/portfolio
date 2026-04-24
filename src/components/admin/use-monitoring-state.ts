"use client";

import { useCallback, useEffect, useState } from "react";
import {
  acknowledgeAlertAction,
  fetchMonitoringOverview,
  resolveAlertAction,
  triggerMonitoringSweep,
} from "@/app/admin/monitoring-actions";
import { getAdminErrorMessage } from "@/lib/admin/feedback";
import type { MonitoringOverview } from "@/lib/monitoring/types";

type ActionResult = {
  ok: boolean;
  overview?: MonitoringOverview;
  error?: string;
};

export function useMonitoringState() {
  const [overview, setOverview] = useState<MonitoringOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const result = await fetchMonitoringOverview();
      if (cancelled) return;
      if (result.ok) {
        setOverview(result.overview ?? null);
        setError(null);
        setNotice(null);
      } else {
        setError(getAdminErrorMessage(result.error ?? "Failed to load monitoring overview."));
      }
      setLoading(false);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const applyResult = useCallback((result: ActionResult, successMessage: string) => {
    if (!result.ok) {
      setError(getAdminErrorMessage(result.error ?? "Monitoring action failed."));
      setNotice(null);
      return false;
    }
    setOverview(result.overview ?? null);
    setError(null);
    setNotice(successMessage);
    return true;
  }, []);

  const runSweep = useCallback(async () => {
    setRunning(true);
    setNotice(null);
    try {
      return applyResult(
        await triggerMonitoringSweep(),
        "Monitoring sweep finished. Service status and alerts are up to date."
      );
    } finally {
      setRunning(false);
    }
  }, [applyResult]);

  const acknowledge = useCallback(
    async (alertId: string) => {
      setRunning(true);
      setNotice(null);
      try {
        return applyResult(
          await acknowledgeAlertAction(alertId),
          "Alert acknowledged. It will remain visible until resolved."
        );
      } finally {
        setRunning(false);
      }
    },
    [applyResult]
  );

  const resolve = useCallback(
    async (alertId: string) => {
      setRunning(true);
      setNotice(null);
      try {
        return applyResult(
          await resolveAlertAction(alertId),
          "Alert resolved. Monitoring overview refreshed."
        );
      } finally {
        setRunning(false);
      }
    },
    [applyResult]
  );

  return { overview, loading, running, error, notice, runSweep, acknowledge, resolve };
}
