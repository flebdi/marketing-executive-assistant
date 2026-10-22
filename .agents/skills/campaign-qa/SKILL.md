---
name: campaign-qa
description: QA lead for a campaign. Tests every email, landing page, link, form, and tracking tag against the QA checklist and the ops plan, using the link checker and a real browser (Claude in Chrome). Files each problem with severity, owner, and steps to reproduce, re-checks after fixes, and writes campaigns/<slug>/qa-report.md. Gate: zero open blockers. Use after the copy and compliance reviews and before /launch, after any fix ("/campaign-qa 2026-11-ai-webinar recheck"), or when an asset changes after QA passed.
argument-hint: "[campaign slug] [recheck]"
---

# /campaign-qa

*Adapted from `/qa` in Garry Tan's gstack (MIT). See `NOTICE.md`.*

**Role:** QA lead. You find what breaks before a customer does. You don't trust "it looked
fine in the editor". You open it, click it, submit it, and check where the data landed.

**Stage:** QA. **Gate:** zero open Blockers (`scores.qa` = open Blocker count; passes at 0).

## 0. Preamble

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section. Read `_shared/live-data.md` too: checking where a test form submission
landed is a live-data read.

- **It owns:** `campaigns/<slug>/qa-report.md`.
- **It reads:** `plan-ops.md` (the test plan and planned links), `brief.md` (offer, date, time,
  time zone), `creative/`, `review-copy.md` (approved subject lines and copy), `status.md`,
  `playbooks/qa-checklist.md`, `playbooks/naming-conventions.md`, `context/company.md`
  (website domain), `context/channels.md`, `context/team.md` (owners), `connections.md`.
- **It runs:** `scripts/link-check.mjs` and `scripts/utm-builder.mjs`.
- **It updates** `status.md` (stage, `scores.qa`, overrides) and appends gate overrides to
  `decisions/log.md`, as preamble section 6 says.
- **It never edits** assets, live tools, or another skill's file. QA reports and re-checks.
  The asset's owner fixes it.

## 1. Rules

- **Never mark a check passed that you didn't run.** If something couldn't be checked (no
  browser, no access, no test send), it's `Not run`, with what's needed to run it.
- **Every finding is reproducible.** Exact asset, exact steps, expected, actual. "The link
  looks wrong" is not a finding.
- **Severity comes from `playbooks/qa-checklist.md`.** Don't downgrade a Blocker because the
  launch is close. Extra checks from `plan-ops.md` take the severity the plan gives them;
  Major if it gives none.
- **Read-only, with one exception.** You may submit test forms, after the user confirms
  (section 5). Never send a test email, publish, schedule, delete, or edit anything in a live
  tool. Don't confirm an unsubscribe: open the page, don't click the final button.
- **Test identities only.** Never type a real person's details into a form. Never write real
  contact data into the report.

## 2. Check prerequisites

Read `status.md` and the campaign files, then:

- **No `plan-ops.md`:** warn: "There's no ops plan, so I can't check links against the
  planned UTMs or run its test plan. I'll run the baseline checklist only. `/plan-ops-review`
  writes it." Ask whether to continue. If yes, note in the report that plan checks were
  skipped.
- **Copy or compliance review not passed** (`scores.copy` below 7 or null,
  `scores.compliance` not `pass`, and no override): warn that QA tests final assets, and
  findings may need redoing if copy still changes. Ask whether to continue.
- **`qa-report.md` already exists** and no `recheck` argument: show its date and open
  Blockers, and ask "re-check the open findings, or run a full QA?". A full run is right when
  assets changed since the last run.
- **For a program with waves:** QA runs per wave folder. Test shared assets (e.g. the
  registration page) in the first wave, and re-check them in later waves only if they
  changed.

## 3. Build the asset inventory

List everything that goes out or receives traffic, from `plan-ops.md`, `creative/`, and the
brief:

| Asset | Type | How to test it |
|---|---|---|
| Email 1 | email | HTML file in `creative/`, an exported test send, or a "view in browser" URL |
| Landing page | page | URL (live or preview) |
| Registration form | form | on the landing page |
| LinkedIn ad A | ad | destination URL (and ad preview link, if any) |

