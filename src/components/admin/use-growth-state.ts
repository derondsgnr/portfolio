"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchGrowthState, saveGrowthState } from "@/app/admin/actions";
import { getAdminErrorMessage } from "@/lib/admin/feedback";
import { DEFAULT_GROWTH_STATE, type GrowthState } from "./growth-os";

const LOCAL_GROWTH_STATE_KEY = "admin_growth_state";

function loadLocalState(): GrowthState {
  try {
    const raw = localStorage.getItem(LOCAL_GROWTH_STATE_KEY);
    if (!raw) return DEFAULT_GROWTH_STATE;
    const parsed = JSON.parse(raw) as GrowthState;
    return {
      ...DEFAULT_GROWTH_STATE,
      ...parsed,
      settings: {
        ...DEFAULT_GROWTH_STATE.settings,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    return DEFAULT_GROWTH_STATE;
  }
}

function persistLocalState(state: GrowthState) {
  localStorage.setItem(LOCAL_GROWTH_STATE_KEY, JSON.stringify(state));
}

export function useGrowthState() {
  const [state, setState] = useState<GrowthState>(DEFAULT_GROWTH_STATE);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const local = loadLocalState();
    setState(local);

    let cancelled = false;
    async function run() {
      const result = await fetchGrowthState();
      if (cancelled) return;
      if (result.ok) {
        setState(result.state);
        persistLocalState(result.state);
        setSyncStatus("idle");
        setSyncMessage(null);
      } else {
        setSyncStatus("error");
        setSyncMessage(
          `Loaded local Growth OS state, but couldn't sync from the server. ${getAdminErrorMessage(result.error)}`
        );
      }
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const patchState = useCallback(async (updater: (current: GrowthState) => GrowthState) => {
    let nextState: GrowthState | null = null;
    setState((current) => {
      const next = updater(current);
      nextState = next;
      persistLocalState(next);
      return next;
    });

    if (!nextState) return false;

    setSyncStatus("saving");
    setSyncMessage("Syncing Growth OS state...");

    const result = await saveGrowthState(nextState);
    if (result.ok) {
      setSyncStatus("ok");
      setSyncMessage("Growth OS state synced.");
      window.setTimeout(() => {
        setSyncStatus((current) => (current === "ok" ? "idle" : current));
        setSyncMessage((current) => (current === "Growth OS state synced." ? null : current));
      }, 2500);
      return true;
    }

    setSyncStatus("error");
    setSyncMessage(
      `Saved locally, but couldn't sync Growth OS state to the server. ${getAdminErrorMessage(result.error)}`
    );
    return false;
  }, []);

  return { state, loading, patchState, syncStatus, syncMessage };
}
