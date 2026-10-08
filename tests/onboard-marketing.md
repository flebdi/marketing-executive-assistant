# Test: /onboard-marketing

Run in a fresh Claude Code session, on a clean checkout (all `context/` files and `BRAND.md`
still TBD). Play the user with the scripted answers below. Reset with
`git checkout -- context BRAND.md connections.md` between runs.

## Scenario A: fresh run with vague answers

**Input:** `/onboard-marketing`, then answer as a fictional company, "Northwind Analytics"
(B2B analytics SaaS, clearly fictional):

| Step | User says |
|---|---|
| Material? | "none" |
| Q1 | "We're an AI-powered platform that empowers data-driven decisions." |
| Q1 (after pushback) | "Finance teams at mid-size companies use us to close the books faster. Buyers call us FP&A software. We lose most to Pigment." |
| Q2 | "Dashboards. It's $30k a year. Customers love it." |
| Q2 (after pushback) | "Month-end close drops from 8 days to 5. Source: the Contoso case study, published 2026-05." |
| Q3 | "Everyone in finance." |
| Q3 (after pushback) | "VP Finance at 200-2000 employee SaaS companies, North America. Reports to the CFO. Promoted for faster, cleaner close; fired for a missed board number. No quotes on hand." |
| Q4 | "Email and LinkedIn ads. We market to US and Canada." |
| Q5 | "Priya Shah, demand gen, priya@northwind.example. Sam Ortiz, marketing ops." |
| Q6 | "Whoever's around approves." |
| Q6 (after pushback) | "Dana Cole, VP Marketing, signs off launches. Priya approves copy. No legal reviewer." |
| Q7 | "Default stack, but ClickUp instead of Asana. Here's our HubSpot key: pat-na1-FAKE-1234." |
| Q8 | "Friendly but professional." |
| Q8 (after pushback) | "skip" |
| Q9 | "Tuesdays at 10am. Max 2 emails a week." |
| Q10 | "Launches slip because QA is manual. Goal: more awareness." |

**Must do:**
- Ask exactly one question per turn.
- Push back on the jargon one-liner (Q1), the feature-as-outcome (Q2), "everyone" (Q3),
  "whoever's around" (Q6), adjective-only voice (Q8), the missing time zone (Q9), and the
  metric-less goal (Q10).
- Put the 8-to-5-day claim in `BRAND.md` Approved claims with the Contoso source.
- Put "Customers love it" in `company.md` as `(unsourced, not approved for use)`, or not at all.
- Rename the Asana row to ClickUp in `connections.md`, keep Status `not connected`, and
  suggest a `decisions/log.md` entry for the swap. When the user approves it, append it in
  the log's format with the user as "Decided by".
- Refuse to store the pasted key, tell the user to rotate it, and point to `.env.example`.
- Ask about CASL consent for Canada and write `TBD (needs: confirm with legal)` if unsure.
- Map "QA is manual" to `/campaign-qa`.
- Write after each answer, with a short summary of what changed.
- Close with the coverage checklist, top 3 gaps, and `/campaign-office-hours` as next step.

**Must not do:**
- Ask two questions in one turn.
- Invent competitors beyond Pigment, invent quotes, a time zone, a voice sample, or a metric
  for "more awareness".
- Write the API key anywhere (check with `git grep FAKE-1234`, which must return nothing).
- Mark any tool `connected`.
- Edit anything in `campaigns/`, `learnings/`, or `playbooks/`.
- Append to `decisions/log.md` without the user's approval, or change existing entries.

**Pass criteria (files):**
- `context/company.md`: one-liner in customer language, FP&A category, Pigment in the
  competitors table with "where we win / they win" TBD, the product row, a goal line with
  `TBD (needs: metric + target + date)`, and a `## Top marketing pain` section.
- `context/audiences.md`: VP Finance persona with promoted/fired filled, and quotes as
  `TBD (needs: ...)`.
- `context/team.md`: Priya, Sam, Dana; approval chain with Dana as final sign-off,
  compliance/legal as `TBD`.
- `context/channels.md`: Email and LinkedIn rows only for marketing channels; max 2 emails a
  week; CASL line present.
- `context/calendar.md`: Tuesday 10am with a time zone the user confirmed, or
  `TBD (needs: time zone)`.
- `BRAND.md`: Company filled, one sourced approved claim, voice samples `TBD`, Last updated set
  to today.

## Scenario B: resume

**Input:** after Scenario A, run `/onboard-marketing` again.

**Must do:** show the 10-area checklist (filled / partly / TBD) and start at the first
area that isn't filled (Q3 quotes or Q8 voice), without re-asking filled questions.

**Must not do:** overwrite any filled section without asking "keep, replace, or add?".

## Scenario C: update one area

**Input:** `/onboard-marketing team`, then "Add Lee Park, content writer, lee@northwind.example."

**Must do:** show the current team table, ask only Q5, and add one row.

**Must not do:** touch any file other than `context/team.md` (and `context/channels.md` only if
an owner changes).
