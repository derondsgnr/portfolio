# Monitoring Setup

This project now has:

- `GET /api/health` for public health checks
- `GET/POST /api/monitor/run` for scheduled monitoring sweeps
- Supabase SQL tables for service status, alerts, and automation heartbeats
- Slack/email/webhook notifications for incidents

## What "step 2" means

Deploy the updated Supabase Edge Function so heartbeat events are stored in the new `automation_heartbeats` table.

If you skip this, the dashboard can still run direct checks, but external automation heartbeats will not be persisted correctly.

## What "step 3" means

Add the new monitoring environment variables where the app runs:

- locally in `.env`
- in Vercel project settings for production/preview

If you skip this, cron auth and deployed-site health probing will not work correctly.

## 1. Apply the Supabase migration

Use the Supabase CLI from the repo root:

```bash
supabase link --project-ref "$NEXT_PUBLIC_SUPABASE_PROJECT_ID"
supabase db push
```

If the project is already linked, only run:

```bash
supabase db push
```

## 2. Deploy the Supabase Edge Function

This deploys the updated heartbeat handler:

```bash
supabase functions deploy make-server-3fa6479f
```

If you are not logged in yet:

```bash
supabase login
supabase functions deploy make-server-3fa6479f
```

## 3. Set the new env vars

### Local `.env`

Add these keys:

```bash
MONITORING_SITE_URL=https://your-domain.com
MONITORING_CRON_SECRET=replace-with-a-long-random-secret
# Optional
# MONITORING_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
# MONITORING_WEBHOOK_KIND=slack
# MONITORING_ALERT_EMAIL=alerts@yourdomain.com
```

### Vercel dashboard

Add the same values in Project Settings -> Environment Variables.

At minimum, production should have:

- `MONITORING_SITE_URL`
- `CRON_SECRET` or `MONITORING_CRON_SECRET`

Recommended:

- `MONITORING_WEBHOOK_URL`
- `MONITORING_ALERT_EMAIL`

### Vercel CLI alternative

```bash
vercel env add MONITORING_SITE_URL production
vercel env add CRON_SECRET production
vercel env add MONITORING_WEBHOOK_URL production
vercel env add MONITORING_ALERT_EMAIL production
```

Repeat for `preview` if you want monitoring there too.

## 4. Cron behavior

`vercel.json` schedules:

```json
{
  "crons": [
    {
      "path": "/api/monitor/run",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Vercel will call that route automatically after deploy.

## 5. Slack webhook setup

Create a Slack Incoming Webhook and set:

```bash
MONITORING_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

The app auto-detects Slack webhook URLs and sends Block Kit payloads. If you use a proxy webhook in front of Slack, also set:

```bash
MONITORING_WEBHOOK_KIND=slack
```

## 6. Example heartbeat payload

External automations should POST to:

```text
https://<project-ref>.supabase.co/functions/v1/make-server-3fa6479f/admin/growth/heartbeat
```

With JSON like:

```json
{
  "automationId": "au-02",
  "health": "healthy",
  "throughput": "6 drafts",
  "checkedAt": "2026-04-23T10:00:00.000Z",
  "source": "n8n"
}
```

## 7. Quick manual test

Run a sweep locally:

```bash
curl -H "Authorization: Bearer $MONITORING_CRON_SECRET" http://localhost:3000/api/monitor/run
```

Trigger a warning heartbeat:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"automationId":"au-02","health":"warning","throughput":"2 drafts","source":"manual-test"}' \
  "https://$NEXT_PUBLIC_SUPABASE_PROJECT_ID.supabase.co/functions/v1/make-server-3fa6479f/admin/growth/heartbeat"
```

