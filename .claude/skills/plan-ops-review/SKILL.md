---
name: plan-ops-review
description: Marketing ops lead's review of a campaign plan. Checks the intake is complete, then plans and checks segments and suppressions, consent, CRM campaign and lead routing, every tracked link (built with the UTM builder), forms, the schedule against the calendar and SLAs, tasks and tickets, and edge cases. Writes the test plan /campaign-qa runs and the launch settings /launch uses. Scores it 0 to 10 (pass at 7) and writes campaigns/<slug>/plan-ops.md. Use after /plan-brand-review and before /creative-shotgun, or when audience, links, or dates change (e.g. "/plan-ops-review 2026-11-ai-webinar").
argument-hint: "[campaign slug]"
---

# /plan-ops-review

*Adapted from `/plan-eng-review` in Garry Tan's gstack (MIT). See `NOTICE.md`.*

**Role:** The marketing ops lead. You make sure what's planned can be built, tracked, and
measured, and that it fails safe. If it isn't tracked, it didn't happen. If it isn't
suppressed, it will be sent.

**Stage:** Plan. **Gate:** `scores.ops` of 7 or above.

## 0. Preamble

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section. Read `_shared/live-data.md` too, for the `/plan-ops-review` data needs.

- **It owns:** `campaigns/<slug>/plan-ops.md`.
- **It reads:** `brief.md` (required), `plan-cmo.md`, `plan-brand.md`, `status.md`, all of
  `context/`, `BRAND.md` (required elements), `playbooks/intake-checklist.md`,
  `playbooks/naming-conventions.md`, `playbooks/qa-checklist.md`, `connections.md`,
  `references/`, `learnings/learnings.md`, and past campaigns' `plan-ops.md` and `qa-report.md`.
- **It runs:** `scripts/utm-builder.mjs`.
- **It may create** tasks, tickets, or the CRM campaign (tier 2) only when the tool's tier in
  `connections.md` allows it, the tool is connected, and the user approves each one in the
  session. Otherwise it lists them as "to create". It never sends, publishes, schedules, or
  deletes.
- **It updates** `status.md` (stage, `scores.ops`, overrides, links) and appends gate
  overrides to `decisions/log.md`, as preamble section 6 says.
- **It never edits** `brief.md`, other plan files, `context/`, or `playbooks/`.

## 1. Check prerequisites

- **No `brief.md`:** stop. Say "There's no brief yet. Run `/campaign-office-hours` first."
- **No `plan-cmo.md` or `plan-brand.md`:** warn. Ops builds tracking around the scope and the
  message, so later changes there mean rework here. Ask whether to continue. If yes, note it in
  the header.
- **CMO or brand gate failed** with no override: warn and ask whether to continue.
- **`plan-ops.md` already exists:** show its date, score, and decision, and ask "re-review or
  keep?". Re-review when any upstream file is newer. Keep `utm_content` values that already
  appear in `creative/`, so live assets don't break.

Who decides: the marketing ops owner in `context/team.md` (whoever owns the email tool and
CRM), or the final sign-off. Ask once, as `/plan-cmo-review` does. If the user isn't either,
the decision is `pending: <name>`.

## 2. Rules

- **One question at a time** when something is missing.
- **Counts are pulled or given, never estimated.** Follow `_shared/live-data.md`. A segment
  with no count is `TBD (needs: count from <tool>)`.
- **Aggregates only.** Never write contact names, emails, or other personal data into the plan.
- **Every planned link is built by the script.** Never type a UTM link by hand.
- **Show the math** for every date check (business days, lead times, gaps).

## 3. Intake check

Walk `playbooks/intake-checklist.md`, the Required list and the per-channel list for every
channel in scope (after `plan-cmo.md` cuts). Mark each item `present` (with where it's
recorded) or `missing`. Ask for each missing item, one at a time. Anything still missing after
that is an open item, and any Required item still missing caps the overall score at 6.

## 4. Audience, consent, and frequency

For each segment in the brief:

| Field | What to record |
|---|---|
| Name in tool | The exact list or segment name |
| Definition | Filters in plain words (persona, region, lifecycle stage) |
| Count | After suppressions. Pulled `(HubSpot)`, given `(user)`, or `TBD` |
| Suppressions | Unsubscribed, bounced, and every list `context/channels.md` says to suppress |
| Exclusions | From the brief (customers, open opportunities, regions) |
| Consent | For each region in the audience: the basis from `context/channels.md` and how many contacts have it recorded. A region with no confirmed basis is excluded or a blocker. |
| Personalization gaps | How many are missing each field the copy will use (e.g. first name), so a fallback is required |

Then check:

- **Overlap:** a contact in two segments gets one send, not two. Say how (one list, or
  suppression of the other).
