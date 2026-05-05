import { readContentJson } from "./live-source";

/** Custom analytics/tracking integration (Plausible, Fathom, Hotjar, etc.) */
export type ExtraIntegration = {
  key: string;
  label: string;
  enabled: boolean;
  scriptUrl?: string;
  config?: Record<string, string>;
};

export type IntegrationsConfig = {
  googleAnalytics: { enabled: boolean; measurementId: string };
  googleTagManager: { enabled: boolean; containerId: string };
  extra?: ExtraIntegration[];
};

const DEFAULT: IntegrationsConfig = {
  googleAnalytics: { enabled: false, measurementId: "" },
  googleTagManager: { enabled: false, containerId: "" },
  extra: [],
};

export async function getIntegrations(): Promise<IntegrationsConfig> {
  try {
    const parsed = await readContentJson<Partial<IntegrationsConfig>>("integrations.json");
    if (!parsed) throw new Error("missing integrations");
    const merged: IntegrationsConfig = {
      googleAnalytics: { ...DEFAULT.googleAnalytics, ...parsed.googleAnalytics },
      googleTagManager: { ...DEFAULT.googleTagManager, ...parsed.googleTagManager },
      extra: Array.isArray(parsed.extra) ? parsed.extra : [],
    };

    // Env overrides (build-time): non-secret IDs can be set via env
    const gaEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (gaEnv) merged.googleAnalytics.measurementId = gaEnv;

    const gtmEnv = process.env.NEXT_PUBLIC_GTM_ID;
    if (gtmEnv) merged.googleTagManager.containerId = gtmEnv;

    return merged;
  } catch {
    const merged: IntegrationsConfig = { ...DEFAULT };
    const gaEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (gaEnv) merged.googleAnalytics.measurementId = gaEnv;
    const gtmEnv = process.env.NEXT_PUBLIC_GTM_ID;
    if (gtmEnv) merged.googleTagManager.containerId = gtmEnv;
    return merged;
  }
}
