# Routine: launch watch

**Status: not active.** It runs `/launch-watch`, which is built in Phase 4. This file is the
spec that skill and `/launch` will follow.

Watches a campaign right after it goes out, when problems are cheapest to stop: bounces,
spam complaints, broken links, form errors, and click rates far off plan.

- **Schedule:** not a fixed cron. `/launch` schedules three one-time runs per send: 2 hours,
  24 hours, and 48 hours after the send time in `launch.md`.
- **Writes:** `campaigns/<slug>/watch.md` (owned by `/launch-watch`).
- **Notifies:** the campaign owner and the final sign-off, right away, if a stop condition from
  `plan-ops.md` is met.

## Prompt

```text
Run the launch watch routine in routines/launch-watch.md for <slug>, check <2h | 24h | 48h>.
Follow routines/_unattended.md: nobody is here to answer questions.
```

## Rules

- It reads results and alerts. It never pauses or cancels a send by itself: the stop plan in
  `plan-ops.md` names who can, and that person decides.
- The 48h run suggests the date for `/campaign-retro`; the daily launch check reminds the
  owner when the goal date passes.
