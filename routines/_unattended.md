# Running a skill unattended

Rules for any skill run by a routine, with nobody in the session to answer. They override the
skill's ask-the-user steps. Everything else in the skill still applies.

## No questions

- Never ask. Where a skill would ask, take the **safe default** below, and list the question
  under "Needs a person" in the report, with who should answer it (from `context/team.md`).
- **Prerequisite warnings** ("No `plan-ops.md`. Continue?"): continue only if the skill can
  still produce a useful, honest result. Mark every check that couldn't run `Not run`.
- **"Re-check or full run?":** re-check.
- **Missing inputs** (a test send, a preview URL, a segment count): `Not run` or
  `TBD (needs: ...)`. Never guess.

## No decisions

- Never pick a scope mode, approve a gate, accept a Major, pick a creative variant, decide a
  Needs legal item, or approve a learning. Those need a named person.
- Never log an override or append to `decisions/log.md`.
- Never write to `learnings/learnings.md`. Draft candidates go in the report.

## Read-only in live tools

- Tier 1 reads only, per `_shared/live-data.md`. No tier 2 writes: no tasks, tickets, or CRM
  changes.
- Never submit a test form, request a test send, send, publish, schedule, or delete.
- **One exception:** a short notification to the team channel (Slack) if it's connected at
  tier 2. Summary and file paths only, no contact data.

## Files

- Write only the files the routine names. A skill run unattended may update its own output
  file (e.g. `qa-report.md` in re-check mode) and the `status.md` fields that skill owns.
- Mark the run in the file: run type `<skill> (routine: <routine name>)`.
- **Local runs:** leave the changes in the working tree. Don't commit.
- **Cloud runs:** commit only the files the routine names, to a new branch
  `routine/<routine-name>/<YYYY-MM-DD>`, and open a pull request. Never push to `main`.

## Report

End every run with a short summary in this order:

1. **Needs a person:** each item, with owner and why.
2. **Done:** what ran, and the files written.
3. **Not run:** what couldn't run, and what it needs.
