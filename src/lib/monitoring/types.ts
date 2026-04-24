export type MonitoringServiceCategory = "platform" | "route" | "automation" | "integration";
export type MonitoringServiceStatus = "healthy" | "warning" | "failed" | "unknown";
export type MonitoringAlertSeverity = "warning" | "critical";
export type MonitoringAlertStatus = "open" | "acknowledged" | "resolved";

export type MonitoringCheckResult = {
  serviceId: string;
  name: string;
  category: MonitoringServiceCategory;
  status: MonitoringServiceStatus;
  message: string;
  target?: string;
  responseTimeMs?: number | null;
  expectedIntervalMinutes?: number | null;
  metadata?: Record<string, unknown>;
};

export type MonitoringServiceRecord = {
  id: string;
  name: string;
  category: MonitoringServiceCategory;
  status: MonitoringServiceStatus;
  target: string | null;
  message: string | null;
  response_time_ms: number | null;
  consecutive_failures: number;
  expected_interval_minutes: number | null;
  last_checked_at: string | null;
  last_success_at: string | null;
  last_failure_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type MonitoringAlertRecord = {
  id: string;
  service_id: string;
  severity: MonitoringAlertSeverity;
  status: MonitoringAlertStatus;
  title: string;
  message: string | null;
  trigger: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  last_notified_at: string | null;
};

export type MonitoringOverview = {
  checkedAt: string;
  services: MonitoringServiceRecord[];
  alerts: MonitoringAlertRecord[];
  summary: {
    healthy: number;
    warning: number;
    failed: number;
    unknown: number;
    openAlerts: number;
    acknowledgedAlerts: number;
  };
};
