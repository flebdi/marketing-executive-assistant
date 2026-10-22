---
name: copy-review
description: Senior editor's review of a campaign's final copy. Checks every fact against the brief and ops plan, every claim against BRAND.md Approved claims, tokens and fallbacks, placeholders, the call to action, banned phrases, voice, and length per channel. Fixes typos directly, asks before any other change, records the approved subject lines and calls to action that /campaign-qa checks against, and scores it 0 to 10 (pass at 7). Writes campaigns/<slug>/review-copy.md. Use after /creative-shotgun and before /compliance-review, or after copy changes ("/copy-review 2026-11-ai-webinar recheck").
argument-hint: "[campaign slug] [recheck]"
---

# /copy-review

*Adapted from `/review` in Garry Tan's gstack (MIT). See `NOTICE.md`.*

**Role:** Senior editor. You catch what gets approved in a doc and breaks in market: a wrong
date, an unapproved claim, a `{{first_name}}` with no fallback, three different calls to
action. Good taste matters, but accuracy comes first.

**Stage:** Review. **Gate:** `scores.copy` of 7 or above, with no open Must-fix findings.

## 0. Preamble

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section.

- **It owns:** `campaigns/<slug>/review-copy.md`.
- **It may edit** `creative/final/*` files: typo fixes directly (section 4), anything else only
  after the user approves that change. Every edit is listed in the review.
- **It reads:** `creative/final/` (required), `brief.md`, `plan-brand.md`, `plan-ops.md`,
  `status.md`, all of `BRAND.md`, `context/channels.md`, `context/team.md`, and
  `review-compliance.md` if it exists.
- **It updates** `status.md` (stage, `scores.copy`, overrides) and appends gate overrides to
  `decisions/log.md`, as preamble section 6 says.
- **It never edits** `creative/variants/`, the brief, plan files, or `BRAND.md`.

## 1. Check prerequisites

- **`creative/final/` is empty:** stop. Say "There's no final copy to review. Run
  `/creative-shotgun`, or put your copy in `creative/final/`."
- **No `plan-brand.md` or `plan-ops.md`:** warn which checks can't run (message plan and agreed
  claim wording; planned links, fallbacks, sender). Ask whether to continue. Those checks are
  `Not run` in the report.
- **`review-copy.md` exists** and no `recheck` argument: show its date, score, and open
  Must-fix count, and ask "re-check the open findings, or a full review?". A full review is
  right when the copy changed beyond the findings.

Who approves: the copy approver in `context/team.md`. Ask once whether the user is that person.
If not, the decision is `pending: <name>`.

## 2. Inventory

List each file in `creative/final/` with its asset, channel, and parts (subject, preview, body,
call to action, image alt text). Review every file. HTML exports are reviewed for their text;
links in them are QA's job.

## 3. The checks

Run every check on every asset. Each problem becomes a finding with a severity:

- **Must fix:** wrong or unapproved, or it breaks in market. Blocks the gate.
- **Should fix:** weakens the copy. Fix, or the approver accepts it.
- **Nit:** optional.

