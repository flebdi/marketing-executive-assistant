---
name: plan-brand-review
description: Brand lead's review of a campaign plan, before any copy is written. Checks every planned claim against BRAND.md, flags banned phrases and AI-sounding filler, scores the message on six brand dimensions (voice, clarity, offer, call to action, visual fit, differentiation), agrees the fixes one at a time, and writes the message plan that /creative-shotgun builds from. Writes campaigns/<slug>/plan-brand.md. Use after /plan-cmo-review and before /plan-ops-review, or to re-review after the message changes (e.g. "/plan-brand-review 2026-11-ai-webinar").
argument-hint: "[campaign slug]"
---

# /plan-brand-review

*Adapted from `/plan-design-review` in Garry Tan's gstack (MIT). See `NOTICE.md`.*

**Role:** The brand lead. You protect the brand by making the message sharper, not by policing
adjectives. A message that's on-voice but says nothing is still a fail.

**Stage:** Plan. **Gate:** `scores.brand` of 7 or above.

## 0. Preamble

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section. Read `_shared/live-data.md` too, for the `/plan-brand-review` data needs.

- **It owns:** `campaigns/<slug>/plan-brand.md`.
- **It reads:** `brief.md` (required), `plan-cmo.md`, `status.md`, all of `BRAND.md`,
  `context/audiences.md`, `context/company.md` (positioning, competitors),
  `context/channels.md`, `context/team.md`, `learnings/learnings.md`, and past campaigns'
  `plan-brand.md` and `retro.md`.
- **It updates** `status.md` (stage, `scores.brand`, overrides) and appends gate overrides to
  `decisions/log.md`, as preamble section 6 says.
- **It never edits** `brief.md`, `plan-cmo.md`, or `BRAND.md`. If `BRAND.md` is missing
  something the review needs, say which skill fills it: `/onboard-marketing voice` for voice,
  claims, and banned phrases; `/brand-system` for visual rules.

## 1. Check prerequisites

- **No `brief.md`:** stop. Say "There's no brief yet. Run `/campaign-office-hours` first."
- **No `plan-cmo.md`:** warn that scope isn't settled, so the message may be planned for
  channels or assets that get cut. Ask whether to continue. If yes, review the brief's scope
  and note it in the header.
- **CMO gate failed** (`scores.cmo` below 7, no override): warn that brand work may be wasted
  if the campaign is reworked or killed. Ask whether to continue.
- **`BRAND.md` has no standard to score against** (Voice table and Approved claims both still
  `TBD`): say so. Voice and Offer can't be scored fairly, so the overall is capped at 6 until
  `/onboard-marketing voice` fills them. Ask whether to continue anyway.
- **`plan-brand.md` already exists:** show its date, score, and decision, and ask
  "re-review or keep?". Re-review when the brief or `plan-cmo.md` is newer.

## 2. Who approves

Ask once:

> Are you the brand approver for this campaign (<name from context/team.md approval chain>)?
> If not, who is?

If the user isn't the brand approver or the final sign-off, run the full review and write the
decision as `pending: <name>`.

## 3. Read the message

Pull the planned message together from `brief.md`, with `plan-cmo.md` scope changes applied
(cut channels and assets are out). Show the user a short summary:

- **Persona, in their own words:** the brief's observation quote and the persona's pains from
  `context/audiences.md`.
- **Offer, core message, proof, and call to action** as the brief states them.
- **Channels and assets in scope.**
- **What has worked before:** matching learnings, past `plan-brand.md` message plans and their
  retro results, and recent email performance to this audience if HubSpot is reachable.
  "Nothing yet for this audience" is a valid answer.

## 4. Run the checks

Do these before scoring. They're mechanical, and they find most problems.

**Claims check.** List every claim in the planned message: numbers, outcomes, comparisons,
superlatives, guarantees. For each, look it up in `BRAND.md` Approved claims:

| Status | Meaning |
|---|---|
| Approved | On the list, used in the same scope and wording. |
| Approved, narrower | On the list, but the plan stretches it (e.g. the source is about month-end close and the plan implies year-end). Give the in-scope wording. |
| Expired | On the list, past its expiry date. Treat as not approved. |
| Not approved | Not on the list. Includes the brief's "Claims needing a source". |

Any planned claim that is not approved caps the Offer score at 3 until it's removed or a source
is added to `BRAND.md`.

**Language check.** Scan the brief's message, offer, and call to action for:

- **Banned phrases** from `BRAND.md`. Each one is a must-fix.
- **AI-sounding filler** not yet in the banned list: "unlock", "elevate", "empower",
  "seamless", "leverage", "game-changing", "in today's fast-paced world", "not just X, it's
  Y", stacked adjectives, and rhetorical-question openers. Flag them as advisory and suggest
  adding the ones the team agrees with via `/onboard-marketing voice`.
- **Vendor words** where the persona has its own words. "Automated reconciliation workflows"
  when the persona says "my spreadsheet doesn't tie out". Use the observation quote and the
  pains in `context/audiences.md` as the reference.

**Swap test.** Replace the company name in the core message with each competitor in
`context/company.md`. If the sentence is still true for them, it isn't differentiated.

## 5. Score

Score six dimensions, 0 to 10. For each: the score, one line on why, what a 10 looks like for
this campaign, and the specific change that would raise it.

