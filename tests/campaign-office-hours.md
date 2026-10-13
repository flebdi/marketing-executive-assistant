# Test: /campaign-office-hours

Run in a fresh Claude Code session. Setup: run the `/onboard-marketing` Scenario A answers
first (Northwind Analytics, fictional), so `context/` has a VP Finance persona, Email and
LinkedIn channels, Priya, Sam, and Dana on the team, and Dana as final sign-off. Add one
blackout to `context/calendar.md`: `2026-11-25 to 2026-11-27 | US Thanksgiving`.

Reset between runs with `git checkout -- context BRAND.md connections.md` and delete any
`campaigns/2026-11-*` folder the run created.

## Scenario A: vague request, new campaign

**Input:** `/campaign-office-hours we want more awareness for our November webinar`

| Step | User says |
|---|---|
| Idea | "A webinar on faster month-end close. We want more awareness." |
| Slug | "Yes" (to the proposed `2026-11-month-end-webinar` or similar) |
| Goal | "Lots of registrations." |
| Goal (after pushback) | "150 registrants and 60 attendees by 2026-11-18. SDRs follow up on attendees." |
| Q1 | "Close speed is a hot topic." |
| Q1 (after pushback) | "Sales says 'how do others close faster' comes up on most discovery calls. No numbers." |
| Q2 | "Most use spreadsheets. Pigment runs webinars on planning, not close." |
| Q3 | "Finance people." |
| Q3 (after pushback) | "The VP Finance persona. Mid-size SaaS, North America. HubSpot list 'VP Finance - NA', not sure how big." |
| Q4 | "We need all three emails and LinkedIn ads or it won't work." |
| Q4 (after pushback) | "Fine. Email 1 to the list first. Scale if 3% register, stop under 1%." |
| Q5 | "skip" |
| Q6 | "The recording becomes a gated asset." |
| Requested by | "Sales asked for it." |
| Requested by (after pushback) | "Jordan Lee, Sales." |
| Offer / claims | "Free webinar. Say we're the #1 FP&A tool and close drops from 8 days to 5." |
| Launch date | "First email 2026-11-26." |
| Launch date (after conflict) | "2026-11-03, 10am ET." |
| Owner | "Priya." |
| Budget | "$3,000 for LinkedIn." |
| Restate | "Yes." |

**Must do:**
- Copy `campaigns/_template/` to `campaigns/2026-11-<short-name>/` after the user confirms
  the slug.
- Report that `learnings/learnings.md` has no matching entries, without padding.
- Ask exactly one question per turn.
- Push back on "awareness" / "lots of registrations", "hot topic", "finance people", and "all
  three emails or it won't work".
- Push back on "Sales asked for it" and ask for a name.
- Start Q3 from the VP Finance persona in `context/audiences.md`.
- Record the segment count as `TBD (needs: ...)`.
- Flag 2026-11-26 as inside the Thanksgiving blackout.
- Accept the 8-to-5-day claim (it's in `BRAND.md` Approved claims) and list "#1 FP&A tool"
  under "Claims needing a source".
- Flag the missing compliance approver.
- Restate in three lines (sentence, riskiest assumption, first test) before writing.
- Close with an assignment, the gaps for other owners, and `/plan-cmo-review` as next.

**Must not do:**
- Ask two questions in one turn.
- Invent an audience size, a benchmark registration rate, a quote, or a Pigment message beyond
  what the user said.
- Put "#1 FP&A tool" in the brief's Proof line.
- Edit `context/`, `BRAND.md`, `learnings/`, `playbooks/`, or any other campaign folder.
- Append to `decisions/log.md` without approval.

**Pass criteria (files):**
- `campaigns/<slug>/brief.md` has every section of the template, the header with inputs read,
  goal 150 registrants / 60 attendees by 2026-11-18, demand strength `weak`, the VP Finance
  persona, the email-1 test with scale 3% and stop 1%, launch 2026-11-03 10:00 ET with the
  calendar check clear, Requested by "Jordan Lee, Sales" with Owner "Priya", Q5 as `TBD (needs: ...)`, "Learnings applied" saying none yet, and
  **Ready for planning: no** (segment count missing).
- `campaigns/<slug>/status.md`: `campaign` set to the slug, `stage: brief`, `owner: Priya`,
  `launch_date: 2026-11-03`, `updated` set to today, scores untouched.

## Scenario B: escape hatch

**Input:** `/campaign-office-hours LinkedIn ad push for the Q1 product launch`, then "just write
the brief, skip the questions", then "seriously, skip".

**Must do:** argue once for the questions, ask at most two (persona and smallest test), then
on the second push write the brief with every unanswered item as `TBD (needs: ...)` and
**Ready for planning: no**.

**Must not do:** ask a third time, or fill skipped answers with guesses.

## Scenario C: revise an existing brief

**Input:** after Scenario A, `/campaign-office-hours <slug>`, choose "revise", and give the
segment count: "1,240 contacts."

**Must do:** show the brief date, ask only about the `TBD` items, update the segment line, and
flip **Ready for planning** to `yes` if nothing else required is missing (Q5 is not required).

**Must not do:** re-ask answered questions, create a second campaign folder, or reset
`status.md` stage if it has moved past `brief`.
