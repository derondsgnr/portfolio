"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchGrowthState, saveGrowthState } from "@/app/admin/actions";
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
      }
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const patchState = useCallback(async (updater: (current: GrowthState) => GrowthState) => {
    setState((current) => {
      const next = updater(current);
      persistLocalState(next);
      void saveGrowthState(next);
      return next;
    });
  }, []);

  return { state, loading, patchState };
}
