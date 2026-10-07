# Connections

Every tool this assistant can reach, and what it's allowed to do there. Skills read this file
to decide whether to pull live data or ask the user to paste it.

## Tiers

| Tier | Allowed | Who can use it |
|---|---|---|
| 0: Files | Read files the user drops in (CSV exports, HTML, screenshots) | Every skill |
| 1: Read | Read records and reports from a live tool | Every skill |
| 2: Write (safe) | Create or update tasks, tickets, docs, draft records | Plan, QA, retro skills |
| 3: Send / publish | Send email, publish pages, launch ads, delete records | `/launch` only, behind `send-guard` |

## Registry

| Tool | Used for | Status | Tier allowed | Method | Reference |
|---|---|---|---|---|---|
| HubSpot | Email, landing pages, forms, lists | not connected | 1 (3 via `/launch`) | API (private app token) | `references/hubspot.md` |
| Salesforce | CRM campaigns, leads, attribution | not connected | 1 (2 for campaign setup) | API | `references/salesforce.md` |
| Asana | Marketing tasks, campaign boards | not connected | 2 | API (PAT) or MCP | `references/asana.md` |
| Jira | Web and dev requests | not connected | 2 | API (token) or MCP | `references/jira.md` |
| Claude in Chrome | Browser QA | not connected | 1 (reads pages, submits test forms only) | Extension | n/a |
| GA4 | Web analytics | not connected | 1 | API | `references/ga4.md` |
| Slack | Alerts, approvals | not connected | 2 | API or MCP | `references/slack.md` |

Status values: `not connected` · `connected` · `broken (date, reason)`.

## Rules

- Prefer direct APIs with a saved endpoint reference in `references/` over loading many MCP
  servers. It uses fewer tokens.
- Give the assistant its own service account with the least permissions it needs.
- Keys live in `.env` (see `.env.example`). Never paste keys into chat or commit them.
- When a connection breaks, set its status to `broken`, note why, and fall back to Tier 0.
