import type { MonitoringServiceCategory } from "./types";

export type AutomationMonitorConfig = {
  automationId: string;
  name: string;
  expectedIntervalMinutes: number;
};

export type BaseServiceConfig = {
  serviceId: string;
  name: string;
  category: MonitoringServiceCategory;
  target?: string;
};

export const DEFAULT_AUTOMATION_MONITORS: AutomationMonitorConfig[] = [
  { automationId: "au-01", name: "Daily Text Post Builder", expectedIntervalMinutes: 36 * 60 },
  { automationId: "au-02", name: "Comment Reply Assistant", expectedIntervalMinutes: 90 },
  { automationId: "au-03", name: "Lead Harvest (Reddit + LinkedIn)", expectedIntervalMinutes: 8 * 60 },
  { automationId: "au-04", name: "Cold Outreach Sequencer", expectedIntervalMinutes: 36 * 60 },
];

export function getAutomationServiceId(automationId: string) {
  return `automation:${automationId}`;
}
