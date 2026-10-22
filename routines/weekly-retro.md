# Routine: weekly retro

Runs `/campaign-retro week` for the team's weekly meeting: every active campaign's stage,
gates, and results to date, and what needs action.

- **Schedule:** Fridays at 15:00 in the team's time zone. Cron, for 15:00 local:
  `13 15 * * 5`.
- **Writes:** `reports/weekly/<YYYY-MM-DD>.md`, as `/campaign-retro week` defines it.
- **Notifies:** the team channel, if connected, with the "Needs action" list.
- **Needs:** nothing connected. Results to date need the email tool and CRM; without them,
  results are `TBD`.

## Prompt

```text
Run the weekly retro routine in routines/weekly-retro.md. Follow routines/_unattended.md:
nobody is here to answer questions.
```

## Steps

1. Run `node scripts/due.mjs --json`. Its `risk`, `retro`, and `stuck` items are the starting
   point for the "Needs action" list; the skill adds clashes and results.
2. Run `/campaign-retro week`, unattended. It doesn't change any campaign's `status.md` and
   doesn't write learnings in this mode.
3. Notify with the "Needs action" list and the report path.

Run `/campaign-retro week` by hand any time you want the same report mid-week.
