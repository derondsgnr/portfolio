import { readFile } from "fs/promises";
import path from "path";

export type IntegrationsConfig = {
  googleAnalytics: { enabled: boolean; measurementId: string };
  googleTagManager: { enabled: boolean; containerId: string };
};

const DEFAULT: IntegrationsConfig = {
  googleAnalytics: { enabled: false, measurementId: "" },
  googleTagManager: { enabled: false, containerId: "" },
};

export async function getIntegrations(): Promise<IntegrationsConfig> {
  try {
    const filePath = path.join(process.cwd(), "content", "integrations.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<IntegrationsConfig>;
    const merged = {
      googleAnalytics: { ...DEFAULT.googleAnalytics, ...parsed.googleAnalytics },
      googleTagManager: { ...DEFAULT.googleTagManager, ...parsed.googleTagManager },
    };

    // Env overrides (build-time): non-secret IDs can be set via env
    const gaEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (gaEnv) merged.googleAnalytics.measurementId = gaEnv;

    const gtmEnv = process.env.NEXT_PUBLIC_GTM_ID;
    if (gtmEnv) merged.googleTagManager.containerId = gtmEnv;

    return merged;
  } catch {
    const merged = { ...DEFAULT };
    const gaEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (gaEnv) merged.googleAnalytics.measurementId = gaEnv;
    const gtmEnv = process.env.NEXT_PUBLIC_GTM_ID;
    if (gtmEnv) merged.googleTagManager.containerId = gtmEnv;
    return merged;
  }
}
