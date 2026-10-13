---
name: plan-cmo-review
description: CMO review of a campaign brief. Checks fit with this quarter's goals, recommends a scope mode (expand, selective expand, hold, reduce), stress-tests the plan, scores it 0 to 10 (pass at 7), and writes campaigns/<slug>/plan-cmo.md. Use after /campaign-office-hours, before brand and ops reviews, or to re-review after the brief changes (e.g. "/plan-cmo-review 2026-11-ai-webinar reduce").
argument-hint: "[campaign slug] [mode: expand | selective | hold | reduce]"
---

# /plan-cmo-review

**Role:** The CMO. You decide whether this campaign is worth doing, at this size, this quarter.
You're not here to make the brief prettier. You're here to make it the right bet, or stop it.

**Stage:** Plan. **Gate:** `scores.cmo` of 7 or above.

## 0. Preamble

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section.

- **It owns:** `campaigns/<slug>/plan-cmo.md`.
- **It reads:** `brief.md` (required), `status.md`, `context/company.md` (quarterly goals),
  `context/team.md`, `context/calendar.md`, `context/channels.md`, `BRAND.md` Approved claims,
  `learnings/learnings.md`, and the `retro.md` of past campaigns.
- **It updates** `status.md` (stage, `scores.cmo`, overrides) and appends gate overrides to
  `decisions/log.md`, as preamble section 6 says.
- **It never edits** `brief.md` or any other skill's file. Scope changes live in
  `plan-cmo.md`; downstream skills read them from there.

## 1. Check prerequisites

- **No `brief.md`:** stop. Say "There's no brief yet. Run `/campaign-office-hours` first."
  Don't review from a chat description.
- **Brief says Ready for planning: no:** list the missing items and ask whether to continue.
  If they continue, the missing items count against the score (section 6).
- **`plan-cmo.md` already exists:** show its date, score, and decision, and ask "re-review or
  keep?". Re-review when the brief has changed since (compare the dates).

## 2. Who decides

The skill recommends. A person decides. Ask once:

> Are you the one who makes the scope call on this campaign? If not, who is?

- Match the answer to `context/team.md`. The final sign-off or the head of marketing usually
  decides. If the person isn't on the team, ask for their role.
- If the user isn't the decider, run the full review anyway and write the decision as
  `pending: <name>`. Their sign-off happens outside this session, and re-running this skill
  records it.

## 3. Read the room

Before judging, build the picture. Read everything, then show the user a short summary:

- **The bet:** the brief's one-sentence campaign, goal, budget, and launch date.
- **Strategic fit:** which quarterly goal in `context/company.md` it serves, or none.
- **Evidence:** the brief's demand strength (strong, weak, none) and observation.
- **History:** past campaigns to the same persona or channel, with their results from
  `retro.md`, and matching learnings. "No past campaigns to this audience" is a valid answer.
- **Capacity:** other active campaigns in `campaigns/` with the same owner, the same segment,
  or overlapping launch weeks.

Never fill gaps with industry benchmarks or typical rates. If a comparison needs a number
nobody has, write `TBD (needs: <source>)`.

## 4. Premise challenge

Ask these one at a time. Take a position on each and say what would change your mind.

1. **Why this, why now?** If the campaign serves no quarterly goal, say so: "This doesn't
   move any goal in company.md. What does it replace, or why is it worth the team's time?"
2. **What happens if we don't run it?** If the honest answer is "nothing much", recommend
   killing or deferring it.
3. **Is this the best use of the budget and the people?** Compare with the other active
   campaigns from section 3. Name the trade-off, e.g. "Priya owns both this and the Q4
   nurture, and both launch the week of 2026-11-02."

Skip a question if the brief already answers it convincingly. Say that you skipped it and why.

## 5. Choose the scope mode

Recommend one mode, with the reason, then let the user choose. An argument (`expand`,
`selective`, `hold`, `reduce`) skips the recommendation.

| Mode | Recommend when | What it means |
|---|---|---|
| **Expand** | Strong evidence, a past campaign to this audience worked, and there's capacity. | What would the much bigger version be? |
| **Selective expand** | The scope is right, and there are clear add-ons worth weighing. | Keep the scope, offer add-ons one by one. |
| **Hold** | Scope fits the goal and the evidence. Or the date is fixed (an event). | Keep the scope, stress-test it. |
| **Reduce** | Weak or no evidence, a big budget, a short lead time, or no capacity. | Cut to the smallest version that still proves the goal. |

Then run the chosen mode:

**Expand.** Describe the bigger version: more segments, more channels, content reused after
the campaign, a series instead of a one-off. For each idea, give the extra budget, people, and
lead time (from `context/team.md` SLAs), and the evidence it would need. Offer each one
separately. The user opts in. Unchosen ideas go in "Not in scope".

**Selective expand.** List 2 to 5 add-ons. For each: what it adds, effort (people and lead
time), cost, risk, and the expected effect. State the effect qualitatively, or with a number
from a past retro and its source. Ask about each one separately: include, defer, or cut.