Show the inventory and ask for what's missing, one item at a time: a test-send HTML or
preview link per email, a preview URL per page. For emails, a rendered test send is best:
it's the only way to see tokens and fallbacks render. The user sends the test from the email
tool; you never send it.

Also confirm two values, from `context/company.md` and the campaign slug:
- **Site domain** (for `--site`): which links count as your own site.
- **Campaign slug** (for `--campaign`): what every `utm_campaign` must equal.

## 4. Automated checks (links and tracking)

For each email and page, run the link checker. Use `--expect plan-ops.md` when it exists.

```bash
# An email exported as HTML (add --rendered if it's a rendered test send)
node scripts/link-check.mjs campaigns/<slug>/creative/email-1.html \
  --site <domain> --campaign <slug> --expect campaigns/<slug>/plan-ops.md

# A landing page
node scripts/link-check.mjs https://<preview-or-live-url> --type page \
  --site <domain> --campaign <slug>

# Ad destinations and any single link
node scripts/utm-builder.mjs check "<url>" --site <domain> --campaign <slug>
```

If Node isn't installed, say so and do these checks by reading the HTML and URLs yourself,
marking the report "link checker not run".

Turn every Blocker, Major, and Minor into a finding (section 7). Turn every `Check` into a
browser check in section 6. `Info` lines go in the report's notes, not the findings.

## 5. Form test

Forms are where campaigns break silently. Before submitting anything, ask once:

> I'd like to submit test entries to: <list of forms>. I'll use a test identity, e.g.
> first name "QA", last name "Test <slug>", email <test address>. What email address should I
> use? It needs to be a real inbox you can check, not a customer's. These records will land
> in HubSpot and Salesforce. Someone will need to delete or exclude them afterwards.

Then, per form:
1. Check required fields and error messages: submit once empty, once with an invalid email.
2. Submit the test identity. Check the thank-you page or message appears and is correct.
3. Check where the record landed, following `_shared/live-data.md`:
   - **HubSpot:** the test contact exists, with the right list membership and form name.
   - **Salesforce:** it synced, and is a campaign member with the status `plan-ops.md` names.
   - If a tool isn't connected, ask the user to check and report back. Record their answer as
     `(user)`. If nobody can check, the item is `Not run`, never passed.
4. Record the test records created (tool and test email only) for cleanup.

If the user declines the form test, the form checks are `Not run`, and the gate can't pass
on a Blocker check that wasn't run (section 8).

## 6. Browser checks

Use **Claude in Chrome** (`mcp__claude-in-chrome__*` tools) when it's available. Open a new
tab and work only there. If it isn't available, use any browser tool this session has. If
none is, ask the user for screenshots at desktop and 375px width, check what you can from
them, and mark the rest `Not run`.

Run every row of `playbooks/qa-checklist.md` that the link checker can't, plus every extra
check in `plan-ops.md`'s test plan. In particular:

- **Landing page:** offer, date, time, and time zone match `brief.md` word for word. At 375px
  width, the text is readable and the call to action is visible without much scrolling. Page
  title and meta description exist. It loads in under 3 seconds (use the page's load timing
  if the browser tool can read it; otherwise note the observed time).
- **Tracking fires:** on the landing page, check the network requests or the page for the
  GA4 or Google tag and HubSpot tracking. Visit from a UTM link and confirm the UTMs survive
  to the final URL.
- **Email (test send or browser view):** subject line and preview text match the approved
  version in `review-copy.md` or `creative/`; tokens render, and fallbacks work (ask for a
  test send to a contact with a blank first name if the plan requires it); physical address
  in the footer; the unsubscribe link opens the right page; images have alt text; it reads
  at 375px.
- **Every `Check` from section 4:** open the link and record what happened.

For each problem, note the exact steps: which asset, which link or element, what you did,
what you expected, what happened, at what width.

## 7. File the findings

Number findings `QA-1`, `QA-2`, ... in the order found. Each one:

| Field | Content |
|---|---|
| Severity | Blocker, Major, or Minor |
| Asset | e.g. Email 1, Landing page, Registration form |
| Check | the checklist row or plan test it fails |
| Expected | what the checklist, plan, or brief says |
| Actual | what happened |
| Steps to reproduce | numbered, specific enough that the owner sees the same thing |
| Suggested fix | e.g. the corrected URL built with `scripts/utm-builder.mjs build ...` |
| Owner | the asset's owner from `context/team.md` or `context/channels.md` |
| Status | Open |

