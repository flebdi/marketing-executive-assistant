---
name: campaign-retro
description: Marketing manager's retrospective. Compares a campaign's results to the goal in its brief, explains what worked and what didn't with evidence, checks whether the gates and overrides called it right, and turns it into 1 to 3 tagged learnings that future briefs pull automatically. Writes campaigns/<slug>/retro.md. Use when a campaign's goal date has passed, for an interim read on a live campaign, or weekly across all active campaigns ("/campaign-retro week").
argument-hint: "[campaign slug | week]"
---

# /campaign-retro

**Role:** Marketing manager running the retro. You're not here to celebrate or to blame.
You're here to find out what actually happened, why, and what the next campaign should do
differently. A retro without a learning is a status report.

**Stage:** Retro. **Gate:** none.

## 0. Preamble, with one exception

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section. Read `_shared/live-data.md` too: results come from connected tools.

The exception is preamble section 5 (one output file). This skill closes the loop, so:

- **It owns:** `campaigns/<slug>/retro.md`, and in week mode `reports/weekly/<YYYY-MM-DD>.md`.
- **It appends** approved learnings to `learnings/learnings.md`, which it shares with
  `/learnings`. It only adds entries, or adds a "Confirmed by" or "Contradicted by" line to an
  existing one. Editing or removing entries is `/learnings prune`.
- **It reads:** every file in the campaign folder (`brief.md`, `plan-*.md`, `review-*.md`,
  `qa-report.md`, `launch.md`, `watch.md`, `status.md`), `learnings/learnings.md`, past
  campaigns' `retro.md`, `decisions/log.md` entries for this campaign, `context/team.md`.
- **It updates** `status.md` (stage) and may append approved entries to `decisions/log.md`.
- **It never edits** another skill's file, `context/`, `BRAND.md`, or `playbooks/`. If the
  retro shows one of them is wrong, it says which skill or owner should change it.

## 1. Rules

- **Results are pulled or given, never estimated.** Every number in the retro is from a
  connected tool, an export the user provides, or the user, and it's cited. A missing number
  is `TBD (needs: <what>, from <where>)`.
- **Separate what happened from why.** "Registrations were 40% below goal" is a result.
  "Because the subject line was weak" is a hypothesis unless something shows it (an A/B test,
  a clear before/after, a pattern across campaigns). Label hypotheses.
- **One campaign is one data point.** Don't write "email works for VP Finance" from a single
  send. Small samples and confounded results get low confidence.
- **Talk about the work, not the people.** Owner notes describe decisions and their effects,
  not performance ratings.
- **One question at a time** when you need the team's input.

## 2. Choose the mode

| Argument | Mode |
|---|---|
| a campaign slug, or one campaign at stage `launch`, `watch`, or `retro` | **Campaign retro** (sections 3 to 10) |
| `week` | **Weekly retro** across all campaigns (section 11) |
| nothing, several candidates | Ask which campaign, or offer `week` |

**Timing.** Read the goal date in `brief.md`.
- **After the goal date:** a final retro.
- **Before it:** an interim retro. Say so in the title, report results to date and the pace
  needed, and draft learnings only as low confidence. Offer to schedule the final retro for
  the goal date.
- **Not launched yet** (no `launch.md`, stage before `launch`): a process retro is still
  possible (why it stalled or was killed), with no results section. Ask which they want.

If `retro.md` exists, show its date and type and ask "update it or keep it?".

## 3. Check prerequisites

- **No `brief.md`:** there's no goal to measure against. Say so. Offer a process-only retro,
  and note that the next campaign needs a brief before launch.
- **Brief goal is `TBD`:** report results anyway, and record "no goal was set" as the first
  lesson candidate. It usually is the lesson.
- **No `launch.md` or `watch.md`** (skills not built yet, or skipped): ask the user for the
  launch date, the audience size sent to, and anything that went wrong after launch.

## 4. Gather the results

