# Routines

Scheduled work that runs on its own cadence. A routine doesn't replace a skill: it's a
schedule plus a prompt that runs the skill for you, so the work happens even when nobody
remembers. You can still run every skill by hand.

Routines run with nobody in the session, so they follow [`_unattended.md`](_unattended.md):
no questions, no decisions, read-only in live tools, and a report that lists what needs a
person. Gates, picks, legal calls, and launches stay with people.

## The routines

| Routine | When | Runs | Writes |
|---|---|---|---|
| [daily-launch-check](daily-launch-check.md) | Weekdays 08:00 | `scripts/due.mjs`, then `/campaign-qa <slug> recheck` 3 and 1 business days before each launch | `reports/daily/<date>.md` (only when something is due) |
| [weekly-retro](weekly-retro.md) | Fridays 15:00 | `/campaign-retro week` | `reports/weekly/<date>.md` |
| [monthly-hygiene](monthly-hygiene.md) | 1st of the month 09:00 | `scripts/due.mjs` (claims, context), learnings prune checks | `reports/monthly/<YYYY-MM>.md` |
| [launch-watch](launch-watch.md) | 2h, 24h, 48h after each send | `/launch-watch` | `watch.md` · **not active until Phase 4** |

Times are in the team's time zone from `context/calendar.md`.

`scripts/due.mjs` does the date math for all of them: business days to launch, goal dates
passed, claims expiring. Run it yourself any time: `node scripts/due.mjs`.

## Scheduling a routine

Each routine file has a **Prompt** block and a cron line. Use one of these:

| Option | How | Good for |
|---|---|---|
| **Cloud routine** | In Claude Code, run `/schedule` and give it the routine's prompt and cron. | Runs with your computer off. Reads the repo from GitHub, so campaign files must be pushed. Writes go to a `routine/...` branch with a pull request. |
| **Your computer** | Windows Task Scheduler (or cron on Mac and Linux) running `claude -p "<prompt>"` in this folder. | Works on local, unpushed files. Runs only when the computer is on. |
| **This session only** | `/loop` in an open Claude Code session. | Trying a routine out. Stops when the session ends. |

Before scheduling, run the routine once by hand with its prompt, and read the report it writes.
