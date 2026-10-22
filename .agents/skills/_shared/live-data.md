# Live data protocol

How a skill gets real numbers from connected tools, and what it does when it can't. Skills
that list **Data needs** read this file after the preamble.

The goal: every figure in a plan or review is either **pulled and cited**, **given by the
user and cited**, or **`TBD (needs: <source>)`**. Nothing in between. No estimates dressed
up as data.

## 1. Check what's reachable

For each tool a skill's data needs mention:

1. **Registry:** read its row in `connections.md` (status and tier allowed).
2. **Session:** check whether a matching tool is actually available in this session (an MCP
   connector such as `mcp__*hubspot*`, `mcp__*salesforce*`, `mcp__*asana*`, `mcp__*atlassian*`,
   or a key in `.env` used through the endpoints in `references/<tool>.md`).
3. Decide:

| Registry says | Available in session | Do this |
|---|---|---|
| `connected` | yes | Pull (section 2). |
| `not connected` | yes | Run one small read-only test call (e.g. fetch one record or a count). If it works, set the row to `connected (verified YYYY-MM-DD)` and pull. If not, fall back. |
| `connected` | no | Fall back. Tell the user the connector isn't loaded in this session and how to load it (`/mcp` or claude.ai connector settings). Don't change the registry. |
| `broken` or `not connected` | no | Fall back. |
| any | call fails (auth, permission, timeout) | Fall back. Set the row to `broken (YYYY-MM-DD, <reason>)`. |

Never ask the user for a key or token in chat. Keys live in `.env` only.

## 2. Pull rules

- **Read only.** Planning and review skills only read (tier 1). Creating tasks or tickets
  (tier 2) needs the user's approval in the session and the tool's tier to allow it. Never
  send, publish, schedule, update, or delete anything. That belongs to `/launch` alone.
- **Aggregates, not people.** Pull counts, rates, sums, and dates. Never write names, emails,
  phone numbers, or other personal data into campaign files or chat. Campaign files are
  committed to git. If a tool can only return records, count them in the session and keep
  only the totals. Account (company) names are allowed where the plan needs them, such as a
  target-account list, unless `context/channels.md` says otherwise.
- **Pull only what the data needs list asks for.** Don't browse the CRM. Each connector call
  costs tokens and time.
- **Use the team's definitions.** Use the stages, statuses, and field meanings from
  `context/` and `playbooks/naming-conventions.md`. If the data doesn't match them (e.g.
  campaign types named differently), say so instead of guessing which records count.
- **Sanity-check before using.** Flag zero counts, rates above 100%, campaigns with no end
  date, or sample sizes under 3 comparable campaigns. Use flagged numbers only with a caveat
  next to them.

## 3. Cite every figure

Every skill output that uses data ends with a **Data sources** table. The values below only
show the format. They are not real data and must never be reused:

| Figure | Value | Source | Query or report | Pulled |
|---|---|---|---|---|
| Past event attendance rate | 44% (3 events) | Salesforce | Campaigns, Type = Event, 2024-01 to 2026-09: attended ÷ registered member statuses | 2026-10-13 |
| Persona contacts, North America | 1,240 | HubSpot | Contacts with job title matching persona in `context/audiences.md`, region NA, subscribed | 2026-10-13 |
| Event-site lead time | TBD (needs: Jira access or web team estimate) | — | — | — |

In the body, mark each figure with where it came from: `(Salesforce)`, `(user)`, or `TBD`.

Pulled data is a snapshot. If a skill reruns more than 7 days later, pull again.

## 4. Fall back to TBD

When a figure can't be pulled:

- Write `TBD (needs: <what>, from <tool or person>)`, e.g.
  `TBD (needs: past event attendance rate, from Salesforce or the events lead)`.
- Ask the user once if they know the number. If they give it, mark it `(user)` and cite them
  in Data sources.
- Never fill the gap with an industry benchmark presented as the team's number. A benchmark
  may appear only labelled `(benchmark, <source>, not our data)`, and never as the basis for
  a gate score on its own.