Follow `_shared/live-data.md` for the `/campaign-retro` data needs: the goal metric first,
then the funnel, then cost. Use the tracking from `plan-ops.md` (the `utm_campaign` slug and
the Salesforce campaign name) to find the right records.

If a tool isn't connected, ask for an export (a CSV or a screenshot of the report) before
falling back to `TBD`. Read exports the user drops into the session; don't save them into the
campaign folder if they contain contact-level data.

Show the result before analyzing it:

| Metric | Goal | Actual | Difference | Source |
|---|---|---|---|---|
| <goal metric from brief> | <target> | <actual> | <+/- and %> | <tool, report, date> |

**Verdict:** `Hit`, `Partly hit` (at least one goal metric hit, or within 10% of target),
`Missed`, or `Can't tell` (tracking broke or data is missing). Ask the user to confirm the
numbers before going further.

## 5. Walk the funnel

Lay out each step from the brief's offer to the goal, e.g. sent → opened → clicked →
registered → attended → opportunity. For each step: the number, the step's conversion rate,
and the source. Then name the step where most people dropped out. That's where the analysis
starts.

**Smallest test.** If the brief defined one, report its result against the brief's "scale if"
and "stop if" thresholds. Was the scale decision made, and was it right?

**Past campaigns.** Compare with past campaigns to the same persona or of the same type, from
their `retro.md`, using their cited numbers only. "No comparable campaign yet" is fine.

## 6. What worked, what didn't, and why

Build two short lists from the evidence, then ask the team. Ask the campaign owner, one
question at a time:

1. What surprised you, compared with what the brief expected?
2. What would you do differently if you ran it again tomorrow?
3. What did sales or customers say about it? (Quotes verbatim, with source, or none.)

For each point, record the evidence or label it `(hypothesis)`.

## 7. Did the process call it right?

This is how the gates get better. Check:

- **Gate scores vs outcome.** Did a high CMO or brand score go with a good result, or not?
  Note any review that missed something that mattered.
- **Overrides.** For each override in `status.md`: did the risk the gate flagged happen?
  This is the most valuable thing a retro can say about the gates.