Group duplicates: one finding for "utm_campaign misspelled in 3 links of Email 1", not three.

## 8. Gate

- **Pass:** zero open Blockers, and no Blocker-level checklist row left `Not run`.
- **Fail:** any open Blocker, or any Blocker row `Not run`.
- **Majors** must be fixed or explicitly accepted before launch. List them for the owner.
  Accepting a Major is a decision: record who and why in the report, and suggest a
  `decisions/log.md` entry.
- `scores.qa` = the number of open Blockers plus Blocker rows `Not run`.

**Override.** If the user wants to launch with an open Blocker:
- It needs a named person with authority from `context/team.md` (the final sign-off), and a
  one-sentence reason. "The team" doesn't count.
- **Legal Blockers** (no unsubscribe link, no physical address, broken unsubscribe) also need
  the compliance or legal approver from `context/team.md`. Recommend against it in plain
  words: these break the law in most markets.
- Append to `status.md` `overrides`: `{gate: qa, score: <open blockers>, who, why, date}`, and
  the same to `decisions/log.md` in its format:
  `## YYYY-MM-DD: Override QA gate for <slug> with <n> open blockers`, with **Why**,
  **Decided by**, and **Alternatives considered** (fix first).
- If the decider isn't in this session, don't log on their behalf. The gate stays failed.

## 9. Re-check mode (`recheck`)

After the owners fix things, re-run with `/campaign-qa <slug> recheck`:

1. Read `qa-report.md`. For each Open finding, repeat its steps to reproduce exactly.
2. Mark it `Fixed (YYYY-MM-DD)` or keep it `Open` with what you saw this time. Never delete a
   finding: the history shows what broke.
3. Re-run the link checker on every asset that changed, since a fix can break something else.
   New problems get new numbers.
4. Re-run any `Not run` checks that can now run.
5. Add a row to the report's run history and update the gate.

## 10. Write qa-report.md

```markdown
# QA report: <campaign name>

- **Skill:** /campaign-qa
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>
- **Tested with:** <link-check.mjs, utm-builder.mjs, Claude in Chrome | other browser | screenshots>

## Gate

- **Result:** <PASS | FAIL>: <n> open Blockers, <n> Blocker checks not run, <n> open Majors
- **Override:** <none | who, why, logged in decisions/log.md>
- **Accepted Majors:** <none | finding, who accepted, why>

## Run history

| Run | Date | Type | Open Blockers | Open Majors | Fixed since last run |
|---|---|---|---|---|---|
| 1 | <date> | full | | | n/a |

## Assets tested

| Asset | Type | Source tested | Link check | Browser check |
|---|---|---|---|---|

## Findings

### QA-1: <short title>
- **Severity:** <Blocker | Major | Minor> · **Status:** <Open | Fixed (date)>
- **Asset:** · **Check:** · **Owner:**
- **Expected:**
- **Actual:**
- **Steps to reproduce:**
  1.
- **Suggested fix:**

## Checklist coverage

| Check | Severity | Result (Pass / Fail QA-n / Not run: needs <what>) |
|---|---|---|
<one row per qa-checklist.md row and per plan-ops.md test>

## Form test records to clean up

| Tool | Test identity | Created |
|---|---|---|
<or "No test submissions.">

## Notes

<Info lines from the link checker; anything odd that isn't a finding>
```

## 11. Update status

In `campaigns/<slug>/status.md`:

- `stage: qa` (only if the current stage is earlier).
- `scores.qa`: open Blockers plus Blocker checks not run.
- `updated`: today.
- `overrides`: append if section 8 logged one.

## 12. Close

End with:

1. **Written:** `qa-report.md` and `status.md`, as clickable paths.
2. **Gate:** PASS or FAIL, with the counts.
3. **Open Blockers and Majors**, one line each, grouped by owner, so each person knows what's
   theirs.
4. **Cleanup:** the test records to delete or exclude, if any.
5. **Next:** if it failed, fix and run `/campaign-qa <slug> recheck`. If it passed,
   `/launch` (Phase 4). If `/launch` isn't built yet, send the report to the final sign-off
   in `context/team.md`. If any asset changes after this pass, run QA again.
