# Test: /campaign-retro

Run in a fresh Claude Code session. Everything here is fictional (Northwind Analytics). No
tools need to be connected: the user supplies the numbers, which tests the fallback path.

## Setup

1. Run the `/onboard-marketing` Scenario A answers (Priya, Sam, Dana; VP Finance persona).
2. Create `campaigns/2026-11-month-end-webinar/` from `_template/` with:
   - `brief.md` containing at least: goal "150 registrants and 60 attendees by 2026-11-18";
     persona VP Finance; smallest test "Email 1 to the 'VP Finance - NA' list first. Scale
     if 3% register, stop under 1%"; owner Priya.
   - `status.md`: `stage: watch`, `scores.brand: 6`, and one override:
     `{gate: brand, score: 6, who: Dana Cole, why: "Launch date fixed by the speaker", date: 2026-11-01}`.
   - `qa-report.md` with one Blocker `Fixed` (a misspelled `utm_campaign`) and gate PASS.
3. Leave `learnings/learnings.md` with no entries.

Reset by deleting the campaign folder, `reports/weekly/`, and `git checkout -- learnings`.

## Scenario A: final retro, numbers from the user

**Input:** `/campaign-retro 2026-11-month-end-webinar` (today is after 2026-11-18).

| Step | User says |
|---|---|
| Results (tools not connected) | "No export. Here: 120 registered, 41 attended. Email 1 went to 1,800 people, 61 registered from it. We then sent emails 2 and 3 to the full list." |
| Confirm numbers | "Yes." |
| Surprised? | "Attendance was way lower than registrations." |
| Do differently? | "Send a reminder the morning of. We only sent one the day before." |
| Sales/customers? | "Nothing specific." |
| Learning drafts | Keep the attendance one, edit nothing, drop any others. |
| Done? | "Yes." |

**Must do:**
- Say which tools aren't connected and ask for an export before using the user's numbers.
- Show results vs goal and ask the user to confirm them: 120 vs 150 registrants, 41 vs 60
  attendees. Verdict **Missed** (neither hit, both more than 10% under).
- Name registered → attended (34%) as the biggest drop-off.
- Report the smallest test: 61 of 1,800 is 3.4%, above the 3% "scale if", so scaling was the
  right call.
- Check the brand override: say whether the flagged brand risk shows up in the results, or
  that the data can't tell.
- Label "one reminder caused low attendance" as a hypothesis.
- Draft at most 3 learnings, at low or medium confidence (one campaign), with tags such as
  `channel:email · audience:vp-finance · tactic:reminders`.
- Write only the approved learning, directly below the `<!-- Entries go below... -->` line.
- Set `stage: retro`, then `stage: done` after "Yes".
- Suggest decision log entries and ask before appending.

**Must not do:**
- Invent opens, clicks, or opportunities. They're `TBD (needs: ...)` in the funnel.
- Rate Priya or anyone else. Owner notes describe decisions and effects.
- Edit `brief.md`, `qa-report.md`, `playbooks/`, or `context/`.
- Write learnings the user dropped.

## Scenario B: a learning that already exists

**Setup:** before running Scenario A, add an entry to `learnings/learnings.md` titled
"Same-day reminders lift webinar attendance" from campaign `2026-06-q2-webinar`, confidence
low.

**Must do:** propose a `Confirmed by: 2026-11-month-end-webinar (...)` line on that entry
instead of a duplicate, and offer to raise its confidence by one level.

**Must not do:** add a second entry with the same lesson.

## Scenario C: interim retro

**Input:** set the brief's goal date to 30 days from today, then
`/campaign-retro 2026-11-month-end-webinar`.

**Must do:** title it "(interim)", report results to date and the pace needed, draft learnings
only at low confidence, leave `stage` unchanged, and offer to run the final retro on the goal
date.

## Scenario D: weekly retro

**Setup:** add a second campaign, `2026-12-q4-nurture`, at `stage: plan` with `updated` 10 days
ago. Keep the webinar from Scenario A at `stage: watch` with its goal date passed and no
`retro.md`.

**Input:** `/campaign-retro week`

**Must do:**
- Flag `2026-12-q4-nurture` as stuck and the webinar as retro due, each with its owner.
- Write `reports/weekly/<today>.md` with Needs action, Campaigns, and Learnings this week.

**Must not do:** write learnings, or change either campaign's `status.md`.

## Pass criteria

- `retro.md` has Verdict, Results vs goal, Funnel, What worked, What didn't, Process check,
  Owner notes, Learnings, Follow-ups, and Data sources, with every number cited `(user)` or
  from a tool.
- Each new learning in `learnings/learnings.md` has every field in the file's format.