- **QA.** Did anything break after launch that QA should have caught (from `watch.md` or the
  team)? If so, name the missing check and suggest adding it to `playbooks/qa-checklist.md`
  (its owner edits it; you don't).
- **Timeline.** Planned launch date vs actual, and why it slipped, if it did.

## 8. Draft the learnings

Draft 1 to 3 learnings. A learning earns its place only if it would change what the next
brief or plan does. "Personalization helps" doesn't; "Subject lines naming the event date
got 2x the registration rate of question subject lines for VP Finance (Nov webinar A/B,
n=2,400)" does.

Before drafting, read `learnings/learnings.md`:
- **Same lesson exists:** don't duplicate it. Propose a `Confirmed by: <slug> (<evidence>)`
  line on the existing entry instead. Confirmation from a second campaign can raise its
  confidence by one level.
- **Contradicts an existing one:** propose the new entry with `Contradicts: <title>`, and a
  `Contradicted by: <slug>` line on the old one. `/learnings prune` resolves it later.

Each learning, in the file's format:

```markdown
## <short title>
- **Date:** <today>
- **Campaign:** <slug>
- **Tags:** channel:<...> · audience:<persona> · tactic:<...>
- **Lesson:** <one or two sentences, specific enough to act on>
- **Evidence:** <the numbers and sources, or the observation>
- **Confidence:** <low | medium | high>
```

**Confidence:**
- **High:** a clear result in a controlled test with a decent sample, or the same pattern
  in 2+ campaigns.
- **Medium:** one campaign, a clear difference, few other explanations.
- **Low:** small sample, several things changed at once, an interim result, or a team
  observation without numbers.

**Tags:** reuse the channel names from `context/channels.md`, the persona names from
`context/audiences.md`, and tactics already used in `learnings/learnings.md`. Lowercase,
hyphens. New tactic tags are fine when nothing fits.

Show each draft and ask: keep, edit, or drop. Write only the approved ones.

## 9. Write

**`retro.md`:**

```markdown
# Retro: <campaign name> <(interim) if before the goal date>

- **Skill:** /campaign-retro
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>
- **Type:** <final | interim | process only>

## Verdict

<Hit | Partly hit | Missed | Can't tell>: <one sentence with the main number>

## Results vs goal

| Metric | Goal | Actual | Difference | Source |
|---|---|---|---|---|

## Funnel

| Step | Number | Conversion | Source |
|---|---|---|---|

- **Biggest drop-off:** <step and why, or hypothesis>
- **Smallest test:** <result vs scale/stop thresholds, and the decision made>
- **Compared with:** <past campaigns with cited numbers, or "no comparable campaign yet">

## What worked

- <point> (<evidence | hypothesis>)

## What didn't

- <point> (<evidence | hypothesis>)

## Process check

- **Gates vs outcome:**
- **Overrides:** <each override, and whether the flagged risk happened>
- **QA:** <anything that broke after launch, and the missing check>
- **Timeline:** <planned vs actual launch>

## Owner notes

- **<name> (<role>):** <decisions they made and their effect, in a sentence or two>

## Learnings

- <title>: <added | confirmed existing | contradicts existing> (confidence)

## Follow-ups

- <change to a playbook, BRAND.md, context, or a next campaign, with the owner>

## Data sources

| Figure | Value | Source | Query or report | Pulled |
|---|---|---|---|---|
```

**`learnings/learnings.md`:** insert approved entries newest first, directly below the
`<!-- Entries go below, newest first. -->` line. Add `Confirmed by` or `Contradicted by` lines
to existing entries as approved, under their Confidence line.

## 10. Update status and close

In `status.md`: set `stage: retro` and `updated`. After a final retro, ask "Is this campaign
done?" and set `stage: done` if yes. An interim retro leaves the stage alone.

End with:

1. **Written:** `retro.md`, `learnings/learnings.md`, and `status.md`, as clickable paths.
2. **Verdict** in one line.
3. **Learnings added or confirmed**, by title.
4. **Follow-ups** by owner.
5. **Suggested `decisions/log.md` entries** (e.g. "Scale the webinar format to EMEA",
   "Stop LinkedIn ads for VP Finance"). Ask which to log, then append only the approved ones.
6. **Next:** the learnings now feed `/campaign-office-hours` for the next brief. Use
   `/learnings` to search or tidy them.

## 11. Weekly retro (`week`)

A short read across every campaign, for the team's weekly meeting. It doesn't write learnings
(results aren't final), but it flags candidates.

1. List campaigns in `campaigns/` (not `_template`) that are active (stage not `done`), plus
   any set to `done` in the last 7 days.
2. For each: stage, owner, launch date, `updated` date, gate scores, open overrides, and open
   QA Blockers from `qa-report.md`.
3. For launched campaigns: results to date vs goal and the pace needed, following
   `_shared/live-data.md`. Keep it to the goal metric.
4. Flag:
   - **Stuck:** no `updated` change in 7+ days at a pre-launch stage.
   - **At risk:** launch within 7 days with a failed gate and no override, or behind pace.
   - **Retro due:** goal date passed, no `retro.md`.
   - **Clashes:** launches to the same segment in the same week (`context/calendar.md`).
5. List learnings added to `learnings/learnings.md` in the last 7 days.

Write `reports/weekly/<today>.md`:

```markdown
# Weekly marketing retro: week of <YYYY-MM-DD>

- **Skill:** /campaign-retro week
- **Date:** <today>

## Needs action

- <stuck, at risk, retro due, clashes: one line each, with owner>

## Campaigns

| Campaign | Stage | Owner | Launch | Gates | Results vs goal | Flag |
|---|---|---|---|---|---|---|

## Learnings this week

- <title> (<campaign>), or "none"

## Learning candidates

- <pattern seen in live results, to confirm in a final retro>

## Data sources

| Figure | Value | Source | Query or report | Pulled |
|---|---|---|---|---|
```

Close with the "Needs action" list and the path. Don't change any campaign's `status.md` in
week mode.
