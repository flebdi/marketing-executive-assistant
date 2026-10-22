# Routine: daily launch check

Catches launch problems while there's still time to fix them. Re-runs QA 3 business days and
1 business day before each launch, flags launches at risk, campaigns that stopped moving, and
retros that are due.

- **Schedule:** weekdays at 08:00 in the team's time zone (`context/calendar.md`, Send rules).
  Cron, for 08:00 local: `7 8 * * 1-5`.
- **Writes:** `reports/daily/<YYYY-MM-DD>.md`, only when something is due. Re-check runs also
  update that campaign's `qa-report.md` and `status.md` (`scores.qa`).
- **Notifies:** the team channel, if connected. Otherwise the run's output.
- **Needs:** Node 18+. No connected tools required; QA does more when they are.

## Prompt

Paste this into the scheduler:

```text
Run the daily launch check routine in routines/daily-launch-check.md. Follow
routines/_unattended.md: nobody is here to answer questions.
```

## Steps

1. Run `node scripts/due.mjs --json`. If it returns no items for `qa`, `risk`, `retro`, or
   `stuck`, stop and report "Nothing due today." Write no file.
2. **QA countdown.** For each `qa` item, run `/campaign-qa <slug> recheck` unattended: repeat
   the steps for each open finding that can be checked from files and links, re-run
   `scripts/link-check.mjs` on every asset in `creative/final/` that changed since the last
   run, and leave form tests, test sends, and browser checks `Not run` unless their result is
   already recorded. Update `qa-report.md` and `scores.qa` as the skill says.
3. **At risk, retro due, stuck:** list them. Don't run other skills for them.
4. Write `reports/daily/<today>.md`:

```markdown
# Daily launch check: <YYYY-MM-DD>

- **Routine:** daily-launch-check · **Scanner:** scripts/due.mjs

## Needs a person

- <campaign> (<owner>): <what, and by when>

## QA re-checks

| Campaign | Launch | Gate | Open Blockers | Not run (needs) | Changed since last run |
|---|---|---|---|---|---|

## At risk

- <campaign> (<owner>): <failed gates, days to launch>

## Retro due

- <campaign> (<owner>): goal date <date> → `/campaign-retro <slug>`

## Stuck

- <campaign> (<owner>): <days without an update, stage>
```

5. Notify with the "Needs a person" list and the report path.

## Why these dates

QA at 3 business days leaves time to fix a Blocker. QA at 1 business day catches anything that
changed after the fix. Both read the launch date from each campaign's `status.md`, so moving a
launch moves its checks.
