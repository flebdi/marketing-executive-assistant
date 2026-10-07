# Marketing Executive Assistant

> **Status:** v0, in development (private). Full README ships in Phase 5.

A Claude Code template that turns Claude into a virtual marketing team. It's built from two
parts:

- **Foundation:** the Four Cs of an AI operating system (context, connections, capabilities,
  cadence), from Nate Herk's AIS-OS.
- **Workflow:** a campaign sprint of specialist roles as slash commands, adapted from Garry
  Tan's gstack.

## The sprint

**Brief → Plan → Create → Review → QA → Launch → Watch → Retro**

| Stage | Skill | Role | Writes |
|---|---|---|---|
| Brief | `/campaign-office-hours` | Marketing partner | `brief.md` |
| Plan | `/plan-cmo-review` | CMO | `plan-cmo.md` |
| Plan | `/plan-ops-review` | MOps lead | `plan-ops.md` |
| Plan | `/plan-brand-review` | Brand lead | `plan-brand.md` |
| Create | `/creative-shotgun` | Creative director | `creative/` |
| Review | `/copy-review` | Senior editor | `review-copy.md` |
| Review | `/compliance-review` | Compliance officer | `review-compliance.md` |
| QA | `/campaign-qa` | QA lead | `qa-report.md` |
| Launch | `/launch` | Launch manager | `launch.md` |
| Watch | `/launch-watch` | Campaign analyst | `watch.md` |
| Retro | `/campaign-retro` | Marketing manager | `retro.md` |

## The campaign folder contract

Every campaign lives in `campaigns/<YYYY-MM-slug>/`. Each skill reads what it needs from that
folder and writes exactly one file back. `status.md` tracks the stage, the review scores
(0 to 10, pass at 7), and any logged overrides. Nothing is sent or published unless every
gate passes and a human confirms.

## Getting started (today)

1. Open this folder in VS Code and start Claude Code.
2. Fill in `BRAND.md` and `context/` (or run `/onboard-marketing` once it ships in Phase 1).
3. Copy `campaigns/_template/` to start a campaign.

## Default stack

HubSpot (email, landing pages, forms) · Salesforce (CRM) · Asana (tasks) · Jira (web/dev
requests) · Claude in Chrome (browser QA). Swap any of them in `connections.md`.

## Roadmap

See `PLAN-marketing-executive-assistant.md`.

## Credits

Adapted from [gstack](https://github.com/garrytan/gstack) by Garry Tan (MIT) and AIS-OS by
Nate Herk (MIT). See `NOTICE.md`.