| # | Check | How | Severity |
|---|---|---|---|
| 1 | **Facts** | Offer name, dates, times with time zone, prices, durations, and sender match `brief.md` and `plan-ops.md` exactly | Must fix |
| 2 | **Claims** | Every number, outcome, comparison, or superlative is in `BRAND.md` Approved claims, in scope, in the wording `plan-brand.md` agreed, and not expired | Must fix |
| 3 | **Quotes** | Quotes are verbatim from a cited source. Flag every customer or prospect quote for `/compliance-review` (permission) | Must fix if not verbatim; otherwise a note for compliance |
| 4 | **Placeholders** | No `TBD`, `TODO`, `XX`, `[LINK: ...]`, `[REQUIRED: ...]`, lorem ipsum, or bracketed notes left in | Must fix |
| 5 | **Tokens** | Valid syntax for the email tool, a fallback on every token, fallbacks match `plan-ops.md` | Must fix |
| 6 | **Call to action** | One primary action per asset, worded as `plan-brand.md` agreed, the same promise in every placement | Should fix (Must fix if it promises something the offer doesn't give) |
| 7 | **Banned phrases** | None from `BRAND.md` | Must fix |
| 8 | **Filler** | AI-sounding filler and vendor words where the persona has its own words | Should fix |
| 9 | **Voice** | Each `BRAND.md` voice trait holds. Quote the line that breaks it and give a rewrite | Should fix |
| 10 | **Channel fit** | Subject, preview, and body lengths per `BRAND.md` Tone by channel. Preview text exists. The first two lines carry the point on a phone | Should fix |
| 11 | **Mechanics** | Spelling, grammar, punctuation, consistent names and date formats, descriptive link text (no "click here"), image alt text | Typos: auto-fix. Others: Nit or Should fix |

For each finding record: asset, the exact line quoted, the check, the rule or source it fails,
and the fix, written out.

## 4. Fix

Adapted from gstack's fix-first review.

- **Auto-fix** only mechanical typos: misspellings, doubled words, doubled spaces, a missing
  full stop, inconsistent capitalization of the company or product name. Apply them in
  `creative/final/` and list each one as `[AUTO-FIXED] <asset>: "<before>" → "<after>"`.
- **Ask** about everything else. Show the numbered list of findings, Must fix first, then go
  through them one at a time: apply the fix, edit it, or leave it (Should fix and Nit only; a
  Must fix can't be left, only fixed or overridden).
- **Never fix a claim by inventing a source** or softening it into a different unapproved
  claim. Cut it, or use the approved wording.
- **Missing facts stay missing.** If a fix needs information nobody has (the footer address),
  the finding stays Open with its owner.

## 5. Score

Score five dimensions, 0 to 10, each with why, what a 10 looks like, and how to raise it.

| Dimension | A 10 looks like |
|---|---|
| **Accuracy** | Every fact matches the brief and ops plan. No placeholders. Tokens all have fallbacks. |
| **Claims** | Every claim approved, in scope, in the agreed wording. |
| **Voice** | Reads like the `BRAND.md` voice samples. No banned phrases or filler. |
| **Clarity and call to action** | One idea per asset, one action, and the reader knows exactly what happens when they click. |
| **Channel fit** | Lengths, preview text, and mobile reading all fit `BRAND.md` Tone by channel. |

**Overall:** the average, rounded down. Capped at 6 if any dimension is 3 or below, or any
Must-fix finding is still open. Score after the fixes applied in section 4, and show both if
they differ.

## 6. Approved versions

When the gate passes and the copy approver approves, record per asset, verbatim: the subject
line, preview text, primary call to action, and the final file with its date. `/campaign-qa`
compares the test send against these. If a final file changes after approval, copy review must
run again (`recheck`), and so must QA.

## 7. Verdict and decision

Recommend **Approve**, **Approve with changes** (the fixes applied), or **Rework** (back to
`/creative-shotgun <slug> <asset>`). The copy approver decides.

**Override.** Below 7 or with an open Must fix: a named person with authority from
`context/team.md` (the copy approver or the final sign-off) and a one-sentence reason. An
unapproved claim can't be overridden here; it needs a source in `BRAND.md` or it comes out.
Append to `status.md` `overrides`: `{gate: copy, score, who, why, date}`, and the same to
`decisions/log.md`: `## YYYY-MM-DD: Override copy gate for <slug> at <score>/10`, with **Why**,
**Decided by**, and **Alternatives considered**. Don't log on behalf of someone who isn't in
the session.

## 8. Re-check mode (`recheck`)

1. Read `review-copy.md`. For each Open finding, check the current copy.
2. Mark it `Fixed (YYYY-MM-DD)` or keep it `Open`. Never delete a finding.
3. Run all the checks again on any asset that changed. New problems get new numbers.
4. Re-score, update the approved versions, and add a row to the run history.

## 9. Write review-copy.md

```markdown
# Copy review: <campaign name>

- **Skill:** /copy-review
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>

## Verdict

- **Score:** <n>/10 (<pass | fail>), <n> open Must fix, <n> open Should fix
- **Recommended:** <Approve | Approve with changes | Rework>
- **Decision:** <choice> by <name>, <YYYY-MM-DD> | pending: <name>
- **Override:** <none | reason, logged in decisions/log.md>

## Approved versions

| Asset | Subject | Preview | Primary call to action | File (date) |
|---|---|---|---|---|

## Run history

| Run | Date | Type | Open Must fix | Open Should fix | Fixed since last run |
|---|---|---|---|---|---|

## Findings

### CR-1: <short title>
- **Severity:** <Must fix | Should fix | Nit> · **Status:** <Open | Fixed (date) | Left (who, why)>
- **Asset:** · **Check:** · **Owner:**
- **Line:** "<quoted>"
- **Rule:** <BRAND.md section, brief field, or plan-brand.md line>
- **Fix:** "<rewrite>"

## Auto-fixed

- [AUTO-FIXED] <asset>: "<before>" → "<after>"

## Scores

| Dimension | Score | Why | A 10 looks like | To raise it |
|---|---|---|---|---|
| Accuracy | | | | |
| Claims | | | | |
| Voice | | | | |
| Clarity and call to action | | | | |
| Channel fit | | | | |
| **Overall** | | <average, rounded down; capped at 6 if any is ≤ 3 or a Must fix is open> | | |

## For compliance review

- <quotes needing permission, claims near a legal line, consent wording, competitor names>

## Open items

- <every open finding and TBD, with owner>
```

## 10. Update status

In `campaigns/<slug>/status.md`:

- `stage: review` (only if the current stage is earlier).
- `scores.copy`: the overall score.
- `updated`: today.
- `overrides`: append if section 7 logged one.

## 11. Close

End with:

1. **Written:** `review-copy.md`, `status.md`, and any edited `creative/final/` files, as
   clickable paths.
2. **Gate:** score, pass or fail, open Must-fix count, and the decision.
3. **Open findings by owner,** one line each.
4. **Next:** `/compliance-review`. If copy changes after that, re-run `/copy-review <slug>
   recheck` before `/campaign-qa`.
