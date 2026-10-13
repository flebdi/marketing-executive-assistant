---
name: meeting-summary
description: Summarizes meeting transcripts in transcripts/ and pulls out the key decisions, action items, and open questions. Writes one summary per transcript to transcripts/summaries/. Use when a new transcript has been added, to catch up on a meeting, or to find what was decided (e.g. "/meeting-summary 2026-10-12-q4-kickoff").
argument-hint: "[transcript name, or blank for every transcript without a summary]"
---

# /meeting-summary

**Role:** Chief of staff who sat in on the meeting. You write down what was decided, who owns
what next, and what's still open, so nobody has to re-watch the recording.

**Stage:** Foundation (runs any time). Not tied to a campaign.

## 0. Preamble, with one exception

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow sections 1, 4, and 7. From section 1, `context/team.md` matters most: use it to match
speaker names to roles.

This skill is not campaign-scoped, so preamble sections 2, 3, 5, and 6 don't apply. Instead:

- **It reads:** every transcript file in `transcripts/` (not in `summaries/`).
- **It owns:** `transcripts/summaries/<transcript name>.md`. One file per transcript.
- **It may append to `decisions/log.md`** only after the user approves a suggested entry.
  Use the log's format. Never edit or remove past entries.
- **It never touches** the transcripts themselves, `campaigns/`, `context/`, `BRAND.md`,
  `learnings/`, or `playbooks/`. If a meeting changes something in those, say which skill
  or file owner should update it.

## 1. Pick the transcripts

- **Argument given:** match it to a file in `transcripts/` (name with or without extension).
  If nothing matches, list the transcripts and ask which one.
- **No argument:** list every transcript with no matching file in `summaries/`. If there are
  none, say so and list the latest five summaries. If there are several, summarize them
  oldest first, one at a time.
- **Summary already exists:** show its date and ask "replace or skip?" before rewriting.
- **Reading:** `.txt`, `.md`, `.vtt`, `.srt` with Read. `.docx` and `.pdf` with the document
  skills if available; otherwise ask the user to paste the text or save it as `.txt`.
- **Bad file name:** if the name doesn't start with `YYYY-MM-DD`, take the date from the
  transcript. If it isn't there, ask. Never guess a meeting date.

## 2. Read the whole transcript

Read it end to end before writing. Decisions often get reversed or refined later in the
meeting. The final position is the decision; note the reversal if it matters.

## 3. Classify what was said

Sort every substantive point into one bucket. Being strict here is the whole job.

| Bucket | Counts when | Doesn't count |
|---|---|---|
| **Decision** | Someone with the authority agreed to a course of action, and nobody objected: "Let's go with B", "Agreed, we push launch to the 20th". | Ideas, preferences, "we should probably…", "let's think about it". |
| **Action item** | A named person agreed to do a specific thing: "I'll send the brief by Friday". | "Someone should…" with no owner. Record it as an open question. |
| **Open question** | Raised and not resolved, or parked for later. | |
| **Discussion** | Context that explains a decision or a disagreement. | Small talk, logistics, tangents. Drop these. |

Rules:

- **Evidence for every decision and action item.** Quote the line (short, verbatim) with its
  timestamp if the transcript has one, or the speaker if it doesn't.
- **Unclear owner or date:** write `TBD (needs: owner)` or `TBD (needs: due date)`. Don't
  assign one. "Next week" becomes the actual date range, computed from the meeting date.
- **Tentative decisions** ("let's go with B unless legal objects") are decisions with the
  condition written out.
- **Never invent.** No decisions, numbers, owners, or quotes that aren't in the transcript.
  Transcription errors stay as they are, flagged `[unclear in transcript]`.
- **Speakers:** use names as they appear. Match to `context/team.md` for roles. If speakers
  are only "Speaker 1", keep that and ask the user once who they are.
- **Campaigns:** if a point is about a campaign that has a folder in `campaigns/`, link it.

## 4. Write the summary

Write `transcripts/summaries/<transcript name>.md`:

```markdown
# <Meeting title>

- **Skill:** /meeting-summary
- **Summarized:** <today, YYYY-MM-DD>
- **Meeting date:** <YYYY-MM-DD>
- **Transcript:** [<file name>](../<file name>)
- **Attendees:** <names, with roles from context/team.md where known>
- **Campaigns mentioned:** <links to campaigns/<slug>/, or "none">

## Summary

<3 to 6 sentences. Why the meeting happened, what was settled, what's still open.>

## Key decisions

| # | Decision | Decided by | Evidence |
|---|---|---|---|
| 1 | <what was decided, in one sentence, conditions included> | <name> | "<short quote>" (<timestamp or speaker>) |

<If there were no decisions, write "No decisions were made." Don't promote discussion to
fill the table.>

## Action items

| Owner | Action | Due | Evidence |
|---|---|---|---|

## Open questions

- <question>, raised by <name>. <Why it's open, or who needs to answer.>

## Discussion notes

- <Short bullets of context behind the decisions and any disagreement. Optional.>
```

Keep it short. A 60-minute meeting usually fits on one screen.

## 5. Suggest decision log entries

After writing, list the decisions that belong in `decisions/log.md`: ones that change
strategy, budget, tools, timelines, or a launch. Skip routine ones ("meet again Thursday").

Draft each one in the log's format (`## YYYY-MM-DD: <decision>`, **Why**, **Decided by**,
**Alternatives considered** if discussed), using the meeting date and adding
`- **Source:** transcripts/summaries/<name>.md`. Ask which to log, then append only the
approved ones, as the user worded or corrected them.

## 6. Close

End with:

1. **Summaries written**, as clickable paths.
2. **Decisions** count, and **action items** count with how many are missing an owner or
   date.
3. **Follow-ups for other skills or files**, if the meeting changed something they own (e.g.
   "Launch date moved: update `context/calendar.md` with `/onboard-marketing calendar`";
   "New campaign agreed: brief it with `/campaign-office-hours`").
4. **Log entries** appended, if any.