- **Lower the score if a missing number blocks the call.** If the gate depends on a figure
  (e.g. the goal math can't be checked without conversion rates), say so, and cap the score
  at 6 until the number arrives. The user can override with a logged reason.

## 5. Tell the user what happened

Before the skill's main output, give one short block:

> **Data:** pulled from Salesforce (4 figures) and HubSpot (2). Asana not connected:
> team capacity is TBD. Jira connector not loaded in this session.

## Data needs by skill

What each skill tries to pull. Exact endpoints go in `references/<tool>.md` once the tool is
connected. Field names are standard defaults; the team's setup may differ.

### `/plan-cmo-review`

| Need | Tool | What to pull |
|---|---|---|
| Funnel rates from comparable past campaigns | Salesforce | Campaigns of the same Type (e.g. Event, Webinar) over the last 24 months: members by status (registered, attended), `NumberOfOpportunities`, `AmountAllOpportunities`, `NumberOfWonOpportunities`, `ActualCost` |
| Cost per attendee and per opportunity | Salesforce | `ActualCost` ÷ attended members; ÷ opportunities |
| Fit with quarterly goals | Salesforce | Pipeline target vs current pipeline for the period in `context/company.md` |
| Team capacity in the campaign window | Asana | Open tasks and active projects per marketing team member with due dates in the window |
| Demand signals | HubSpot, GA4 | Engagement with related content in the last 90 days (email clicks, page views on related pages) |

### `/plan-ops-review`

| Need | Tool | What to pull |
|---|---|---|
| Audience size per segment | HubSpot | Count of subscribed contacts matching each segment in the brief, after suppression lists |
| Send frequency already planned for that audience | HubSpot, `context/calendar.md` | Scheduled emails to overlapping lists in the campaign window |
| Existing campaign hierarchy and naming | Salesforce | Parent campaigns and member status values for the campaign Type |
| Form and field availability | HubSpot | Whether the form fields the brief needs exist as contact properties |
| Build lead time | Jira | Open issues and median time-to-done for landing-page tickets in the web team's project, last 6 months |
| Consent coverage | HubSpot | Count of the target audience with a recorded consent basis, by region (GDPR, CASL) |

### `/plan-brand-review`

| Need | Tool | What to pull |
|---|---|---|
| What has worked for this audience | HubSpot | Open and click rates of the last 10 emails to the same persona or list, with subject lines |
| Past learnings | `learnings/learnings.md` | Entries tagged with this audience or channel (always available) |

### `/creative-shotgun`

| Need | Tool | What to pull |
|---|---|---|
| Subject lines that worked for this audience | HubSpot | Subject line, open rate, and click rate of the last 10 emails to the same persona or list |
| Past picks and results | `campaigns/*/creative/variants/`, `campaigns/*/retro.md`, `learnings/learnings.md` | Pick sections, cited results, `tactic:taste` and `tactic:subject-line` entries (always available) |

### `/compliance-review`

| Need | Tool | What to pull |
|---|---|---|
| Consent coverage | HubSpot | Count of the target segment by region, and how many in each region have the consent basis `context/channels.md` requires |

### `/campaign-qa`

QA reads single test records it created itself, which hold no real personal data.

| Need | Tool | What to pull |
|---|---|---|
| Test form record landed | HubSpot | The test contact by its test email: exists, form submission recorded, list memberships |
| Test record synced | Salesforce | The test lead or contact: exists, campaign member of this campaign, member status |

### `/campaign-retro`

Find records by the campaign's `utm_campaign` slug and Salesforce campaign name from
`plan-ops.md`. Week mode pulls only the goal metric per launched campaign.

| Need | Tool | What to pull |
|---|---|---|
| Goal metric actual | Whichever tool the brief's metric lives in | The metric as the brief defines it, over the brief's date range |
| Email funnel | HubSpot | Per email: sent, delivered, opens, clicks, unsubscribes, bounces |
| Page and form funnel | HubSpot, GA4 | Sessions with this `utm_campaign`, form submissions, by `utm_source` and `utm_content` |
| CRM outcome | Salesforce | Campaign members by status, `NumberOfOpportunities`, `AmountAllOpportunities`, `NumberOfWonOpportunities`, `ActualCost` |
| Paid results | The ad platform, if connected | Spend, impressions, clicks, conversions per ad variant |
| Comparison | `campaigns/*/retro.md` | Cited results of past campaigns to the same persona or of the same type (always available) |

### `/autoplan-campaign`

Pulls nothing itself. Each review pulls its own data. It reports one combined Data block.
