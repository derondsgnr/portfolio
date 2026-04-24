import { Resend } from "resend";
import type { MonitoringAlertRecord, MonitoringServiceRecord } from "./types";

function getDashboardUrl() {
  const siteUrl =
    process.env.MONITORING_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!siteUrl) return null;
  const normalized = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  return `${normalized.replace(/\/$/, "")}/admin/automations`;
}

async function sendWebhookNotification(service: MonitoringServiceRecord, alert: MonitoringAlertRecord) {
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL;
  if (!webhookUrl) return;
  const dashboardUrl = getDashboardUrl();
  const isSlackWebhook =
    process.env.MONITORING_WEBHOOK_KIND === "slack" || webhookUrl.includes("hooks.slack.com/");

  const basePayload = {
    text: `Monitoring alert: ${service.name} is ${service.status}`,
    service: {
      id: service.id,
      name: service.name,
      status: service.status,
      target: service.target,
    },
    alert: {
      id: alert.id,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      trigger: alert.trigger,
    },
    dashboardUrl,
  };

  const slackPayload = {
    text: `Monitoring alert: ${service.name} is ${service.status}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Monitoring: ${service.name}`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Status*\n${service.status}`,
          },
          {
            type: "mrkdwn",
            text: `*Severity*\n${alert.severity}`,
          },
          {
            type: "mrkdwn",
            text: `*Service ID*\n${service.id}`,
          },
          {
            type: "mrkdwn",
            text: `*Trigger*\n${alert.trigger}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Reason*\n${alert.message ?? "No details provided."}`,
        },
      },
      ...(service.target
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Target*\n${service.target}`,
              },
            },
          ]
        : []),
      ...(dashboardUrl
        ? [
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Open dashboard",
                  },
                  url: dashboardUrl,
                },
              ],
            },
          ]
        : []),
    ],
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isSlackWebhook ? slackPayload : basePayload),
  });
}

async function sendEmailNotification(service: MonitoringServiceRecord, alert: MonitoringAlertRecord) {
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.MONITORING_ALERT_EMAIL ?? process.env.CONTACT_EMAIL;
  if (!resendKey || !toEmail) return;

  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const dashboardUrl = getDashboardUrl();

  await resend.emails.send({
    from,
    to: toEmail,
    subject: `[Monitoring] ${service.name} needs attention`,
    html: `
      <p><strong>Service:</strong> ${service.name}</p>
      <p><strong>Status:</strong> ${service.status}</p>
      <p><strong>Severity:</strong> ${alert.severity}</p>
      <p><strong>Reason:</strong> ${alert.message ?? "No details provided."}</p>
      ${dashboardUrl ? `<p><a href="${dashboardUrl}">Open monitoring dashboard</a></p>` : ""}
    `,
  });
}

export async function notifyMonitoringAlert(service: MonitoringServiceRecord, alert: MonitoringAlertRecord) {
  await Promise.allSettled([sendWebhookNotification(service, alert), sendEmailNotification(service, alert)]);
}
