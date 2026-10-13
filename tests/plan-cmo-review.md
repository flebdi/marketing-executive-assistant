# Test: /plan-cmo-review

Run in a fresh Claude Code session. Setup: run `tests/campaign-office-hours.md` Scenario A
(Northwind Analytics, fictional), so `campaigns/<slug>/brief.md` exists with weak demand
evidence, a $3,000 LinkedIn budget, an email-1 test, Priya as owner, Dana as final sign-off,
and **Ready for planning: no** (segment count missing).

Reset between runs by restoring `campaigns/<slug>/status.md` from the end of that setup and
deleting `plan-cmo.md`. Restore `decisions/log.md` with `git checkout -- decisions/log.md`.

## Scenario A: weak evidence, user is the decider

**Input:** `/plan-cmo-review`

| Step | User says |
|---|---|
| Continue with gaps? | "Yes." |
| Who decides? | "Me, I'm Dana." |
| Why now? | "It's for the pipeline goal." |
| If we don't run it? | "Sales loses a reason to follow up with open deals." |
| Best use of budget? | "Yes." |
| Mode | "Go with your recommendation." |
| Each cut | "Yes" to cutting LinkedIn ads until email 1 hits 3%; "no" to cutting emails 2 and 3. |
| Verdict | "Go with changes." |

**Must do:**
- Find the single active campaign without asking for a slug.
- List the brief's missing items and ask before continuing.
- Ask who decides, and match Dana to `context/team.md`.
- Ask the premise questions one at a time, and take a position on each.
- Recommend **Reduce** (weak evidence) or **Hold**, with the reason.
- Propose cuts one at a time and apply only the approved one.
- Score all five dimensions with why, what a 10 looks like, and how to raise it.
- Show the brief-as-written score and the after-changes score if they differ.
- Flag the missing segment count in Measurability or Scope, and in "Ops review should check".
- Close with `/plan-brand-review` as next.

**Must not do:**
- Edit `brief.md`.
- Use an industry benchmark (e.g. "typical webinar attendance is 40%") or invent a cost per
  registrant.
- Cut emails 2 and 3 after the user said no.
- Ask two questions in one turn.

**Pass criteria (files):**
- `plan-cmo.md` has every template section, Mode `reduce` or `hold`, the LinkedIn cut in the
  scope changes table with its "add back if" trigger, emails 2 and 3 not cut, five scored
  dimensions with an overall that follows the averaging and cap rule, and Decision "Go with
  changes by Dana Cole, <today>".
- `status.md`: `stage: plan`, `scores.cmo` equals the overall score, `updated` today.

## Scenario B: fail and override

**Setup:** edit the brief's Goal to `TBD (needs: metric + target + date)`.

**Input:** `/plan-cmo-review`, "Me, I'm Dana", then accept the questions, and at the verdict say
"Ship it anyway. Sales already promised the webinar to customers."

**Must do:**
- Score Measurability at 3 or below and cap the overall at 6 (fail).
- Recommend **Rework**, naming `/campaign-office-hours` to fix the goal.
- On "ship it anyway", ask for or confirm the one-line reason, then log the override in
  `status.md` `overrides` and in `decisions/log.md`, with Dana as Decided by.

**Must not do:** pass the gate, or score above 6.

## Scenario C: the user isn't the decider

**Input:** `/plan-cmo-review`, "No, Dana decides", then go with every recommendation.

**Must do:** run the full review, write the Decision as `pending: Dana Cole`, and say the gate
stays as scored until Dana's decision is recorded by re-running the skill.

**Must not do:** log an override or a decision on Dana's behalf.

## Scenario D: no brief

**Input:** create `campaigns/2026-12-test/` from `_template/` with no `brief.md`, then
`/plan-cmo-review 2026-12-test`.

**Must do:** stop and point to `/campaign-office-hours`.

**Must not do:** write `plan-cmo.md` or change `status.md`.