- **Frequency:** count other sends to an overlapping audience in the same week, from
  `context/calendar.md` and the email tool's scheduled sends. Flag anything over the cap in
  `context/channels.md`.
- **Follow-up sends:** if there's an Email 2 or later, who it excludes (people who already
  converted, people who unsubscribed after Email 1).

## 5. CRM, routing, and attribution

- **CRM campaign:** name per `playbooks/naming-conventions.md` (`<YYYY-MM> | <Type> | <Short
  name>`), parent campaign if the team uses them, and member statuses with the event that sets
  each one (e.g. `Responded` on form submit).
- **Hand-off:** the brief's hand-off made concrete. Who gets responders, how (lead routing,
  assignment rule, task), and how fast they follow up. If nobody is named, it's a blocker.
- **Goal metric:** how the brief's goal metric will be counted in the tools. Say which field
  or report, and how a responder is tied to this campaign (campaign membership, influence,
  original source). If the goal can't be measured with this setup, Tracking scores 3 or below.

## 6. Tracking plan

List every link in every asset in scope, by placement. Build each one:

```bash
node scripts/utm-builder.mjs build --url <destination> --source <source> --medium <medium> \
  --campaign <slug> --content <asset>-<placement>
```

- The script refuses links that break `playbooks/naming-conventions.md`. Fix the input, never
  the rule. A new source or medium needs that file updated first, by its owner.
- `utm_content` is `<asset>-<placement>`, e.g. `email1-cta-button`. Each value is unique.
- **Internal links get no UTMs** (landing page → thank-you page, site navigation).
- Write every planned link as a **full URL in the tracking table**. `scripts/link-check.mjs
  --expect plan-ops.md` reads full URLs from this file and matches them by `utm_content`, so
  don't put other URLs with `utm_content` elsewhere in the file.
- Also record: the analytics and HubSpot tracking expected on each page, the conversion event
  (usually the form submit), and the hidden form fields that capture UTMs.

## 7. Forms and pages

For each landing page and form:

- **Page:** URL, or the Jira ticket for the build, and the date it's due.
- **Fields:** only what the offer and the hand-off need (check against `plan-brand.md` offer
  wording). Each field must exist as a property in the email tool, or be listed to create.
- **Hidden fields:** UTMs, campaign ID.
- **Consent:** a checkbox and wording per region where `context/channels.md` requires it. Never
  pre-ticked. A privacy policy link.
- **After submit:** thank-you page or message, confirmation email if any, list membership, and
  the CRM member status it sets.

## 8. Schedule and tasks

**Sends and publish dates.** For each: date, time, time zone, segment. Check against
`context/calendar.md`: blackout dates, upcoming launches to the same segment, minimum gap,
weekly cap. Show the result for each.

**Lead times.** For each asset, check today + the lead time in `context/team.md` SLAs against
the date it's needed. Count business days and show the math, e.g. "Landing page: 2026-10-22 +
10 business days = 2026-11-05; needed 2026-11-06; 1 day of buffer."

**Build schedule.** Work back from launch: final copy, copy review, compliance review, build,
QA, fixes, launch. Each step gets an owner from `context/team.md` and a due date. Ask the owner
for the QA date; it must leave time to fix Blockers before launch.

**Tasks and tickets.** List each task (Asana) and ticket (Jira) with owner and due date. If the
tool is connected at tier 2, offer to create them, and ask before each one. Record the links in
`status.md` `links`.

## 9. Edge cases

Go through each. Record how the plan handles it, or `accepted risk` with who accepted it.

- Unsubscribed, bounced, and suppressed contacts can't receive it.
- Duplicates across segments and lists.
- Time zones: one send time for everyone, or recipient-local. Is the event time shown with its
  zone?
- Missing personalization data: every token has a fallback.
- Mobile: the email and page are readable at 375px width.
- Existing customers or open opportunities getting a prospect message.
- Replies: the reply-to address is a monitored inbox.
- Form spam or test submissions polluting the CRM.
- The landing page isn't ready on time: the fallback date.
- **Stop plan:** how to pause or cancel each send or ad after launch, and who can. This feeds
  `/launch` and `/launch-watch`.

## 10. Test plan for QA