| Dimension | A 10 looks like |
|---|---|
| **Voice** | Reads like the `BRAND.md` voice samples. Every trait in the Voice table holds. No banned phrases. |
| **Clarity** | One idea. A stranger can say who it's for and what they get within five seconds. |
| **Offer** | Specific, worth the persona's time, and honest. Every claim approved and in scope. |
| **Call to action** | One primary action per asset, and it's the exact action the goal metric counts. |
| **Visual fit** | The planned visuals follow `BRAND.md` visual rules and imagery style. |
| **Differentiation** | Passes the swap test against every competitor in `context/company.md`. |

- **Visual fit is "Not scored"** when the campaign has no visual assets, or `BRAND.md` visual
  rules are still `TBD`. Leave it out of the average and list the gap in Open items.
- **Overall:** the average of the scored dimensions, rounded down. Any dimension at 3 or below
  caps the overall at 6, a fail.
- Score honestly. A 7 means "a writer could start from this and not have to guess".

## 6. Get it to a 10

For each dimension under 10, propose the specific change: a rewritten line, a cut claim, a
different call to action, the persona's own phrase instead of a vendor phrase. Show "before →
after".

- Ask about one change at a time: accept, edit, or reject.
- Accepted changes go into the message plan (section 8). They don't change `brief.md`.
- Write direction, not final copy. Example lines are fine. Variants are `/creative-shotgun`'s
  job.
- If a fix needs a different persona, offer, or goal, that's a brief change. Say so, and name
  `/campaign-office-hours <slug>`.

Then re-score. Show both: "Plan as written: 5. With the agreed changes: 8."

## 7. Verdict and decision

Recommend **Pass**, **Pass with changes**, or **Rework** (with what to fix and which skill
re-runs). The brand approver from section 2 decides. Record their choice and name.

**Override.** If the score is below 7 and they want to go ahead anyway:
- It needs a named person with authority from `context/team.md` (the brand approver or the
  final sign-off) and a one-sentence reason.
- An override never approves a claim. Unapproved claims stay out of the message plan, whatever
  the score.
- Append to `status.md` `overrides`: `{gate: brand, score, who, why, date}`, and the same to
  `decisions/log.md`: `## YYYY-MM-DD: Override brand gate for <slug> at <score>/10`, with
  **Why**, **Decided by**, and **Alternatives considered**.
- If the decider isn't in this session, don't log on their behalf. The decision is
  `pending: <name>`.

## 8. Write plan-brand.md

```markdown
# Brand review: <campaign name>

- **Skill:** /plan-brand-review
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>
- **Brief dated:** <date> · **CMO review dated:** <date, or "none">

## Verdict

- **Score:** <n>/10 (<pass | fail>). Plan as written: <n>/10.
- **Recommended:** <Pass | Pass with changes | Rework>
- **Decision:** <choice> by <name>, <YYYY-MM-DD> | pending: <name>
- **Override:** <none | reason, logged in decisions/log.md>

## Message plan

What `/creative-shotgun` builds from. Every line here is agreed.

- **Persona, in their words:** <one line, with the quote or pain it comes from>
- **Core message:** <one sentence>
- **Support points:**
  1. <point> · **Proof:** <approved claim, source> or "none needed"
  2. <point> · **Proof:**
- **Offer, as worded:** <exact wording>
- **Primary call to action:** "<exact words>" → <where it leads>
- **Words to use:** <the persona's own words>
- **Words to avoid:** <banned phrases that tempt this topic, plus campaign-specific ones>
- **Visual direction:** <from BRAND.md visual rules and imagery style, or TBD (needs: /brand-system)>

| Channel | Asset | Angle | Tone and length (BRAND.md) | Call to action |
|---|---|---|---|---|

## Claims check

| Claim | Status | Source | Use this wording |
|---|---|---|---|

## Language flags

| Phrase | Where | Rule (banned / filler / vendor words) | Fix |
|---|---|---|---|

## Scores

| Dimension | Score | Why | A 10 looks like | To raise it |
|---|---|---|---|---|
| Voice | | | | |
| Clarity | | | | |
| Offer | | | | |
| Call to action | | | | |
| Visual fit | | | | |
| Differentiation | | | | |
| **Overall** | | <average of scored dimensions, rounded down; capped at 6 if any is ≤ 3> | | |

## Changes agreed

| Before | After | Why | Accepted by |
|---|---|---|---|

## For the next reviews

- **Ops review should check:** <e.g. the CTA destination exists; the form asks only for what the offer needs>
- **Copy review should check:** <e.g. the narrower claim wording is used exactly>
- **Compliance review should check:** <e.g. the customer quote has permission>

## Open items

- <every TBD, with what's needed and who can answer>
```

Add a **Data sources** table if anything was pulled, as `_shared/live-data.md` describes.

## 9. Update status

In `campaigns/<slug>/status.md`:

- `stage: plan` (only if the current stage is `brief`).
- `scores.brand`: the overall score.
- `updated`: today.
- `overrides`: append if section 7 logged one.

## 10. Close

End with:

1. **Written:** `plan-brand.md` and `status.md`, as clickable paths.
2. **Gate:** score, pass or fail, and the decision (or `pending: <name>`).
3. **If it failed:** the two changes that would most raise the score.
4. **Gaps for other owners:** unsourced claims → add a source to `BRAND.md` Approved claims;
   visual rules → `/brand-system`; new filler words → `/onboard-marketing voice`.
5. **Suggested `decisions/log.md` entries**, if a real decision was made (e.g. "Drop the
   year-end claim until we have a source"). Ask which to log, then append only approved ones.
6. **Next:** `/plan-ops-review`.
