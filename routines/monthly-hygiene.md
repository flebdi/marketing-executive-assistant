# Routine: monthly hygiene

Keeps the files every skill depends on from going stale: approved claims near expiry,
quarterly goals that are ending, past rows in the calendar, broken connections, and learnings
that need pruning. It reports. People fix.

- **Schedule:** the first weekday of each month at 09:00 in the team's time zone. Cron, for
  09:00 local on the 1st: `17 9 1 * *`. If the 1st is a weekend, the report waits for Monday
  readers; that's fine.
- **Writes:** `reports/monthly/<YYYY-MM>.md`.
- **Notifies:** the team channel, if connected.
- **Needs:** Node 18+. Nothing connected.

## Prompt

```text
Run the monthly hygiene routine in routines/monthly-hygiene.md. Follow
routines/_unattended.md: nobody is here to answer questions.
```

## Steps

1. Run `node scripts/due.mjs --only claims --json` and `node scripts/due.mjs --only context --json`.
2. **Learnings.** Read `learnings/learnings.md` and run the five checks from `/learnings
   prune` (broken entries, tag hygiene, duplicates, contradictions, stale). List what they
   find. Don't change the file: pruning needs a person to approve each change.
3. **Quarter turn.** If the quarter ends within 30 days, add: "Set next quarter's goals before
   the first brief of the quarter, or CMO reviews will score strategic fit against expired
   goals."
4. Write `reports/monthly/<YYYY-MM>.md`:

```markdown
# Monthly hygiene: <YYYY-MM>

- **Routine:** monthly-hygiene · **Scanner:** scripts/due.mjs

## Needs a person

- <item> → <owner> → <skill or file that fixes it>

## Approved claims

| Claim | Expires | Action |
|---|---|---|

## Context

- <goals, calendar rows, broken connections>

## Learnings to prune

| Entry | Why | Suggested action |
|---|---|---|
```

5. Notify with the "Needs a person" list and the report path.

Owners: claims and voice → the brand approver (`/onboard-marketing voice`); goals →
the final sign-off (`/onboard-marketing pain`); calendar → the email owner
(`/onboard-marketing calendar`); connections → marketing ops; learnings → whoever runs
`/learnings prune`.