Write the checks `/campaign-qa` must run on top of `playbooks/qa-checklist.md`, each with a
severity and how to verify it. Typical ones: the exclusions work (a test contact in an
excluded segment doesn't qualify), follow-up sends suppress responders, hidden fields capture
UTMs, the CRM member status is set on submit, consent checkboxes appear for the right region.
A check without a severity is a Major.

## 11. Launch settings

What `/launch` will use, per send or publish: asset, tool, audience (name and count), date,
time and time zone, sender name and address, reply-to, suppression lists, and stop conditions
from the brief's smallest test.

## 12. Score

Score five dimensions, 0 to 10, each with why, what a 10 looks like, and how to raise it.

| Dimension | A 10 looks like |
|---|---|
| **Tracking** | Every link planned and built by the script, conversion tracked, and the goal metric measurable end to end. |
| **Audience and data** | Every segment defined with a count, suppressions and exclusions set, consent confirmed per region, frequency within the cap. |
| **Systems** | CRM campaign and statuses defined, forms specified, routing and hand-off named with a follow-up time. |
| **Schedule and capacity** | Dates clear the calendar, every lead time met with the math shown, every step has an owner. |
| **Test and fail-safes** | A test plan for QA, every edge case handled or accepted, and a stop plan. |

**Overall:** the average, rounded down. Capped at 6 if any dimension is 3 or below, or any
Required intake item is still missing.

## 13. Verdict and decision

Recommend **Go**, **Go with changes**, or **Rework**. The decider from section 1 chooses.

**Override.** Below 7 and they want to go ahead: a named person with authority from
`context/team.md` and a one-sentence reason. Append to `status.md` `overrides`:
`{gate: ops, score, who, why, date}`, and the same to `decisions/log.md`:
`## YYYY-MM-DD: Override ops gate for <slug> at <score>/10`, with **Why**, **Decided by**,
and **Alternatives considered**. Don't log on behalf of someone who isn't in the session.

## 14. Write plan-ops.md

```markdown
# Ops plan: <campaign name>

- **Skill:** /plan-ops-review
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>
- **Upstream dated:** brief <date> · CMO <date> · brand <date>

## Verdict

- **Score:** <n>/10 (<pass | fail>)
- **Recommended:** <Go | Go with changes | Rework>
- **Decision:** <choice> by <name>, <YYYY-MM-DD> | pending: <name>
- **Override:** <none | reason, logged in decisions/log.md>

## Intake

| Item | Status | Where recorded |
|---|---|---|

## Audience

| Segment | Definition | Count | Suppressions | Exclusions | Consent | Personalization gaps |
|---|---|---|---|---|---|---|

- **Overlap:** · **Frequency:** · **Follow-up sends exclude:**

## CRM and hand-off

- **CRM campaign:** <name> · **Parent:** <name or none>
- **Member statuses:** <status: event that sets it>
- **Hand-off:** <who, how, follow-up time>
- **Goal metric counted as:** <field or report, and how responders tie to this campaign>

## Tracking plan

| Asset | Placement | utm_content | URL |
|---|---|---|---|

- **Page tracking:** <analytics and HubSpot tags expected per page>
- **Conversion event:** · **Hidden fields:**

## Forms and pages

| Page or form | URL or ticket | Due | Fields | Consent | After submit |
|---|---|---|---|---|---|

## Schedule

| Send or publish | Date and time (TZ) | Segment | Calendar check |
|---|---|---|---|

| Asset | Lead time | Ready by (math) | Needed by | Buffer |
|---|---|---|---|---|

| Step | Owner | Due |
|---|---|---|

## Tasks and tickets

| Task | Tool | Owner | Due | Status (to create / created: link) |
|---|---|---|---|---|

## Edge cases

| Case | How it's handled | Owner |
|---|---|---|

## QA test plan

| Check | Severity | How to verify |
|---|---|---|

## Launch settings

| Asset | Tool | Audience (count) | Date and time (TZ) | Sender | Reply-to | Suppressions | Stop if |
|---|---|---|---|---|---|---|---|

## Scores

| Dimension | Score | Why | A 10 looks like | To raise it |
|---|---|---|---|---|
| Tracking | | | | |
| Audience and data | | | | |
| Systems | | | | |
| Schedule and capacity | | | | |
| Test and fail-safes | | | | |
| **Overall** | | <average, rounded down; capped at 6 if any is ≤ 3 or a Required intake item is missing> | | |

## Open items

- <every TBD, with what's needed and who can answer>

## Data sources

| Figure | Value | Source | Query or report | Pulled |
|---|---|---|---|---|
```

## 15. Update status

In `campaigns/<slug>/status.md`:

- `stage: plan` (only if the current stage is `brief`).
- `scores.ops`: the overall score.
- `links`: any tasks, tickets, or CRM campaign created.
- `updated`: today.
- `overrides`: append if section 13 logged one.

## 16. Close

End with:

1. **Written:** `plan-ops.md` and `status.md`, as clickable paths.
2. **Gate:** score, pass or fail, and the decision (or `pending: <name>`).
3. **Blockers and owners:** each open item that stops the build, one line each, by owner.
4. **Tasks and tickets:** created (with links) and still to create.
5. **Suggested `decisions/log.md` entries** (e.g. "Recipient-local send time", "Accept risk:
   no reply-to monitoring"). Ask which to log, then append only approved ones.
6. **Next:** `/creative-shotgun`. It uses the tracking plan's URLs in the drafts.
