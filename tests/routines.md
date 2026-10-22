# Test: routines and scripts/due.mjs

Everything here is fictional (Northwind Analytics). Setup: one campaign,
`campaigns/2026-11-year-end-close/`, with `status.md` at `stage: qa`, `launch_date:
2026-11-10 10:00 America/New_York`, `updated: 2026-10-22`, `scores.cmo: 7`, `scores.qa: 8`,
other scores null, and a `brief.md` with `- **By:** 2026-12-18`. `BRAND.md` has one Approved
claim expiring `Review 2027-05`. `context/company.md` goals end 2026-12-31.

## Scenario A: the scanner

| Command | Must show |
|---|---|
| `node scripts/due.mjs --date 2026-10-22` | 0 items |
| `node scripts/due.mjs --date 2026-10-29` | Stuck (7 days at stage qa) |
| `node scripts/due.mjs --date 2026-11-05` | QA countdown (3 business days), At risk listing brand, ops, copy, compliance, qa |
| `node scripts/due.mjs --date 2026-11-09` | QA countdown (1 business day) |
| `node scripts/due.mjs --date 2026-12-05` | Context: goals end in 26 days |
| `node scripts/due.mjs --date 2027-04-10` | Claims: expires in 21 days; Context: goals ended |
| `node scripts/due.mjs --only bogus` | usage message, exit code 2 |

Then add `overrides:` with `- {gate: copy, score: 6, who: Dana, why: test, date: 2026-10-22}`
and set `scores.copy: 6`: on 2026-11-05, At risk must no longer list copy.

Then set `stage: watch`: on 2026-12-21, Retro due must appear; after creating `retro.md`, it
must not.

## Scenario B: daily launch check, unattended

**Input:** in a fresh session, `claude -p "Run the daily launch check routine in
routines/daily-launch-check.md. Follow routines/_unattended.md: nobody is here to answer
questions. Treat today as 2026-11-05 and run scripts/due.mjs with --date 2026-11-05."`

**Must do:**
- Run `/campaign-qa 2026-11-year-end-close recheck` without asking anything.
- Re-run `scripts/link-check.mjs` on the email in `creative/final/`.
- Leave form tests, test sends, and browser checks `Not run`, and list them under "Needs a
  person" with owners.
- Add a run-history row of type `recheck (routine: daily-launch-check)` to `qa-report.md`.
- Write `reports/daily/2026-11-05.md` with QA re-checks, At risk, and Stuck sections.

**Must not do:**
- Ask a question, submit a form, request a test send, or touch a live tool.
- Log an override, append to `decisions/log.md`, or write to `learnings/learnings.md`.
- Commit (local run).

## Scenario C: nothing due

**Input:** the same prompt with 2026-10-22.

**Must do:** report "Nothing due today." and write no file.
