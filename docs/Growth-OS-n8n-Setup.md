# Growth OS n8n Setup

This guide connects your `n8n` workflows to your admin dashboard automation health panel.

## What you already have

- Dashboard page: `/admin/automations`
- Heartbeat endpoint pattern:
  - `https://<your-project-id>.supabase.co/functions/v1/make-server-3fa6479f/admin/growth/heartbeat`
- Accepted payload:

```json
{
  "automationId": "au-01",
  "health": "healthy",
  "throughput": "3 posts generated",
  "lastRun": "just now"
}
```

`automationId` values currently in your app:

- `au-01` -> Daily Text Post Builder
- `au-02` -> Comment Reply Assistant
- `au-03` -> Lead Harvest (Reddit + LinkedIn)
- `au-04` -> Cold Outreach Sequencer

Importable skeleton files in this repo:

- `docs/n8n-growth-os-workflows.template.json`
- `docs/n8n-growth-os-workflows.with-branches.template.json` (branched examples for `au-01` and `au-03`; mirror same pattern for `au-02`/`au-04`)

Before importing:

1. open the JSON file
2. replace every `REPLACE_WITH_SUPABASE_ANON_KEY`
3. replace every `REPLACE_WITH_SUPABASE_PROJECT_ID`
4. save
5. in n8n: `Workflows -> Import from file`

After import:

- each workflow has:
  - `Schedule Trigger`
  - `Set Heartbeat Payload` (or branch sets)
  - `POST Heartbeat`
- add your real generation/scraping/sending nodes **between** trigger and Set
- keep the final `POST Heartbeat` node at the end

Branching template notes:

- uses placeholder `Set Metrics (Replace from real nodes)` node
- connect your real pipeline into that node output
- default branch logic:
  - `au-01`, `au-02`: warning if `failedCount > 0`
  - `au-03`: warning if `flaggedCount > 3`
  - `au-04`: paused if `blockedByPolicy = true`, else warning if `failedCount > 0`, else healthy

---

## Metrics Contract (Plug-and-Play)

Every workflow should output a normalized metrics object before heartbeat logic.

| Workflow | Required fields | Optional fields | Notes |
| --- | --- | --- | --- |
| `au-01` Daily Text Post Builder | `postCount` (number), `failedCount` (number) | `errorMessage` (string) | Warning branch uses `failedCount > 0` |
| `au-02` Comment Reply Assistant | `replyDrafts` (number), `failedCount` (number) | `errorMessage` (string) | Warning branch uses `failedCount > 0` |
| `au-03` Lead Harvest | `newLeadCount` (number), `flaggedCount` (number) | `failedCount` (number) | Warning branch uses `flaggedCount > 3` |
| `au-04` Outreach Sequencer | `sentCount` (number), `replyCount` (number), `failedCount` (number), `blockedByPolicy` (boolean) | `errorMessage` (string) | Paused branch checks `blockedByPolicy` first |

### Safe defaults

If a metric is unavailable, provide these defaults:

- numbers: `0`
- booleans: `false`
- strings: `""`

### Normalization snippet (Code node)

Use this right before branching/heartbeat:

```javascript
return [{
  postCount: $json.postCount ?? 0,
  replyDrafts: $json.replyDrafts ?? 0,
  newLeadCount: $json.newLeadCount ?? 0,
  flaggedCount: $json.flaggedCount ?? 0,
  sentCount: $json.sentCount ?? 0,
  replyCount: $json.replyCount ?? 0,
  failedCount: $json.failedCount ?? 0,
  blockedByPolicy: $json.blockedByPolicy ?? false,
  errorMessage: $json.errorMessage ?? ""
}];
```