**Hold.** Stress-test the plan as it stands. List what could break it and how the plan
handles each. At least cover:
- The segment turns out smaller than assumed, or the count is still `TBD`.
- People respond, then don't convert (registrants who don't attend, clicks with no form fill).
- Responders reach sales, and nobody follows up (check the brief's hand-off).
- The launch slips past a blackout date or another launch to the same segment.
- The budget is too thin for the channel to learn anything.
Each one gets a fix, an owner, or "accepted risk".

**Reduce.** Propose the minimum version that still proves the goal, usually the brief's
smallest test. List every cut with what it saves. Cut only with the user's approval, one cut
at a time. Note what would trigger adding each cut back (the brief's "scale if").

## 6. Score

Score five dimensions, 0 to 10. For each, give the score, one line on why, what a 10 looks like
for this campaign, and the specific change that would raise it.

| Dimension | A 10 looks like |
|---|---|
| **Strategic fit** | Directly moves a named quarterly goal, and nothing more important needs the same people. |
| **Measurability** | A metric, target, and date, a way to track it, and a named hand-off for responders. |
| **Evidence** | Demand evidence strong enough for the size of the bet. A small test can run on weak evidence; a big budget can't. |
| **Economics** | Budget matches the channels and the goal, with stated cost assumptions or past cost data. |
| **Scope and capacity** | A real smallest test, an owner with room to run it, lead times met, no calendar clash. |

**Overall score:** the average of the five, rounded down. Any dimension at 3 or below caps
the overall at 6, a fail. A campaign with no measurable goal can't pass on a strong story.

Score the plan after the scope changes the user approved in section 5, not the original
brief. Show both if they differ: "Brief as written: 5. With the reductions: 7."

Be honest. A 7 means "good enough to spend money on". Don't round up to be kind.

## 7. Verdict and decision

Recommend one verdict:

- **Go:** passes, no changes.
- **Go with changes:** passes with the scope changes in this review.
- **Rework:** fails, but fixable. Name what to fix and which skill re-runs
  (usually `/campaign-office-hours` to update the brief).
- **Kill or defer:** not worth doing this quarter. Say why in one sentence.

Then ask the decider (from section 2) to choose. Record their choice and name.

**Override.** If the score is below 7 and they want to go ahead anyway:
- The override needs a named person with authority from `context/team.md` (usually the
  final sign-off). "The team" doesn't count.
- Ask for the reason in one sentence.
- Append to `status.md` `overrides`: `{gate: cmo, score, who, why, date}`.
- Append the same to `decisions/log.md` in its format:
  `## YYYY-MM-DD: Override CMO gate for <slug> at <score>/10`, with **Why**, **Decided by**,
  and **Alternatives considered** (the recommended verdict).
- If the decider isn't in this session, don't log an override on their behalf. The decision is
  `pending: <name>`, and the gate stays failed until it's recorded.

## 8. Write plan-cmo.md

```markdown
# CMO review: <campaign name>

- **Skill:** /plan-cmo-review
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>
- **Brief dated:** <brief.md date>

## Verdict

- **Score:** <n>/10 (<pass | fail>)
- **Recommended:** <Go | Go with changes | Rework | Kill or defer>
- **Decision:** <verdict chosen> by <name>, <YYYY-MM-DD> | pending: <name>
- **Override:** <none | reason, logged in decisions/log.md>

## The bet

<one sentence: persona, offer, channel, goal, budget, launch date>

## Strategic fit

- **Serves:** <quarterly goal from context/company.md, or "none">
- **If we don't run it:** <answer>
- **Trade-offs:** <competing campaigns, shared owners, shared segments, or "none">

## Scope

- **Mode:** <expand | selective expand | hold | reduce> (<recommended | chosen by user>)
- **Scope changes from the brief:**

| Change | Type (add / cut / change) | Why | Effort or saving |
|---|---|---|---|

- **Not in scope:** <ideas considered and declined or deferred>
- **Add back if:** <trigger from the brief's "scale if", for each cut>

## Stress test

| Risk | How the plan handles it | Owner |
|---|---|---|

## Scores

| Dimension | Score | Why | A 10 looks like | To raise it |
|---|---|---|---|---|
| Strategic fit | | | | |
| Measurability | | | | |
| Evidence | | | | |
| Economics | | | | |
| Scope and capacity | | | | |
| **Overall** | | <average, rounded down; capped at 6 if any dimension ≤ 3> | | |

## For the next reviews

- **Brand review should check:** <message or claim concerns>
- **Ops review should check:** <tracking, segment, hand-off, calendar items>

## Open items

- <every TBD, with what's needed and who can answer>
```

Keep it to one screen where possible. Scope changes and scores matter most.

## 9. Update status

In `campaigns/<slug>/status.md`:

- `stage: plan` (only if the current stage is `brief`).
- `scores.cmo`: the overall score.
- `updated`: today.
- `overrides`: append if section 7 logged one.

## 10. Close

End with:

1. **Written:** `plan-cmo.md` and `status.md`, as clickable paths.
2. **Gate:** score, pass or fail, and the decision (or `pending: <name>`).
3. **If it failed:** the two changes that would most raise the score, and the skill to re-run.
4. **If the brief needs updating** (goal, audience, or offer changed): re-run
   `/campaign-office-hours <slug>` and then this review. Smaller scope changes stay in
   `plan-cmo.md`.
5. **Next:** `/plan-brand-review` (Phase 2), then `/plan-ops-review`. If they aren't built yet,
   send `plan-cmo.md` to the brand and ops owners in `context/team.md`.
